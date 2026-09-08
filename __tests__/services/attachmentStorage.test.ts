import { Platform } from 'react-native';
import { File as ExpoFile } from 'expo-file-system';
import { supabase } from '../../lib/supabase';
import {
  buildAttachmentPath,
  generateAttachmentId,
  getAttachmentSignedUrl,
  removeAttachmentObjects,
  sanitizeFileName,
  toUploadableBody,
  uploadAttachmentObject,
  validateAttachmentFile,
} from '../../services/api/attachmentStorage';

jest.mock('../../lib/supabase', () => ({
  __esModule: true,
  supabase: {
    storage: { from: jest.fn() },
  },
}));

const mockFileBytes = jest.fn();

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation(() => ({ bytes: mockFileBytes })),
}));

const mockStorageFrom = supabase.storage.from as jest.Mock;
const mockExpoFile = ExpoFile as unknown as jest.Mock;

describe('sanitizeFileName', () => {
  it('replaces unsafe characters and preserves the extension', () => {
    expect(sanitizeFileName('my receipt (final)!.pdf')).toBe('my-receipt-final.pdf');
  });

  it('falls back to a default name for an empty string', () => {
    expect(sanitizeFileName('   ')).toBe('file');
  });

  it('strips path separators to prevent directory traversal', () => {
    expect(sanitizeFileName('../../etc/passwd.png')).not.toContain('/');
    expect(sanitizeFileName('../../etc/passwd.png')).not.toContain('..');
  });
});

describe('generateAttachmentId', () => {
  it('generates a non-empty, url-safe identifier', () => {
    const id = generateAttachmentId();
    expect(id.length).toBeGreaterThan(0);
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it('generates different ids on successive calls', () => {
    const first = generateAttachmentId();
    const second = generateAttachmentId();
    expect(first).not.toBe(second);
  });
});

describe('buildAttachmentPath', () => {
  it('builds an owner-scoped path with userId, vehicleId, category, and sanitized name', () => {
    const path = buildAttachmentPath('user-1', 'veh-1', 'cover', 'My Cover.jpg');
    const segments = path.split('/');

    expect(segments[0]).toBe('user-1');
    expect(segments[1]).toBe('veh-1');
    expect(segments[2]).toBe('cover');
    expect(segments[3]).toMatch(/^[a-z0-9]+-My-Cover\.jpg$/);
  });
});

describe('validateAttachmentFile', () => {
  const options = { allowedMimeTypes: ['image/jpeg', 'image/png'], maxSizeBytes: 1024 };

  it('accepts a valid file within limits', () => {
    const result = validateAttachmentFile({ mimeType: 'image/jpeg', size: 512 }, options);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects an unsupported MIME type', () => {
    const result = validateAttachmentFile({ mimeType: 'application/zip', size: 512 }, options);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/not supported/i);
  });

  it('rejects a file over the size limit', () => {
    const result = validateAttachmentFile({ mimeType: 'image/png', size: 2048 }, options);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/MB or smaller/i);
  });

  it('rejects an empty file', () => {
    const result = validateAttachmentFile({ mimeType: 'image/png', size: 0 }, options);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/empty/i);
  });
});

describe('toUploadableBody', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { get: () => originalOS });
  });

  it('returns the web File/Blob as-is on web', async () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'web' });
    const webFile = new Blob(['hello']);

    const result = await toUploadableBody({ name: 'a.png', mimeType: 'image/png', size: 5, webFile });

    expect(result).toBe(webFile);
  });

  it('throws when no web file is provided on web', async () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'web' });

    await expect(toUploadableBody({ name: 'a.png', mimeType: 'image/png', size: 5 })).rejects.toThrow(
      /no file was provided/i
    );
  });

  it('reads and decodes a native file URI into bytes', async () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
    mockFileBytes.mockResolvedValue(new Uint8Array([104, 105]));

    const result = await toUploadableBody({
      name: 'a.png',
      mimeType: 'image/png',
      size: 2,
      uri: 'file:///tmp/a.png',
    });

    expect(mockExpoFile).toHaveBeenCalledWith('file:///tmp/a.png');
    expect(mockFileBytes).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(Array.from(result as Uint8Array)).toEqual([104, 105]); // "h", "i"
  });

  it('throws when no native uri is provided', async () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });

    await expect(toUploadableBody({ name: 'a.png', mimeType: 'image/png', size: 5 })).rejects.toThrow(
      /no file was provided/i
    );
  });
});

describe('uploadAttachmentObject', () => {
  const originalOS = Platform.OS;
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', { get: () => 'web' });
  });
  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { get: () => originalOS });
  });

  it('uploads without upsert and with the given content type', async () => {
    const upload = jest.fn().mockResolvedValue({ error: null });
    mockStorageFrom.mockReturnValue({ upload });

    const webFile = new Blob(['content']);
    await uploadAttachmentObject('vehicle-photos', 'user-1/veh-1/cover/abc-a.jpg', {
      name: 'a.jpg',
      mimeType: 'image/jpeg',
      size: 7,
      webFile,
    });

    expect(mockStorageFrom).toHaveBeenCalledWith('vehicle-photos');
    expect(upload).toHaveBeenCalledWith(
      'user-1/veh-1/cover/abc-a.jpg',
      webFile,
      expect.objectContaining({ upsert: false, contentType: 'image/jpeg' })
    );
  });

  it('throws a safe error when the storage upload fails', async () => {
    const upload = jest.fn().mockResolvedValue({ error: { message: 'internal storage detail' } });
    mockStorageFrom.mockReturnValue({ upload });

    await expect(
      uploadAttachmentObject('vehicle-photos', 'user-1/veh-1/cover/abc-a.jpg', {
        name: 'a.jpg',
        mimeType: 'image/jpeg',
        size: 7,
        webFile: new Blob(['x']),
      })
    ).rejects.toThrow(/unable to upload/i);
  });
});

describe('removeAttachmentObjects', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns true and skips the network call when there are no paths', async () => {
    const remove = jest.fn();
    mockStorageFrom.mockReturnValue({ remove });

    const result = await removeAttachmentObjects('vehicle-photos', []);

    expect(result).toBe(true);
    expect(remove).not.toHaveBeenCalled();
  });

  it('returns true on successful removal', async () => {
    const remove = jest.fn().mockResolvedValue({ error: null });
    mockStorageFrom.mockReturnValue({ remove });

    const result = await removeAttachmentObjects('vehicle-photos', ['a/b/c']);

    expect(result).toBe(true);
    expect(remove).toHaveBeenCalledWith(['a/b/c']);
  });

  it('returns false without throwing when removal fails', async () => {
    const remove = jest.fn().mockResolvedValue({ error: { message: 'gone' } });
    mockStorageFrom.mockReturnValue({ remove });

    const result = await removeAttachmentObjects('vehicle-photos', ['a/b/c']);

    expect(result).toBe(false);
  });
});

describe('getAttachmentSignedUrl', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the signed URL on success', async () => {
    mockStorageFrom.mockReturnValue({
      createSignedUrl: jest.fn().mockResolvedValue({ data: { signedUrl: 'https://cdn.example.com/x' }, error: null }),
    });

    const url = await getAttachmentSignedUrl('vehicle-documents', 'a/b/c', 60);

    expect(url).toBe('https://cdn.example.com/x');
  });

  it('throws a safe error without exposing internals when signing fails', async () => {
    mockStorageFrom.mockReturnValue({
      createSignedUrl: jest.fn().mockResolvedValue({ data: null, error: { message: 'internal detail' } }),
    });

    await expect(getAttachmentSignedUrl('vehicle-documents', 'a/b/c')).rejects.toThrow(
      /unable to generate a viewing link/i
    );
  });
});
