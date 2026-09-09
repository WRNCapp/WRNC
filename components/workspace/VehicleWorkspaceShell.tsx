import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCurrentWorkspace } from '../../hooks/useWorkspace';
import { useVehicles, useCreateVehicle, useArchiveVehicle, useRestoreVehicle, useUpdateVehicle } from '../../hooks/useVehicle';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';
import { useActivities } from '../../hooks/useActivity';
import { Button } from '../common/Button';
import { KeyboardSafeScrollView } from '../common/KeyboardSafeScrollView';
import { EmptyState } from '../common/EmptyState';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailsForm } from './VehicleDetailsForm';
import { DocumentationScoreCard } from './DocumentationScoreCard';
import { Input } from '../common/Input';
import { validateVehicleInput } from '../../utils/validators';
import type { Vehicle } from '../../types/vehicle';
import type { Activity } from '../../types/activity';
import { extractSupabaseErrorMessage, logSupabaseError } from '../../utils/supabaseError';
import { formatTimelineDate } from '../../utils/activityTimeline';

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
  const activitiesQuery = useActivities(activeVehicle?.id, { includeArchived: true });

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
    <SafeAreaView testID="vehicles-safe-area" style={{ flex: 1, backgroundColor: '#080808' }}>
    <KeyboardSafeScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View className="mb-3 flex-row items-center justify-between gap-4">
        <Text className="text-2xl font-bold text-wrnc-text-primary">Vehicles</Text>
        {!showCreate ? (
          <View style={{ width: 136 }}>
            <Button label="Create Vehicle" compact onPress={() => setShowCreate(true)} />
          </View>
        ) : null}
      </View>
      {showCreate ? (
        <View className="mb-3 rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
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
      ) : null}

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
              {activeVehicle?.id === vehicle.id ? (
                <View className="rounded-xl border border-wrnc-border bg-wrnc-surface p-3">
                  <View testID="vehicle-heading" className="mb-3 flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-2xl font-bold text-wrnc-text-primary">
                        {activeVehicle.nickname || `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`}
                      </Text>
                      <Text className="mt-1 text-sm text-wrnc-text-secondary">
                        {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                      </Text>
                    </View>
                    <Text className="rounded-full bg-wrnc-data-accent/20 px-3 py-1 text-xs font-semibold text-wrnc-data-accent">
                      {activeVehicle.archivedAt ? 'Archived' : 'Active'}
                    </Text>
                  </View>
                  <View testID="vehicle-facts-grid" className="flex-row flex-wrap justify-between gap-y-2">
                    <Fact label="VIN" value={activeVehicle.vin || 'Not recorded'} />
                    <Fact label="Mileage" value={activeVehicle.mileage !== null ? `${activeVehicle.mileage.toLocaleString()} mi` : 'Not recorded'} />
                    <Fact label="Engine" value={activeVehicle.engine || 'Not recorded'} />
                    <Fact label="Transmission" value={activeVehicle.transmission || 'Not recorded'} />
                  </View>
                  <DocumentationScoreCard
                    score={documentationScore.data?.overallScore}
                    isLoading={documentationScore.isPending}
                    onPress={() => router.push(`/vehicle/${activeVehicle.id}/passport`)}
                  />
                  <View testID="vehicle-primary-actions" className="mt-3">
                    <Button label="Add Activity" onPress={() => router.push(`/vehicle/${activeVehicle.id}/activity/new`)} />
                    <View className="flex-row gap-3">
                      <View className="mt-2 flex-1">
                        <Button label="Build Passport" variant="secondary" compact onPress={() => router.push(`/vehicle/${activeVehicle.id}/passport`)} />
                      </View>
                      <View className="mt-2 flex-1">
                        <Button label="Timeline" variant="secondary" compact onPress={() => router.push(`/vehicle/${activeVehicle.id}/timeline`)} />
                      </View>
                    </View>
                  </View>
                  <RecentActivities
                    activities={activitiesQuery.data ?? []}
                    onPress={(activityId) => router.push(`/vehicle/${activeVehicle.id}/activity/${activityId}`)}
                  />
                  {isEditMode ? (
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
                  ) : null}
                  {isEditMode && editError ? <Text className="mt-3 text-xs text-semantic-error">{editError}</Text> : null}
                  {!isEditMode ? (
                    <View className="mt-3 flex-row gap-3">
                      <Button label="Edit" variant="secondary" compact onPress={() => setIsEditMode(true)} />
                      {activeVehicle.archivedAt ? (
                        <Button label="Restore" variant="secondary" compact onPress={() => restoreVehicle.mutate(activeVehicle.id)} />
                      ) : (
                        <Button label="Archive" variant="secondary" compact onPress={() => archiveVehicle.mutate(activeVehicle.id)} />
                      )}
                    </View>
                  ) : null}
                </View>
              ) : <VehicleCard vehicle={vehicle} onPress={() => handleSelectVehicle(vehicle)} />}
            </View>
          ))}
        </>
      )}
    </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View testID="vehicle-fact" className="border-b border-wrnc-border px-1 py-2" style={{ flexBasis: '48%', minHeight: 48 }}>
      <Text className="text-xs uppercase tracking-wide text-wrnc-text-secondary">{label}</Text>
      <Text className="mt-1 text-sm font-semibold text-wrnc-text-primary">{value}</Text>
    </View>
  );
}

function RecentActivities({
  activities,
  onPress,
}: {
  activities: Activity[];
  onPress: (activityId: string) => void;
}) {
  const recentActivities = [...activities]
    .sort((left, right) => new Date(right.activityDate).getTime() - new Date(left.activityDate).getTime())
    .slice(0, 3);

  return (
    <View className="mt-3">
      <Text className="text-sm font-semibold text-wrnc-text-primary">Recent Activity</Text>
      {recentActivities.length === 0 ? (
        <Text className="mt-2 text-sm text-wrnc-text-secondary">No activity recorded yet.</Text>
      ) : (
        <View className="mt-2 overflow-hidden rounded-xl border border-wrnc-border">
          {recentActivities.map((activity, index) => (
            <Pressable
              key={activity.id}
              accessibilityRole="button"
              className={`flex-row items-center justify-between gap-3 px-3 py-3 ${index > 0 ? 'border-t border-wrnc-border' : ''}`}
              onPress={() => onPress(activity.id)}
            >
              <View className="flex-1">
                <Text className="text-sm font-semibold text-wrnc-text-primary" numberOfLines={1}>{activity.title}</Text>
                <Text className="mt-1 text-xs text-wrnc-text-secondary">
                  {activity.activityType} · {formatTimelineDate(activity.activityDate)}
                </Text>
              </View>
              <Text className="text-xl text-wrnc-text-secondary">›</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
