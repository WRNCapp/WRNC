import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { DocumentUploadForm } from '../../components/workspace/DocumentUploadForm';

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock('expo-file-system', () => ({ File: jest.fn(() => ({ size: 4096 })) }));

const mockGetDocumentAsync = DocumentPicker.getDocumentAsync as jest.Mock;

describe('DocumentUploadForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders all required category options', () => {
    const { getByText } = render(<DocumentUploadForm onSubmit={jest.fn()} />);

    ['Receipt', 'Registration', 'Insurance', 'Warranty', 'Manual', 'Diagram', 'Other'].forEach((label) => {
      getByText(label);
    });
  });

  it('requires a title before submitting', async () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Title is required.'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('requires a selected file before submitting', async () => {
    const onSubmit = jest.fn();
    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Select a file to upload.'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the title, category, and picked file', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///r.pdf', name: 'r.pdf', mimeType: 'application/pdf', size: 2048 }],
    });
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Files'));
    await waitFor(() => getByText('Selected: r.pdf'));

    fireEvent.press(getByText('Insurance'));
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Brake receipt',
        category: 'insurance',
        file: expect.objectContaining({ name: 'r.pdf', uri: 'file:///r.pdf' }),
      })
    );
  });

  it('shows an upload error without exposing internals', async () => {
    mockGetDocumentAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///r.pdf', name: 'r.pdf', mimeType: 'application/pdf', size: 2048 }],
    });
    const onSubmit = jest.fn().mockRejectedValue(new Error('Storage quota exceeded'));

    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByLabelText('Title'), 'Brake receipt');
    fireEvent.press(getByText('Files'));
    await waitFor(() => getByText('Selected: r.pdf'));
    fireEvent.press(getByText('Upload Document'));

    await waitFor(() => getByText('Storage quota exceeded'));
  });

  it.each(['Camera', 'Photo Library'])('selects and submits a %s attachment', async (source) => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: true });
    const picker = source === 'Camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    (picker as jest.Mock).mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///photo.jpg', fileName: 'photo.jpg', mimeType: 'image/jpeg' }] });
    const submit = jest.fn().mockResolvedValue(undefined);
    const { getByText, getByLabelText } = render(<DocumentUploadForm onSubmit={submit} />);
    fireEvent.changeText(getByLabelText('Title'), 'Work evidence');
    fireEvent.press(getByText(source));
    await waitFor(() => getByText('Selected: photo.jpg'));
    fireEvent.press(getByText('Upload Document'));
    await waitFor(() => expect(submit).toHaveBeenCalledWith(expect.objectContaining({
      file: { uri: 'file:///photo.jpg', name: 'photo.jpg', mimeType: 'image/jpeg', size: 4096 },
    })));
    expect(mockGetDocumentAsync).not.toHaveBeenCalled();
  });

  it('does not open the camera when permission is denied', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ granted: false });
    const { getByText } = render(<DocumentUploadForm onSubmit={jest.fn()} />);
    fireEvent.press(getByText('Camera'));
    await waitFor(() => getByText('Camera access is off. Enable it in Settings, or choose Photo Library or Files.'));
    expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
  });

  it('keeps the selected attachment after cancelling another source', async () => {
    mockGetDocumentAsync.mockResolvedValue({ canceled: false, assets: [{ uri: 'file:///r.pdf', name: 'r.pdf', mimeType: 'application/pdf', size: 42 }] });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true, assets: null });
    const { getByText } = render(<DocumentUploadForm onSubmit={jest.fn()} />);
    fireEvent.press(getByText('Files'));
    await waitFor(() => getByText('Selected: r.pdf'));
    fireEvent.press(getByText('Photo Library'));
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    getByText('Selected: r.pdf');
  });
});
