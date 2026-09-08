import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { KeyboardSafeScrollView } from '../../../../../components/common/KeyboardSafeScrollView';
import { DocumentCard } from '../../../../../components/workspace/DocumentCard';
import { DocumentUploadForm } from '../../../../../components/workspace/DocumentUploadForm';
import { useActivity } from '../../../../../hooks/useActivity';
import { useDocuments, useUploadDocument } from '../../../../../hooks/useDocument';
import { useVehicle } from '../../../../../hooks/useVehicle';
import { supabase } from '../../../../../lib/supabase';
import {
  formatTimelineDate,
  getActivityCost,
  getActivityOdometer,
} from '../../../../../utils/activityTimeline';

export default function ActivityDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; activityId?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const activityId = Array.isArray(params.activityId) ? params.activityId[0] : params.activityId;
  const { data: vehicle } = useVehicle(vehicleId);
  const { data: activity, isLoading } = useActivity(activityId);
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(vehicle?.workspaceId, {
    activityId,
  });
  const uploadDocument = useUploadDocument();

  if (isLoading || !activity) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading activity…</Text>
      </SafeAreaView>
    );
  }

  const cost = getActivityCost(activity);
  const odometer = getActivityOdometer(activity);

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <KeyboardSafeScrollView contentContainerStyle={{ padding: 16 }}>
        <Button label="← Timeline" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/timeline`)} />
        <View className="mt-3">
          <Button label="Build Passport" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/passport`)} />
        </View>
        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">
            {activity.activityType}
          </Text>
          <Text className="mt-2 text-2xl font-bold text-wrnc-text-primary">{activity.title}</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {formatTimelineDate(activity.activityDate)}
          </Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle details unavailable'}
          </Text>

          {activity.description ? (
            <Text className="mt-4 text-base leading-6 text-wrnc-text-secondary">{activity.description}</Text>
          ) : null}

          <View className="mt-5 gap-3">
            {odometer !== null ? (
              <View className="rounded-xl bg-wrnc-surface-elevated px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
                  Odometer
                </Text>
                <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">
                  {odometer.toLocaleString()} miles
                </Text>
              </View>
            ) : null}
            {cost !== null ? (
              <View className="rounded-xl bg-wrnc-surface-elevated px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
                  Cost
                </Text>
                <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">
                  ${cost.toFixed(2)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="mt-4">
          <DocumentUploadForm
            isSubmitting={uploadDocument.isPending}
            onSubmit={async ({ title, category, file }) => {
              if (!vehicleId || !activityId || !vehicle) throw new Error('Activity context is unavailable.');
              const { data: userData } = await supabase.auth.getUser();
              const userId = userData.user?.id;
              if (!userId) throw new Error('You must be signed in to upload a document.');
              await uploadDocument.mutateAsync({
                workspaceId: vehicle.workspaceId,
                vehicleId,
                activityId,
                userId,
                title,
                category,
                file,
              });
            }}
          />
        </View>
        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-xl font-bold text-wrnc-text-primary">Activity Records</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            Photos and documents attached to this activity appear here.
          </Text>
          <View className="mt-4">
            {documentsLoading ? (
              <Text className="text-sm text-wrnc-text-secondary">Loading activity records…</Text>
            ) : documents.length === 0 ? (
              <Text className="text-sm text-wrnc-text-secondary">No records have been attached to this activity.</Text>
            ) : (
              documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  title={document.title}
                  documentType={document.documentType}
                  mimeType={document.mimeType}
                  fileSize={document.fileSize}
                  onPress={() => router.push(`/vehicle/${vehicleId}/documents/${document.id}`)}
                />
              ))
            )}
          </View>
        </View>
      </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}
