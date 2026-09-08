export interface MotorVinLookup {
  vin: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  engine: string | null;
  transmission: string | null;
  motorVehicleId: number | null;
  motorBaseVehicleId: number | null;
  source: 'motor-sandbox' | 'mock';
}

export interface MotorApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
