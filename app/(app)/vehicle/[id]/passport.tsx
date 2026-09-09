import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../../components/common/Button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BuildPassportHeader } from '../../../../components/workspace/BuildPassportHeader';
import { BuildPassportVehicleSummary } from '../../../../components/workspace/BuildPassportVehicleSummary';
import { BuildPassportTimelineSummary } from '../../../../components/workspace/BuildPassportTimelineSummary';
import { BuildPassportDocumentationSummary } from '../../../../components/workspace/BuildPassportDocumentationSummary';
import { BuildPassportRecommendations } from '../../../../components/workspace/BuildPassportRecommendations';
import { VehicleCoverPhoto } from '../../../../components/workspace/VehicleCoverPhoto';
import { useBuildPassport } from '../../../../hooks/useBuildPassport';
import { useVehicle } from '../../../../hooks/useVehicle';
import { useVehiclePhotoUrl, useUploadVehiclePhoto, useReplaceVehiclePhoto, useRemoveVehiclePhoto } from '../../../../hooks/useVehiclePhotos';
import { supabase } from '../../../../lib/supabase';

export default function VehiclePassportRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: passport, isLoading } = useBuildPassport(vehicleId);
  const { data: vehicle } = useVehicle(vehicleId);
  const { data: signedUrl, isLoading: isLoadingUrl } = useVehiclePhotoUrl(vehicle?.coverPhotoPath);
  const uploadPhoto = useUploadVehiclePhoto();
  const replacePhoto = useReplaceVehiclePhoto();
  const removePhoto = useRemoveVehiclePhoto();
  const [showFullPassport, setShowFullPassport] = useState(false);

  if (!vehicleId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Vehicle not found.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading || !passport) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading passport…</Text>
      </SafeAreaView>
    );
  }

  const { vehicleSummary, timelineSummary, documentationSummary, recommendations } = passport;

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={{ marginBottom: 12 }}>
          <BuildPassportHeader
            vehicleTitle={vehicleSummary.title}
            vehicleSubtitle={vehicleSummary.subtitle}
            overallScore={documentationSummary.overallScore}
            onBack={() => router.replace('/workspace')}
          />
        </View>

        {vehicle ? (
          <View style={{ marginBottom: 12 }}>
            <VehicleCoverPhoto
            signedUrl={signedUrl}
            hasPhoto={Boolean(vehicle.coverPhotoPath)}
            isLoadingUrl={isLoadingUrl}
            isUploading={uploadPhoto.isPending}
            isRemoving={removePhoto.isPending}
            onUpload={async (file) => {
              const { data: userData } = await supabase.auth.getUser();
              const userId = userData.user?.id;
              if (!userId) throw new Error('You must be signed in to upload a photo.');
              if (vehicle.coverPhotoPath) {
                await replacePhoto.mutateAsync({ vehicleId, file, userId });
              } else {
                await uploadPhoto.mutateAsync({ vehicleId, file, userId });
              }
            }}
            onRemove={async () => {
              await removePhoto.mutateAsync({ vehicleId });
            }}
            />
          </View>
        ) : null}

        <View className="mb-3 rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
          <Text className="text-lg font-semibold text-wrnc-text-primary">At a Glance</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">The current build record, without the report noise.</Text>
          <View className="mt-4 flex-row gap-2">
            <View className="flex-1 rounded-lg bg-wrnc-background p-3">
              <Text className="text-xs uppercase text-wrnc-text-secondary">Activities</Text>
              <Text className="mt-1 text-2xl font-bold text-wrnc-text-primary">{timelineSummary.totalActivities}</Text>
            </View>
            <View className="flex-1 rounded-lg bg-wrnc-background p-3">
              <Text className="text-xs uppercase text-wrnc-text-secondary">Documents</Text>
              <Text className="mt-1 text-2xl font-bold text-wrnc-text-primary">{documentationSummary.totalDocuments}</Text>
            </View>
            <View className="flex-1 rounded-lg bg-wrnc-background p-3">
              <Text className="text-xs uppercase text-wrnc-text-secondary">Photos</Text>
              <Text className="mt-1 text-2xl font-bold text-wrnc-text-primary">{documentationSummary.photoDocuments}</Text>
            </View>
          </View>
          {timelineSummary.latestActivity ? (
            <View className="mt-3 border-t border-wrnc-border pt-3">
              <Text className="text-xs uppercase text-wrnc-text-secondary">Latest Activity</Text>
              <Text className="mt-1 text-sm font-semibold text-wrnc-text-primary">{timelineSummary.latestActivity.title}</Text>
              <Text className="mt-1 text-xs text-wrnc-text-secondary">{timelineSummary.latestActivity.activityDate}</Text>
            </View>
          ) : null}
          <View className="mt-3 flex-row gap-2">
            <View className="flex-1">
              <Button label="Timeline" variant="secondary" compact onPress={() => router.push(`/vehicle/${vehicleId}/timeline`)} />
            </View>
            <View className="flex-1">
              <Button label="Documents" variant="secondary" compact onPress={() => router.push(`/vehicle/${vehicleId}/documents`)} />
            </View>
          </View>
        </View>

        <Button
          label={showFullPassport ? 'Hide Full Passport' : 'View Full Passport'}
          variant="secondary"
          compact
          onPress={() => setShowFullPassport((current) => !current)}
        />

        {showFullPassport ? (
          <View className="mt-3">
            <View style={{ marginBottom: 12 }}>
              <BuildPassportVehicleSummary
                summary={vehicleSummary}
                onNavigate={(route) => router.push(route)}
                onBack={() => router.back()}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <BuildPassportTimelineSummary
                summary={timelineSummary}
                onNavigate={(route) => router.push(route)}
                onBack={() => router.back()}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <BuildPassportDocumentationSummary
                summary={documentationSummary}
                onNavigate={(route) => router.push(route)}
                onBack={() => router.back()}
              />
            </View>

            <BuildPassportRecommendations
              recommendations={recommendations}
              onNavigate={(route) => router.push(route)}
              onBack={() => router.back()}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
