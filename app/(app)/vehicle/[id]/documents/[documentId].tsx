import React from 'react';
import { Image, Linking, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { useDocument, useDocumentSignedUrl } from '../../../../../hooks/useDocument';

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function WebPreview({ url, mimeType, title }: { url: string; mimeType: string; title: string }) {
  if (Platform.OS !== 'web') return null;

  if (mimeType === 'application/pdf') {
    return React.createElement('iframe' as never, {
      src: url,
      title,
      style: {
        width: '100%',
        height: '70vh',
        minHeight: 520,
        border: 0,
        borderRadius: 12,
        backgroundColor: '#111111',
      },
    } as never);
  }

  if (mimeType.startsWith('video/')) {
    return React.createElement('video' as never, {
      src: url,
      controls: true,
      playsInline: true,
      style: {
        width: '100%',
        maxHeight: '70vh',
        borderRadius: 12,
        backgroundColor: '#000000',
      },
    } as never);
  }

  return null;
}

export default function DocumentViewerRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; documentId?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const documentId = Array.isArray(params.documentId) ? params.documentId[0] : params.documentId;
  const { data: document, isLoading, error } = useDocument(documentId);
  const { data: signedUrl, isLoading: urlLoading, error: urlError } = useDocumentSignedUrl(document?.storagePath);

  if (!vehicleId || !documentId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Record not found.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading record…</Text>
      </SafeAreaView>
    );
  }

  if (error || !document || document.vehicleId !== vehicleId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">This record is unavailable.</Text>
        <View className="mt-4 w-full max-w-sm">
          <Button label="Back to Documents" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/documents`)} />
        </View>
      </SafeAreaView>
    );
  }

  const returnPath = document.activityId
    ? `/vehicle/${vehicleId}/activity/${document.activityId}`
    : `/vehicle/${vehicleId}/documents`;
  const returnLabel = document.activityId ? 'Back to Activity' : 'Back to Documents';
  const url = signedUrl ?? document.fileUrl;
  const isImage = document.mimeType.startsWith('image/');
  const hasInlineWebPreview = document.mimeType === 'application/pdf' || document.mimeType.startsWith('video/');

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Button label={returnLabel} variant="secondary" onPress={() => router.replace(returnPath)} />

        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">{document.documentType}</Text>
          <Text className="mt-2 text-2xl font-bold text-wrnc-text-primary">{document.title}</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {document.originalFileName || 'Uploaded record'}
          </Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{document.mimeType}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{formatFileSize(document.fileSize)}</Text>
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl border border-wrnc-border bg-black p-3">
          {urlLoading ? (
            <View className="items-center justify-center py-16">
              <Text className="text-sm text-wrnc-text-secondary">Preparing secure preview…</Text>
            </View>
          ) : urlError || !url ? (
            <View className="items-center justify-center px-4 py-16">
              <Text className="text-center text-sm text-semantic-error">Unable to prepare this private file for viewing.</Text>
            </View>
          ) : isImage ? (
            <Image
              source={{ uri: url }}
              resizeMode="contain"
              accessibilityLabel={document.title}
              style={{ width: '100%', height: 520, backgroundColor: '#000000' }}
            />
          ) : hasInlineWebPreview && Platform.OS === 'web' ? (
            <WebPreview url={url} mimeType={document.mimeType} title={document.title} />
          ) : (
            <View className="items-center justify-center px-4 py-16">
              <Text className="text-center text-sm text-wrnc-text-secondary">
                This file type cannot be previewed directly inside WRNC on this device.
              </Text>
            </View>
          )}
        </View>

        {url ? (
          <View className="mt-4">
            <Button label="Open File" onPress={() => Linking.openURL(url)} />
            <Text className="mt-2 text-center text-xs text-wrnc-text-secondary">
              Open File may hand the private file to your browser or device viewer. Use the WRNC back control above to stay in the build record.
            </Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Button label="Build Passport" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/passport`)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
