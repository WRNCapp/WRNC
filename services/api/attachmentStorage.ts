import { Platform } from 'react-native';
import { File as ExpoFile } from 'expo-file-system';
import { supabase } from '../../lib/supabase';

export type AttachmentBucket = 'vehicle-photos' | 'vehicle-documents';

export type AttachmentCategory =
  | 'cover'
  | 'progress'
  | 'receipt'
  | 'registration'
  | 'insurance'
  | 'warranty'
  | 'manual'
  | 'diagram'
  | 'document'
  | 'other';

/**
 * A file selected by the user, from either a web `<input type="file">` /
 * drag-drop `File`/`Blob`, or a native Expo image/document picker result
 * (a `file://`/`content://` URI plus metadata). Exactly one of `webFile` or
 * `uri` must be present.
 */
export interface AttachmentFileInput {
  name: string;
  mimeType: string;
  size: number;
  webFile?: File | Blob;
  uri?: string;
}

export interface AttachmentValidationOptions {
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
}

export interface AttachmentValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validates a file against a bucket's MIME/size rules before any upload attempt. */
export function validateAttachmentFile(
  file: Pick<AttachmentFileInput, 'mimeType' | 'size'>,
  options: AttachmentValidationOptions
): AttachmentValidationResult {
  const errors: string[] = [];
  const mimeType = file.mimeType?.trim().toLowerCase();

  if (!mimeType || !options.allowedMimeTypes.includes(mimeType)) {
    errors.push('This file type is not supported.');
  }

  if (!file.size || file.size <= 0) {
    errors.push('The file appears to be empty.');
  } else if (file.size > options.maxSizeBytes) {
    const maxMb = Math.floor(options.maxSizeBytes / (1024 * 1024));
    errors.push(`This file must be ${maxMb} MB or smaller.`);
  }

  return { valid: errors.length === 0, errors };
}

/** Strips path separators and unsafe characters, and caps length, without altering the extension. */
export function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim() || 'file';
  const lastDot = trimmed.lastIndexOf('.');
  const base = lastDot > 0 ? trimmed.slice(0, lastDot) : trimmed;
  const ext = lastDot > 0 ? trimmed.slice(lastDot) : '';

  const safeBase = base
    .normalize('NFKD')
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'file';

  const safeExt = ext.replace(/[^.\w]+/g, '').slice(0, 10);

  return `${safeBase}${safeExt}`;
}

/** Low-collision identifier for disambiguating object paths. Not a security boundary — RLS ownership is. */
export function generateAttachmentId(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}${random}`;
}

/**
 * Builds the owner-scoped object path:
 * {userId}/{vehicleId}/{category}/{uuid}-{sanitizedFileName}
 */
export function buildAttachmentPath(
  userId: string,
  vehicleId: string,
  category: AttachmentCategory,
  fileName: string
): string {
  const uniqueId = generateAttachmentId();
  const safeName = sanitizeFileName(fileName);
  return `${userId}/${vehicleId}/${category}/${uniqueId}-${safeName}`;
}

/**
 * Converts a selected file into bytes Supabase Storage can upload, on both
 * web and native. Web `File`/`Blob` instances are passed through untouched.
 * Native `file://`/`content://` URIs are read as bytes through Expo FileSystem,
 * rather than passed as a bare URI string
 * (which supabase-js cannot upload directly) or run through `fetch(uri).blob()`
 * (which has had reported truncation issues on some Android/Hermes builds).
 */
export async function toUploadableBody(file: AttachmentFileInput): Promise<Blob | Uint8Array> {
  if (Platform.OS === 'web') {
    if (!file.webFile) {
      throw new Error('No file was provided for upload.');
    }
    return file.webFile;
  }

  if (!file.uri) {
    throw new Error('No file was provided for upload.');
  }

  return new ExpoFile(file.uri).bytes();
}

/** Generates a short-lived signed URL for private viewing/downloading. Never returns a public URL. */
export async function getAttachmentSignedUrl(
  bucket: AttachmentBucket,
  path: string,
  expiresInSeconds = 60
): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error('Unable to generate a viewing link for this file.');
  }

  return data.signedUrl;
}

/** Uploads a validated, converted file to a unique, owner-scoped path. Never upserts. */
export async function uploadAttachmentObject(
  bucket: AttachmentBucket,
  path: string,
  file: AttachmentFileInput
): Promise<void> {
  const body = await toUploadableBody(file);

  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.mimeType,
  });

  if (error) {
    throw new Error('Unable to upload this file. Please try again.');
  }
}

/** Best-effort removal of one or more objects. Failures are swallowed and reported via the return value. */
export async function removeAttachmentObjects(bucket: AttachmentBucket, paths: string[]): Promise<boolean> {
  const targets = paths.filter(Boolean);
  if (targets.length === 0) return true;

  const { error } = await supabase.storage.from(bucket).remove(targets);
  return !error;
}
