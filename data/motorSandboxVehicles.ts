import sandboxVehicles from './motorSandboxVehicles.json';

export interface MotorSandboxVehicle {
  year: number; make: string; model: string; vin: string;
  motorVehicleId: number; motorBaseVehicleId: number;
}

export const MOTOR_SANDBOX_VEHICLES: MotorSandboxVehicle[] = sandboxVehicles;

export const motorSandboxVehicleLabel = (vehicle: MotorSandboxVehicle) =>
  `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
