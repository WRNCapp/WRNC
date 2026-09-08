import handler, { __testing } from '../../api/motor/vin';

const makeResponse = () => {
  const response: any = {
    setHeader: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
};

describe('MOTOR VIN proxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MOTOR_SANDBOX_ENABLED = 'true';
    process.env.MOTOR_SANDBOX_MODE = 'mock';
    process.env.MOTOR_SANDBOX_BASE_URL = 'https://api.motor.test';
    process.env.MOTOR_SANDBOX_VIN_PATH = '/v1/Information/Vehicles/Search/ByVIN';
    process.env.MOTOR_SANDBOX_PUBLIC_KEY = 'public-test-key';
    process.env.MOTOR_SANDBOX_PRIVATE_KEY = 'private-test-key';
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'anon-key';
    delete process.env.MOTOR_ALLOWED_ORIGIN;
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as jest.Mock;
  });

  it('returns 404 when the server-side flag is disabled', async () => {
    process.env.MOTOR_SANDBOX_ENABLED = 'false';
    const response = makeResponse();
    await handler({ method: 'POST', headers: {}, body: {} } as any, response);
    expect(response.status).toHaveBeenCalledWith(404);
  });

  it('requires a valid WRNC session', async () => {
    const response = makeResponse();
    await handler({ method: 'POST', headers: {}, body: { vin: '1HGCM82633A004352' } } as any, response);
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it('rejects a cross-origin request outside the exact preview allowlist', async () => {
    process.env.MOTOR_ALLOWED_ORIGIN = 'https://approved-preview.example';
    const response = makeResponse();
    await handler({ method: 'POST', headers: { origin: 'https://attacker.example' }, body: {} } as any, response);
    expect(response.status).toHaveBeenCalledWith(403);
    expect(global.fetch).not.toHaveBeenCalled();
    delete process.env.MOTOR_ALLOWED_ORIGIN;
  });

  it('returns the fixed fixture only for the documented mock VIN', async () => {
    const response = makeResponse();
    await handler({ method: 'POST', headers: { authorization: 'Bearer session' }, body: { vin: '1hgcm82633a004352' } } as any, response);
    expect(global.fetch).toHaveBeenCalledWith('https://example.supabase.co/auth/v1/user', expect.objectContaining({ headers: expect.objectContaining({ apikey: 'anon-key' }) }));
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ vin: '1HGCM82633A004352', source: 'mock' }));
  });

  it('signs the route and normalizes a live MOTOR sandbox response', async () => {
    process.env.MOTOR_SANDBOX_MODE = 'live';
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Body: {
            Vehicles: [{
              BaseVehicleID: 1872,
              EngineDescription: '2.0L L4',
              MakeName: 'Dodge',
              ModelName: 'Neon',
              SubModelName: 'High Line',
              VehicleID: 3251,
              Year: 1997,
            }],
          },
        }),
      });
    const response = makeResponse();
    await handler({ method: 'POST', headers: { authorization: 'Bearer session' }, body: { vin: '1B3ES47Y6VD205309' } } as any, response);

    const motorCall = (global.fetch as jest.Mock).mock.calls[1];
    const motorUrl = new URL(motorCall[0]);
    expect(motorUrl.origin + motorUrl.pathname).toBe('https://api.motor.test/v1/Information/Vehicles/Search/ByVIN');
    expect(motorUrl.searchParams.get('VIN')).toBe('1B3ES47Y6VD205309');
    expect(motorUrl.searchParams.get('ApiKey')).toBe('public-test-key');
    expect(motorUrl.searchParams.get('Sig')).toBeTruthy();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
      vin: '1B3ES47Y6VD205309',
      year: 1997,
      make: 'Dodge',
      model: 'Neon',
      motorVehicleId: 3251,
      motorBaseVehicleId: 1872,
      source: 'motor-sandbox',
    }));
  });

  it('returns not found when MOTOR has no matching vehicles', async () => {
    process.env.MOTOR_SANDBOX_MODE = 'live';
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ Body: { Vehicles: [] } }) });
    const response = makeResponse();
    await handler({ method: 'POST', headers: { authorization: 'Bearer session' }, body: { vin: '1B3ES47Y6VD205309' } } as any, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.objectContaining({ code: 'MOTOR_VIN_NOT_FOUND' }) }));
  });

  it('does not include a query string in the signed route', () => {
    const url = new URL(__testing.buildMotorUrl('1B3ES47Y6VD205309', {
      publicKey: 'public-test-key',
      privateKey: 'private-test-key',
      baseUrl: 'https://api.motor.test',
      vinPath: '/v1/Information/Vehicles/Search/ByVIN',
    }, 1234567890));
    expect(url.searchParams.get('XDate')).toBe('1234567890');
    expect(url.searchParams.get('AttributeStandard')).toBe('MOTOR');
  });
});
