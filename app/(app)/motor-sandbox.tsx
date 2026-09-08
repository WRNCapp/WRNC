import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { MOTOR_SANDBOX_VEHICLES, motorSandboxVehicleLabel, type MotorSandboxVehicle } from '../../data/motorSandboxVehicles';
import { isMotorSandboxEnabled, lookupMotorVin } from '../../services/api/motor';
import type { MotorVinLookup } from '../../types/motor';

const PRODUCTS = [
  ['Vehicle Identification', 'TESTABLE'],
  ['Specifications', 'ROUTE AND ENTITLEMENT UNKNOWN'],
  ['Maintenance Schedules', 'ROUTE AND ENTITLEMENT UNKNOWN'],
  ['Fluids', 'ROUTE AND ENTITLEMENT UNKNOWN'],
  ['Technical Service Bulletins', 'ROUTE AND ENTITLEMENT UNKNOWN'],
  ['Diagnostic Trouble Codes', 'ROUTE AND ENTITLEMENT UNKNOWN'],
  ['Parts', 'COMMERCIAL AND LICENSING REVIEW REQUIRED'],
  ['Estimated Work Times', 'FUTURE PROFESSIONAL USE'],
  ['Service Procedures and Wiring Diagrams', 'FUTURE PROFESSIONAL USE'],
] as const;

const show = (value: string | number | null) => value ?? 'Unknown';

export default function MotorSandboxScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<MotorSandboxVehicle>(MOTOR_SANDBOX_VEHICLES[0]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [vin, setVin] = useState(selected.vin);
  const [result, setResult] = useState<MotorVinLookup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestedAt, setRequestedAt] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);

  if (!isMotorSandboxEnabled()) {
    return (
      <SafeAreaView className="flex-1 bg-wrnc-background p-6">
        <Text className="text-xl font-bold text-wrnc-text-primary">MOTOR test surface disabled</Text>
        <Text className="mt-2 text-wrnc-text-secondary">Enable the internal sandbox flag in a test build to use this route.</Text>
        <View className="mt-6"><Button label="Back to Vehicles" variant="secondary" onPress={() => router.replace('/workspace')} /></View>
      </SafeAreaView>
    );
  }

  const chooseVehicle = (vehicle: MotorSandboxVehicle) => {
    setSelected(vehicle);
    setVin(vehicle.vin);
    setSelectorOpen(false);
    setResult(null);
    setError(null);
  };

  const runLookup = async () => {
    const started = Date.now();
    setLoading(true);
    setError(null);
    setResult(null);
    setRequestedAt(new Date(started).toISOString());
    try {
      setResult(await lookupMotorVin(vin));
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'MOTOR lookup failed.');
    } finally {
      setDurationMs(Date.now() - started);
      setLoading(false);
    }
  };

  const comparison = result ? [
    ['Year', selected.year, result.year],
    ['Make', selected.make, result.make],
    ['Model', selected.model, result.model],
    ['MOTOR Vehicle ID', selected.motorVehicleId, result.motorVehicleId],
    ['Base Vehicle ID', selected.motorBaseVehicleId, result.motorBaseVehicleId],
  ] as const : [];

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <Head><meta name="robots" content="noindex,nofollow" /><title>MOTOR Sandbox Testing | WRNC</title></Head>
      <ScrollView contentContainerStyle={{ alignSelf: 'center', maxWidth: 960, padding: 20, width: '100%' }} keyboardShouldPersistTaps="handled">
        <Text className="text-xs font-bold uppercase tracking-widest text-semantic-warning">MOTOR SANDBOX TESTING</Text>
        <Text className="mt-2 text-3xl font-bold text-wrnc-text-primary">Vehicle Data Workbench</Text>
        <Text className="mt-3 text-base text-wrnc-text-secondary">No data is saved. Sandbox supports predefined test vehicles only.</Text>

        <View className="mt-6 rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
          <Text className="mb-2 text-sm font-semibold text-wrnc-text-primary">Sandbox vehicle</Text>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: selectorOpen }} onPress={() => setSelectorOpen((open) => !open)} className="min-h-[52px] justify-center rounded-lg border border-wrnc-border bg-black px-4">
            <Text className="text-base font-semibold text-wrnc-text-primary">{motorSandboxVehicleLabel(selected)} ▾</Text>
          </Pressable>
          {selectorOpen ? (
            <View testID="motor-sandbox-vehicle-options" className="mt-2 rounded-lg border border-wrnc-border bg-black p-2">
              {MOTOR_SANDBOX_VEHICLES.map((vehicle) => (
                <Pressable key={vehicle.vin} accessibilityRole="button" onPress={() => chooseVehicle(vehicle)} className="min-h-[48px] justify-center rounded-md px-3 active:bg-wrnc-surface">
                  <Text className="text-sm text-wrnc-text-primary">{motorSandboxVehicleLabel(vehicle)}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View className="mt-5">
            <Input label="VIN" value={vin} onChangeText={setVin} autoCapitalize="characters" maxLength={17} />
            <Text className="mb-4 text-xs text-wrnc-text-secondary">The MOTOR sandbox will reject vehicles outside its predefined catalog.</Text>
            <Button label="Look Up VIN" onPress={runLookup} loading={loading} disabled={loading} />
          </View>
          {error ? <Text accessibilityRole="alert" className="mt-4 text-sm text-semantic-error">{error}</Text> : null}
        </View>

        {result ? (
          <View testID="motor-vin-result" className="mt-6 gap-4">
            <ResultCard title="Submitted identity" rows={[
              ['VIN', vin.toUpperCase()],
              ['Selected', motorSandboxVehicleLabel(selected)],
              ['Requested', requestedAt],
              ['Duration', durationMs == null ? null : `${durationMs} ms`],
            ]} />
            <ResultCard title="MOTOR normalized result" rows={[
              ['Vehicle', `${show(result.year)} ${show(result.make)} ${show(result.model)}`],
              ['Trim', result.trim], ['Engine', result.engine], ['Transmission', result.transmission],
              ['MOTOR Vehicle ID', result.motorVehicleId], ['Base Vehicle ID', result.motorBaseVehicleId],
              ['Source', `${result.source}. Test data only.`],
            ]} />
            <ResultCard title="Comparison" rows={comparison.map(([label, expected, actual]) => [
              label,
              actual == null ? 'Missing' : String(expected).toLowerCase() === String(actual).toLowerCase() ? 'Match' : 'Mismatch',
            ])} />
          </View>
        ) : null}

        <Text className="mb-3 mt-8 text-xl font-bold text-wrnc-text-primary">Data Products Evaluation</Text>
        <View className="gap-3">
          {PRODUCTS.map(([name, status]) => (
            <View key={name} className="rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
              <Text className="text-base font-semibold text-wrnc-text-primary">{name}</Text>
              <Text className="mt-2 text-xs font-bold text-semantic-warning">{status}</Text>
            </View>
          ))}
        </View>
        <View className="mt-8"><Button label="Back to Vehicles" variant="secondary" onPress={() => router.replace('/workspace')} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultCard({ title, rows }: { title: string; rows: readonly (readonly [string, string | number | null])[] }) {
  return (
    <View className="rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
      <Text className="text-lg font-semibold text-wrnc-text-primary">{title}</Text>
      {rows.map(([label, value]) => <Text key={label} className="mt-2 text-sm text-wrnc-text-secondary">{label}: {show(value)}</Text>)}
    </View>
  );
}
