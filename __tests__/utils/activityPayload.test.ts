import { buildCreateActivityPayload } from '../../utils/activityPayload';

describe('buildCreateActivityPayload', () => {
  const baseValues = {
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Journal Entry' as const,
    title: 'D/S Removal',
    description: 'drained fuel tank to Volvo, prepping for D/S removal tomorrow',
    activityDate: '2026-08-11',
    odometer: '120020',
    cost: '$0',
  };

  it('creates a valid journal entry payload with normalized metadata', () => {
    const result = buildCreateActivityPayload(baseValues);

    expect(result.errors).toEqual({});
    expect(result.input).toEqual({
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Journal Entry',
      title: 'D/S Removal',
      description: 'drained fuel tank to Volvo, prepping for D/S removal tomorrow',
      activityDate: '2026-08-11',
      metadata: {
        odometer: 120020,
        cost: 0,
      },
    });
  });

  it('accepts 0.00 and comma-formatted currency values', () => {
    const result = buildCreateActivityPayload({
      ...baseValues,
      cost: '$1,250.00',
    });

    expect(result.errors).toEqual({});
    expect(result.input?.metadata).toMatchObject({ cost: 1250 });
  });

  it('rejects invalid or negative cost values', () => {
    const invalidCost = buildCreateActivityPayload({
      ...baseValues,
      cost: '$abc',
    });

    const negativeCost = buildCreateActivityPayload({
      ...baseValues,
      cost: '-3',
    });

    expect(invalidCost.input).toBeNull();
    expect(invalidCost.errors.cost).toBe('Cost must be a valid number.');
    expect(negativeCost.input).toBeNull();
    expect(negativeCost.errors.cost).toBe('Cost cannot be negative.');
  });

  it('rejects invalid odometer and returns no submission payload', () => {
    const result = buildCreateActivityPayload({
      ...baseValues,
      odometer: 'not-a-number',
    });

    expect(result.input).toBeNull();
    expect(result.errors.odometer).toBe('Odometer must be a valid number.');
  });

  it('converts blank optional numeric fields to null metadata', () => {
    const result = buildCreateActivityPayload({
      ...baseValues,
      odometer: '   ',
      cost: '',
      description: '   ',
    });

    expect(result.errors).toEqual({});
    expect(result.input?.metadata).toBeNull();
    expect(result.input?.description).toBeNull();
  });

  it('requires a maintenance selection and generates its title and metadata', () => {
    const missing = buildCreateActivityPayload({
      ...baseValues,
      activityType: 'Maintenance',
      title: '',
      maintenanceItems: [],
    });
    expect(missing.input).toBeNull();
    expect(missing.errors.maintenanceItems).toBe('Select at least one maintenance item.');

    const result = buildCreateActivityPayload({
      ...baseValues,
      activityType: 'Maintenance',
      title: '',
      maintenanceItems: ['Engine Oil', 'Oil Filter'],
    });
    expect(result.errors).toEqual({});
    expect(result.input).toEqual(expect.objectContaining({
      title: 'Engine Oil + Oil Filter',
      metadata: expect.objectContaining({
        serviceType: 'Engine Oil, Oil Filter',
        serviceItems: ['Engine Oil', 'Oil Filter'],
      }),
    }));
  });
});
