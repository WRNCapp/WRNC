import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentWorkspace } from '../../hooks/useWorkspace';
import { useVehicles, useCreateVehicle, useArchiveVehicle, useRestoreVehicle, useUpdateVehicle } from '../../hooks/useVehicle';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailsForm } from './VehicleDetailsForm';
import { DocumentationScoreCard } from './DocumentationScoreCard';
import { Input } from '../common/Input';
import { validateVehicleInput } from '../../utils/validators';
import type { Vehicle } from '../../types/vehicle';
import { extractSupabaseErrorMessage, logSupabaseError } from '../../utils/supabaseError';
import { isMotorSandboxEnabled } from '../../services/api/motor';

interface DarkStatusStateProps {
  title: string;
  message?: string;
}

function DarkStatusState({ title, message }: DarkStatusStateProps) {
  return (
    <SafeAreaView testID="workspace-shell-dark-state" className="flex-1 bg-[#080808]">
      <View className="flex-1 justify-center p-6">
        <View className="max-w-xl">
          <Text className="text-lg font-semibold text-[#C0C0C0]">{title}</Text>
          {message ? <Text className="mt-2 text-sm text-[#C0C0C0]">{message}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

export function VehicleWorkspaceShell() {
  const router = useRouter();
  const workspaceQuery = useCurrentWorkspace();
  const workspace = workspaceQuery.data;
  const vehiclesQuery = useVehicles(workspace?.id);
  const vehicles = vehiclesQuery.data ?? [];
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const archiveVehicle = useArchiveVehicle();
  const restoreVehicle = useRestoreVehicle();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ year: '', make: '', model: '', nickname: '', vin: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const documentationScore = useDocumentationScore(activeVehicle?.id);

  const isWorkspacePending = workspaceQuery.isPending;
  const isVehiclesPending = vehiclesQuery.isPending;
  const hasVehicleData = vehiclesQuery.data !== undefined;
  const isVehicleInitialLoading = Boolean(workspace) && (isVehiclesPending || vehiclesQuery.isFetching) && !hasVehicleData;

  const workspaceErrorMessage = workspaceQuery.error
    ? workspaceQuery.error instanceof Error
      ? workspaceQuery.error.message
      : 'Unable to load your garage.'
    : null;

  const vehiclesErrorMessage = vehiclesQuery.error
    ? vehiclesQuery.error instanceof Error
      ? vehiclesQuery.error.message
      : 'Unable to load vehicles.'
    : null;

  const handleCreate = () => {
    const year = Number(form.year);
    const normalizedVin = form.vin.trim().toUpperCase();
    setSubmitError(null);
    const { valid, errors } = validateVehicleInput({
      year,
      make: form.make,
      model: form.model,
      vin: normalizedVin || null,
    });

    if (!valid) {
      setFormErrors(errors as Record<string, string>);
      return;
    }

    if (!workspace) return;
    setFormErrors({});
    createVehicle.mutate(
      {
        workspaceId: workspace.id,
        year,
        make: form.make.trim(),
        model: form.model.trim(),
        nickname: form.nickname.trim() || null,
        vin: normalizedVin || null,
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          setForm({ year: '', make: '', model: '', nickname: '', vin: '' });
          setFormErrors({});
          setSubmitError(null);
        },
        onError: (error) => {
          setSubmitError(extractSupabaseErrorMessage(error, 'Unable to create vehicle.'));
          logSupabaseError('VehicleWorkspaceShell.createVehicle', error, {
            workspaceId: workspace?.id,
          });
        },
      }
    );
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setIsEditMode(false);
    setEditError(null);
  };

  const workspaceStatusMessage = workspaceErrorMessage
    ? workspaceErrorMessage
    : !workspace
      ? 'No garage workspace was found for this account. Sign out and back in, or contact support to provision your workspace.'
      : null;

  const showEmptyState = Boolean(workspace) && !vehiclesErrorMessage && !isVehiclesPending && hasVehicleData && vehicles.length === 0;
  const showVehicleErrorState = Boolean(workspace) && Boolean(vehiclesErrorMessage) && !hasVehicleData;
  const showVehicleErrorBanner = Boolean(workspace) && Boolean(vehiclesErrorMessage) && hasVehicleData;

  if (isWorkspacePending || isVehicleInitialLoading) {
    return <DarkStatusState title="Loading vehicles…" />;
  }

  if (workspaceErrorMessage) {
    return <DarkStatusState title="Unable to load your garage." message={workspaceErrorMessage} />;
  }

  if (!workspace) {
    return <DarkStatusState title="Garage unavailable" message="No garage workspace was found for this account. Sign out and back in, or contact support to provision your workspace." />;
  }

  if (showVehicleErrorState) {
    return <DarkStatusState title="Unable to load vehicles." message={vehiclesErrorMessage ?? 'Unable to load vehicles.'} />;
  }

  return (
    <ScrollView className="flex-1 bg-wrnc-background p-4">
      <Text className="mb-4 text-2xl font-bold text-wrnc-text-primary">Vehicles</Text>
      {isMotorSandboxEnabled() ? (
        <View className="mb-3">
          <Button label="Open MOTOR Sandbox" variant="secondary" onPress={() => router.push('/motor-sandbox')} />
        </View>
      ) : null}
      {!showCreate ? (
        <Button label="Create Vehicle" onPress={() => setShowCreate(true)} />
      ) : (
        <View className="mb-4 rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
          <Input label="Year" value={form.year} onChangeText={(year) => setForm((f) => ({ ...f, year }))} keyboardType="number-pad" error={formErrors.year} />
          <Input label="Make" value={form.make} onChangeText={(make) => setForm((f) => ({ ...f, make }))} error={formErrors.make} />
          <Input label="Model" value={form.model} onChangeText={(model) => setForm((f) => ({ ...f, model }))} error={formErrors.model} />
          <Input label="Nickname" value={form.nickname} onChangeText={(nickname) => setForm((f) => ({ ...f, nickname }))} />
          <Input
            label="VIN"
            value={form.vin}
            onChangeText={(vin) => {
              setForm((f) => ({ ...f, vin }));
              setFormErrors((currentErrors) => {
                if (!currentErrors.vin) return currentErrors;
                const { vin: _vin, ...rest } = currentErrors;
                return rest;
              });
              setSubmitError(null);
            }}
            autoCapitalize="characters"
            error={formErrors.vin}
          />
          {workspaceStatusMessage ? <Text className="mb-3 text-xs text-semantic-warning">{workspaceStatusMessage}</Text> : null}
          {submitError ? <Text className="mb-3 text-xs text-semantic-error">{submitError}</Text> : null}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Cancel" variant="secondary" onPress={() => setShowCreate(false)} />
            </View>
            <View className="flex-1">
              <Button label="Save" loading={createVehicle.isPending} disabled={!workspace} onPress={handleCreate} />
            </View>
          </View>
        </View>
      )}

      {showEmptyState ? (
        <EmptyState title="No vehicles yet" message="Create your first vehicle to begin tracking your build." actionLabel="Create Vehicle" onAction={() => setShowCreate(true)} />
      ) : (
        <>
          {showVehicleErrorBanner ? (
            <View className="mb-3 rounded-xl border border-semantic-warning/40 bg-semantic-warning/10 p-3">
              <Text className="text-xs text-semantic-warning">Unable to refresh vehicles: {vehiclesErrorMessage}</Text>
            </View>
          ) : null}
          {vehicles.map((vehicle) => (
            <View key={vehicle.id} className="mb-3">
              <VehicleCard vehicle={vehicle} onPress={() => handleSelectVehicle(vehicle)} />
              {activeVehicle?.id === vehicle.id ? (
                <View className="rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
                  <DocumentationScoreCard
                    score={documentationScore.data?.overallScore ?? 0}
                    onPress={() => router.push(`/vehicle/${activeVehicle.id}/passport`)}
                  />
                  <VehicleDetailsForm
                    vehicleData={activeVehicle}
                    isEditMode={isEditMode}
                    onSubmit={(input) => {
                      setEditError(null);
                      updateVehicle.mutate(
                        { id: activeVehicle.id, input },
                        {
                          onSuccess: (updatedVehicle) => {
                            setActiveVehicle(updatedVehicle);
                            setIsEditMode(false);
                          },
                          onError: (error) => {
                            setEditError(extractSupabaseErrorMessage(error, 'Unable to save vehicle changes.'));
                            logSupabaseError('VehicleWorkspaceShell.updateVehicle', error, {
                              vehicleId: activeVehicle.id,
                            });
                          },
                        }
                      );
                    }}
                    onCancel={() => {
                      setIsEditMode(false);
                      setEditError(null);
                    }}
                    isSubmitting={updateVehicle.isPending}
                  />
                  {isEditMode && editError ? <Text className="mt-3 text-xs text-semantic-error">{editError}</Text> : null}
                  {!isEditMode ? (
                    <View className="mt-4 flex-row gap-3">
                      <Button label="Timeline" variant="secondary" onPress={() => router.push(`/vehicle/${activeVehicle.id}/timeline`)} />
                      <Button label="Edit" variant="secondary" onPress={() => setIsEditMode(true)} />
                      {activeVehicle.archivedAt ? (
                        <Button label="Restore" onPress={() => restoreVehicle.mutate(activeVehicle.id)} />
                      ) : (
                        <Button label="Archive" variant="danger" onPress={() => archiveVehicle.mutate(activeVehicle.id)} />
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
