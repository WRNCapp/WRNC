import { MOTOR_SANDBOX_VEHICLES } from '../../data/motorSandboxVehicles';

describe('MOTOR sandbox vehicle catalog', () => {
  it('contains 15 unique, valid sandbox VIN selections', () => {
    expect(MOTOR_SANDBOX_VEHICLES).toHaveLength(15);
    expect(new Set(MOTOR_SANDBOX_VEHICLES.map(({ vin }) => vin)).size).toBe(15);
    MOTOR_SANDBOX_VEHICLES.forEach(({ vin }) => expect(vin).toMatch(/^[A-HJ-NPR-Z0-9]{17}$/));
  });
});
