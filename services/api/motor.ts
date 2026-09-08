import { Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import type { MotorApiErrorBody, MotorVinLookup } from '../../types/motor';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export class MotorLookupError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'MotorLookupError';
  }
}

export function isMotorSandboxEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX === 'true';
}

function getProxyUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_MOTOR_PROXY_URL?.trim();
  if (configuredUrl) return configuredUrl;
  if (Platform.OS === 'web') return '/api/motor/vin';
  throw new MotorLookupError(
    'MOTOR proxy URL is not configured for this test build.',
    'PROXY_NOT_CONFIGURED'
  );
}

export async function lookupMotorVin(
  vin: string,
  fetcher: typeof fetch = fetch,
  testConfig?: { enabled?: boolean; proxyUrl?: string }
): Promise<MotorVinLookup> {
  if (!(testConfig?.enabled ?? isMotorSandboxEnabled())) {
    throw new MotorLookupError('MOTOR sandbox testing is disabled.', 'FEATURE_DISABLED');
  }

  const normalizedVin = vin.trim().toUpperCase();
  if (!VIN_PATTERN.test(normalizedVin)) {
    throw new MotorLookupError('Enter a valid 17-character VIN.', 'INVALID_VIN', 400);
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    throw new MotorLookupError('Your session expired. Sign in again.', 'AUTH_REQUIRED', 401);
  }

  let response: Response;
  try {
    response = await fetcher(testConfig?.proxyUrl ?? getProxyUrl(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vin: normalizedVin }),
    });
  } catch {
    throw new MotorLookupError('Unable to reach the MOTOR test proxy.', 'NETWORK_ERROR');
  }

  const body = (await response.json().catch(() => null)) as MotorVinLookup | MotorApiErrorBody | null;
  if (!response.ok) {
    const apiError = body && 'error' in body ? body.error : null;
    throw new MotorLookupError(
      apiError?.message ?? 'MOTOR lookup failed.',
      apiError?.code ?? 'LOOKUP_FAILED',
      response.status
    );
  }

  if (!body || !('vin' in body) || body.vin !== normalizedVin) {
    throw new MotorLookupError('MOTOR returned an invalid response.', 'INVALID_RESPONSE', 502);
  }

  return body;
}
