import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import type { AttachmentFileInput } from '../services/api/attachmentStorage';

/** Native media sources feed the same validated private upload path as Files. */
export async function pickAttachmentMedia(source: 'camera' | 'library'): Promise<AttachmentFileInput | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Camera access is off. Enable it in Settings, or choose Photo Library or Files.');
    }
  }
  const result = source === 'camera'
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 1 });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const name = asset.fileName || asset.uri.split('/').pop() || `attachment-${Date.now()}.jpg`;
  const extension = name.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', heic: 'image/heic',
    heif: 'image/heif', webp: 'image/webp', mov: 'video/quicktime', mp4: 'video/mp4', m4v: 'video/x-m4v',
  };
  return {
    name, uri: asset.uri,
    mimeType: asset.mimeType || mimeTypes[extension] || 'application/octet-stream',
    size: asset.fileSize || new File(asset.uri).size,
  };
}
