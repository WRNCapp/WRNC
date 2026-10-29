import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentCardProps {
  title: string;
  documentType: string;
  mimeType: string;
  fileSize: number;
  onPress?: () => void;
}

/** Human-readable file type and size, e.g. "PDF • 117 KB". */
export function formatDocumentMeta(mimeType: string, fileSize: number) {
  const subtype = mimeType.split('/').pop() ?? '';
  const kind = subtype === 'jpeg' ? 'JPG' : subtype.toUpperCase() || 'FILE';
  const size = fileSize >= 1024 * 1024
    ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(fileSize / 1024))} KB`;
  return `${kind} • ${size}`;
}

export function DocumentCard({ title, documentType, mimeType, fileSize, onPress }: DocumentCardProps) {
  return (
    <View className="mb-3 rounded-lg border border-wrnc-border bg-wrnc-surface p-4">
      <Text className="text-base font-semibold text-wrnc-text-primary">{title}</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">{documentType}</Text>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">{formatDocumentMeta(mimeType, fileSize)}</Text>
      <View className="mt-3">
        <Button label="Open" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
}
