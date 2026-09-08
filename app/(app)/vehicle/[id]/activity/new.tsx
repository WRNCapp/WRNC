import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { Input } from '../../../../../components/common/Input';
import { KeyboardSafeScrollView } from '../../../../../components/common/KeyboardSafeScrollView';
import { useCreateActivity } from '../../../../../hooks/useActivity';
import { useVehicle } from '../../../../../hooks/useVehicle';
import { useCurrentWorkspace } from '../../../../../hooks/useWorkspace';
import { ACTIVITY_TYPES, type ActivityType } from '../../../../../types/activity';
import { MAINTENANCE_ITEMS, type MaintenanceItem } from '../../../../../types/maintenance';
import { buildCreateActivityPayload, type CreateActivityFieldErrors } from '../../../../../utils/activityPayload';
import { extractSupabaseErrorMessage, logSupabaseError } from '../../../../../utils/supabaseError';

function ActivityTypeOption({
  label,
  selected,
  onPress,
}: {
  label: ActivityType;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      label={label}
      variant={selected ? 'primary' : 'secondary'}
      onPress={onPress}
    />
  );
}

export default function NewActivityRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle } = useVehicle(vehicleId);
  const { data: workspace } = useCurrentWorkspace();
  const createActivity = useCreateActivity();
  const [activityType, setActivityType] = useState<ActivityType>('Progress Update');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [maintenanceMenuOpen, setMaintenanceMenuOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<CreateActivityFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (!vehicleId || !workspace) {
      setErrorMessage('Vehicle or workspace is unavailable.');
      return;
    }

    const payloadResult = buildCreateActivityPayload({
      vehicleId,
      userId: workspace.ownerId,
      activityType,
      title,
      description,
      activityDate,
      odometer,
      cost,
      maintenanceItems,
    });

    if (!payloadResult.input) {
      setFieldErrors(payloadResult.errors);
      setErrorMessage(null);
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);

    createActivity.mutate(
      payloadResult.input,
      {
        onSuccess: (activity) => {
          router.replace(`/vehicle/${vehicleId}/activity/${activity.id}`);
        },
        onError: (error) => {
          setErrorMessage(extractSupabaseErrorMessage(error, 'Unable to save activity right now. Please try again.'));
          logSupabaseError('NewActivityRoute.handleSave', error, {
            vehicleId,
            activityType,
          });
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <KeyboardSafeScrollView contentContainerStyle={{ padding: 16 }}>
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-4">
          <Text className="text-2xl font-bold text-wrnc-text-primary">Create Activity</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {vehicle ? `Log work for ${vehicle.year} ${vehicle.make} ${vehicle.model}.` : 'Log work for this vehicle.'}
          </Text>

          <View testID="activity-type-options" style={{ marginTop: 16, rowGap: 12 }}>
            {ACTIVITY_TYPES.map((option) => (
              <ActivityTypeOption
                key={option}
                label={option}
                selected={activityType === option}
                onPress={() => {
                  setActivityType(option);
                  setMaintenanceMenuOpen(option === 'Maintenance');
                  setFieldErrors((currentErrors) => ({ ...currentErrors, maintenanceItems: undefined }));
                }}
              />
            ))}
          </View>

          {activityType === 'Maintenance' ? (
            <View style={{ marginTop: 16 }}>
              <Text className="mb-2 text-sm font-medium text-wrnc-text-secondary">What was serviced?</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Maintenance items"
                accessibilityState={{ expanded: maintenanceMenuOpen }}
                onPress={() => setMaintenanceMenuOpen((open) => !open)}
                style={{ minHeight: 56 }}
                className="flex-row items-center justify-between rounded-lg border border-wrnc-border bg-wrnc-background px-4 py-3"
              >
                <Text className="flex-1 text-base font-semibold text-wrnc-text-primary">
                  {maintenanceItems.length ? `${maintenanceItems.length} selected` : 'Select maintenance items'}
                </Text>
                <Text className="ml-3 text-xl text-wrnc-action-primary">{maintenanceMenuOpen ? '▲' : '▼'}</Text>
              </Pressable>
              {maintenanceMenuOpen ? (
                <View testID="maintenance-options" style={{ marginTop: 12, rowGap: 12 }}>
                  {MAINTENANCE_ITEMS.map((item) => {
                    const selected = maintenanceItems.includes(item);
                    return (
                      <Pressable
                        key={item}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={item}
                        onPress={() => {
                          setMaintenanceItems((current) => selected ? current.filter((value) => value !== item) : [...current, item]);
                          setFieldErrors((currentErrors) => ({ ...currentErrors, maintenanceItems: undefined }));
                        }}
                        style={{ minHeight: 56 }}
                        className={`flex-row items-center rounded-lg border px-4 py-3 ${selected ? 'border-wrnc-action-primary bg-wrnc-action-primary' : 'border-wrnc-border bg-wrnc-surface-elevated'}`}
                      >
                        <Text className="mr-3 text-lg font-bold text-wrnc-text-primary">{selected ? '✓' : '○'}</Text>
                        <Text className="flex-1 text-base font-semibold text-wrnc-text-primary">{item}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
              {fieldErrors.maintenanceItems ? <Text className="mt-2 text-sm text-semantic-error">{fieldErrors.maintenanceItems}</Text> : null}
            </View>
          ) : null}

          <View className="mt-4">
            <Input
              label={activityType === 'Maintenance' ? 'Title (generated if blank)' : 'Title'}
              value={title}
              onChangeText={(nextTitle) => {
                setTitle(nextTitle);
                setFieldErrors((currentErrors) => ({ ...currentErrors, title: undefined }));
              }}
              error={fieldErrors.title}
            />
            <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
            <Input
              label="Activity Date"
              value={activityDate}
              onChangeText={(nextDate) => {
                setActivityDate(nextDate);
                setFieldErrors((currentErrors) => ({ ...currentErrors, activityDate: undefined }));
              }}
              placeholder="YYYY-MM-DD"
              error={fieldErrors.activityDate}
            />
            <Input
              label="Odometer"
              value={odometer}
              onChangeText={(nextOdometer) => {
                setOdometer(nextOdometer);
                setFieldErrors((currentErrors) => ({ ...currentErrors, odometer: undefined }));
              }}
              keyboardType="number-pad"
              placeholder="Optional"
              error={fieldErrors.odometer}
            />
            <Input
              label="Cost"
              value={cost}
              onChangeText={(nextCost) => {
                setCost(nextCost);
                setFieldErrors((currentErrors) => ({ ...currentErrors, cost: undefined }));
              }}
              keyboardType="decimal-pad"
              placeholder="Optional"
              error={fieldErrors.cost}
            />
          </View>

          {errorMessage ? <Text className="mb-4 text-sm text-red-600">{errorMessage}</Text> : null}

          <Button label="Save Activity" loading={createActivity.isPending} onPress={handleSave} />
          <Text className="mt-3 text-xs text-wrnc-text-secondary">
            After saving, you can attach receipts, photos, diagrams, and other build records to this activity.
          </Text>
        </View>
      </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}
