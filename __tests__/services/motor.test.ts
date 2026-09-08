import { Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { lookupMotorVin, MotorLookupError } from '../../services/api/motor';

jest.mock('../../lib/supabase', () => ({
  supabase: { auth: { getSession: jest.fn() } },
}));

const getSession = supabase.auth.getSession as jest.Mock;
const originalPlatform = Platform.OS;

describe('MOTOR VIN lookup client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX = 'true';
    process.env.EXPO_PUBLIC_MOTOR_PROXY_URL = 'https://test.wrnc.app/api/motor/vin';
    getSession.mockResolvedValue({ data: { session: { access_token: 'test-session' } }, error: null });
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { value: originalPlatform });
  });

  it('fails closed when the feature flag is disabled', async () => {
    process.env.EXPO_PUBLIC_ENABLE_MOTOR_SANDBOX = 'false';
    await expect(lookupMotorVin('1HGCM82633A004352', jest.fn())).rejects.toMatchObject({ code: 'FEATURE_DISABLED' });
  });

  it('validates VIN before session or network access', async () => {
    const fetcher = jest.fn();
    await expect(lookupMotorVin('bad-vin', fetcher, { enabled: true })).rejects.toMatchObject({ code: 'INVALID_VIN' });
    expect(getSession).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('sends the WRNC session to the configured proxy and returns typed data', async () => {
    const payload = { vin: '1HGCM82633A004352', year: 2003, make: 'Honda', model: 'Accord', trim: 'EX V6', engine: '3.0L V6', transmission: 'Automatic', motorVehicleId: null, motorBaseVehicleId: null, source: 'mock' } as const;
    const fetcher = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload });
    await expect(lookupMotorVin('1hgcm82633a004352', fetcher, { enabled: true, proxyUrl: 'https://test.wrnc.app/api/motor/vin' })).resolves.toEqual(payload);
    expect(fetcher).toHaveBeenCalledWith('https://test.wrnc.app/api/motor/vin', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer test-session' }),
      body: JSON.stringify({ vin: '1HGCM82633A004352' }),
    }));
  });

  it('normalizes proxy errors without leaking response details', async () => {
    const fetcher = jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: { code: 'MOTOR_CONTRACT_REQUIRED', message: 'Contract required.' } }) });
    await expect(lookupMotorVin('1HGCM82633A004352', fetcher, { enabled: true, proxyUrl: 'https://test.wrnc.app/api/motor/vin' })).rejects.toEqual(expect.objectContaining<Partial<MotorLookupError>>({ code: 'MOTOR_CONTRACT_REQUIRED', status: 503 }));
  });
});
