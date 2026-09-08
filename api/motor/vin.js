import crypto from 'node:crypto';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
const MOCK_VIN = '1HGCM82633A004352';
const DEFAULT_BASE_URL = 'https://api.motor.com';
const DEFAULT_VIN_PATH = '/v1/Information/Vehicles/Search/ByVIN';
const REQUEST_TIMEOUT_MS = 10_000;

function send(response, status, body) {
  response.status(status).json(body);
}

function sendError(response, status, code, message) {
  send(response, status, { error: { code, message } });
}

async function authenticate(request) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return false;

  // Bracket access keeps these values runtime-only in this server function.
  const supabaseUrl = process.env['SUPABASE_URL'] || process.env['EXPO_PUBLIC_SUPABASE_URL'];
  const anonKey = process.env['SUPABASE_ANON_KEY'] || process.env['EXPO_PUBLIC_SUPABASE_ANON_KEY'];
  if (!supabaseUrl || !anonKey) return false;

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authorization, apikey: anonKey },
    });
    return authResponse.ok;
  } catch {
    return false;
  }
}

function requireMotorConfig() {
  const publicKey = process.env.MOTOR_SANDBOX_PUBLIC_KEY?.trim();
  const privateKey = process.env.MOTOR_SANDBOX_PRIVATE_KEY?.trim();
  const baseUrl = process.env.MOTOR_SANDBOX_BASE_URL?.trim() || DEFAULT_BASE_URL;
  const vinPath = process.env.MOTOR_SANDBOX_VIN_PATH?.trim() || DEFAULT_VIN_PATH;

  if (!publicKey || !privateKey) {
    throw new Error('MOTOR sandbox credentials are not configured.');
  }
  if (!baseUrl.startsWith('https://') || !vinPath.startsWith('/')) {
    throw new Error('MOTOR sandbox endpoint configuration is invalid.');
  }

  return { publicKey, privateKey, baseUrl: baseUrl.replace(/\/$/, ''), vinPath };
}

function buildMotorUrl(vin, config, epochSeconds = Math.floor(Date.now() / 1000)) {
  const verb = 'GET';
  const stringToSign = [config.publicKey, verb, epochSeconds, config.vinPath].join('\n');
  const signature = crypto
    .createHmac('sha256', config.privateKey)
    .update(stringToSign, 'ascii')
    .digest('base64');
  const query = new URLSearchParams({
    VIN: vin,
    AttributeStandard: 'MOTOR',
    Scheme: 'Shared',
    XDate: String(epochSeconds),
    ApiKey: config.publicKey,
    Sig: signature,
  });
  return `${config.baseUrl}${config.vinPath}?${query.toString()}`;
}

function normalizeMotorVehicle(vin, payload) {
  const vehicles = payload?.Body?.Vehicles;
  if (!Array.isArray(vehicles) || vehicles.length === 0) return null;
  const vehicle = vehicles[0];

  if (!Number.isInteger(vehicle.Year) || !vehicle.MakeName || !vehicle.ModelName) {
    throw new Error('MOTOR returned an invalid vehicle response.');
  }

  return {
    vin,
    year: vehicle.Year,
    make: vehicle.MakeName,
    model: vehicle.ModelName,
    trim: vehicle.SubModelName ?? null,
    engine: vehicle.EngineDescription ?? null,
    transmission: null,
    motorVehicleId: Number.isInteger(vehicle.VehicleID) ? vehicle.VehicleID : null,
    motorBaseVehicleId: Number.isInteger(vehicle.BaseVehicleID) ? vehicle.BaseVehicleID : null,
    source: 'motor-sandbox',
  };
}

export default async function handler(request, response) {
  const allowedOrigin = process.env.MOTOR_ALLOWED_ORIGIN?.trim();
  const requestOrigin = request.headers.origin;
  if (allowedOrigin && requestOrigin && requestOrigin !== allowedOrigin) {
    sendError(response, 403, 'ORIGIN_NOT_ALLOWED', 'This test origin is not allowed.');
    return;
  }
  if (allowedOrigin && requestOrigin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  }
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Vary', 'Origin');

  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.status(204).end();
    return;
  }

  if (request.method !== 'POST') {
    sendError(response, 405, 'METHOD_NOT_ALLOWED', 'Use POST for VIN lookup.');
    return;
  }

  if (process.env.MOTOR_SANDBOX_ENABLED !== 'true') {
    sendError(response, 404, 'FEATURE_DISABLED', 'MOTOR sandbox testing is disabled.');
    return;
  }

  if (!(await authenticate(request))) {
    sendError(response, 401, 'AUTH_REQUIRED', 'A valid WRNC session is required.');
    return;
  }

  const vin = typeof request.body?.vin === 'string' ? request.body.vin.trim().toUpperCase() : '';
  if (!VIN_PATTERN.test(vin)) {
    sendError(response, 400, 'INVALID_VIN', 'Enter a valid 17-character VIN.');
    return;
  }

  if (process.env.MOTOR_SANDBOX_MODE === 'mock') {
    if (vin !== MOCK_VIN) {
      sendError(response, 404, 'MOCK_VIN_NOT_FOUND', `Mock mode supports only ${MOCK_VIN}.`);
      return;
    }
    send(response, 200, {
      vin,
      year: 2003,
      make: 'Honda',
      model: 'Accord',
      trim: 'EX V6',
      engine: '3.0L V6',
      transmission: 'Automatic',
      motorVehicleId: null,
      motorBaseVehicleId: null,
      source: 'mock',
    });
    return;
  }

  let config;
  try {
    config = requireMotorConfig();
  } catch {
    sendError(response, 503, 'MOTOR_NOT_CONFIGURED', 'MOTOR sandbox access is not configured.');
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const motorResponse = await fetch(buildMotorUrl(vin, config), {
      headers: { Accept: 'application/json' },
      method: 'GET',
      signal: controller.signal,
    });
    if (!motorResponse.ok) {
      sendError(response, 502, 'MOTOR_UPSTREAM_ERROR', 'MOTOR sandbox lookup failed.');
      return;
    }

    const result = normalizeMotorVehicle(vin, await motorResponse.json());
    if (!result) {
      sendError(response, 404, 'MOTOR_VIN_NOT_FOUND', 'No MOTOR sandbox vehicle matched that VIN.');
      return;
    }
    send(response, 200, result);
  } catch (error) {
    const code = error?.name === 'AbortError' ? 'MOTOR_TIMEOUT' : 'MOTOR_INVALID_RESPONSE';
    sendError(response, 502, code, 'MOTOR sandbox lookup is temporarily unavailable.');
  } finally {
    clearTimeout(timeout);
  }
}

export const __testing = { buildMotorUrl, normalizeMotorVehicle };
