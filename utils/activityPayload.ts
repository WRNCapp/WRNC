import type { ActivityType, CreateActivityInput } from '../types/activity';

export interface CreateActivityFormValues {
  vehicleId: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  activityDate: string;
  odometer: string;
  cost: string;
  maintenanceItems?: string[];
}

export interface CreateActivityFieldErrors {
  title?: string;
  activityDate?: string;
  odometer?: string;
  cost?: string;
  maintenanceItems?: string;
}

export interface BuildActivityPayloadResult {
  input: CreateActivityInput | null;
  errors: CreateActivityFieldErrors;
}

function parseOptionalNumber(rawValue: string, fieldLabel: string, allowCurrency: boolean) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return { value: null as number | null, error: null as string | null };
  }

  const sanitized = allowCurrency
    ? trimmed.replace(/[$,\s]/g, '')
    : trimmed.replace(/[\s,]/g, '');

  if (!sanitized) {
    return { value: null as number | null, error: `${fieldLabel} must be a valid number.` };
  }

  const parsed = Number(sanitized);
  if (!Number.isFinite(parsed)) {
    return { value: null as number | null, error: `${fieldLabel} must be a valid number.` };
  }

  if (parsed < 0) {
    return { value: null as number | null, error: `${fieldLabel} cannot be negative.` };
  }

  return { value: parsed, error: null as string | null };
}

/** Converts activity form values into a validated CreateActivityInput payload. */
export function buildCreateActivityPayload(values: CreateActivityFormValues): BuildActivityPayloadResult {
  const errors: CreateActivityFieldErrors = {};

  const maintenanceItems = values.maintenanceItems ?? [];
  const title = values.title.trim() || (values.activityType === 'Maintenance' ? maintenanceItems.join(' + ') : '');
  if (!title) {
    errors.title = 'Title is required.';
  }
  if (values.activityType === 'Maintenance' && maintenanceItems.length === 0) {
    errors.maintenanceItems = 'Select at least one maintenance item.';
  }

  const activityDate = values.activityDate.trim();
  if (!activityDate) {
    errors.activityDate = 'Activity date is required.';
  }

  const odometerResult = parseOptionalNumber(values.odometer, 'Odometer', false);
  if (odometerResult.error) {
    errors.odometer = odometerResult.error;
  }

  const costResult = parseOptionalNumber(values.cost, 'Cost', true);
  if (costResult.error) {
    errors.cost = costResult.error;
  }

  if (Object.keys(errors).length > 0) {
    return { input: null, errors };
  }

  const metadata: Record<string, number | string | string[]> = {};
  if (odometerResult.value !== null) {
    metadata.odometer = odometerResult.value;
  }
  if (costResult.value !== null) {
    metadata.cost = costResult.value;
  }
  if (values.activityType === 'Maintenance') {
    metadata.serviceType = maintenanceItems.join(', ');
    metadata.serviceItems = maintenanceItems;
  }

  return {
    input: {
      vehicleId: values.vehicleId,
      userId: values.userId,
      activityType: values.activityType,
      title,
      description: values.description.trim() || null,
      activityDate,
      metadata: Object.keys(metadata).length > 0 ? metadata : null,
    },
    errors,
  };
}
