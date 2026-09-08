import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BuildPassportHeader } from '../../../../components/workspace/BuildPassportHeader';
import { BuildPassportVehicleSummary } from '../../../../components/workspace/BuildPassportVehicleSummary';
import { BuildPassportTimelineSummary } from '../../../../components/workspace/BuildPassportTimelineSummary';
import { BuildPassportDocumentationSummary } from '../../../../components/workspace/BuildPassportDocumentationSummary';
import { BuildPassportRecommendations } from '../../../../components/workspace/BuildPassportRecommendations';
import { BuildPassportStatistics } from '../../../../components/workspace/BuildPassportStatistics';
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

  const { vehicleSummary, timelineSummary, documentationSummary, statistics, recommendations } = passport;

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ marginBottom: 16 }}>
          <BuildPassportHeader
            vehicleTitle={vehicleSummary.title}
            vehicleSubtitle={vehicleSummary.subtitle}
            overallScore={documentationSummary.overallScore}
            onBack={() => router.replace('/workspace')}
          />
        </View>

        {vehicle ? (
          <View style={{ marginBottom: 16 }}>
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

        <View style={{ marginBottom: 16 }}>
          <BuildPassportVehicleSummary
            summary={vehicleSummary}
            onNavigate={(route) => router.push(route)}
            onBack={() => router.back()}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <BuildPassportTimelineSummary
            summary={timelineSummary}
            onNavigate={(route) => router.push(route)}
            onBack={() => router.back()}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <BuildPassportDocumentationSummary
            summary={documentationSummary}
            onNavigate={(route) => router.push(route)}
            onBack={() => router.back()}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <BuildPassportStatistics statistics={statistics} />
        </View>

        <BuildPassportRecommendations
          recommendations={recommendations}
          onNavigate={(route) => router.push(route)}
          onBack={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
