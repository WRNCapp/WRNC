import { vehicleIdentity } from '../../components/workspace/VehicleCard';
import { formatDocumentMeta } from '../../components/workspace/DocumentCard';

jest.mock('../../hooks/useVehiclePhotos', () => ({ useVehiclePhotoUrl: () => ({ data: null }) }));

describe('vehicleIdentity', () => {
  it('uses the nickname as the title and year/make/model as the subtitle', () => {
    expect(vehicleIdentity({ year: 1991, make: 'BMW', model: '357i', nickname: 'GMW' })).toEqual({
      title: 'GMW',
      subtitle: '1991 BMW 357i',
    });
  });

  it('does not repeat year/make/model when there is no nickname', () => {
    expect(vehicleIdentity({ year: 1972, make: 'Datsun', model: '240Z', nickname: null })).toEqual({
      title: '1972 Datsun 240Z',
      subtitle: null,
    });
  });
});

describe('formatDocumentMeta', () => {
  it('shows a readable type and size', () => {
    expect(formatDocumentMeta('application/pdf', 120000)).toBe('PDF • 117 KB');
    expect(formatDocumentMeta('image/jpeg', 3 * 1024 * 1024)).toBe('JPG • 3.0 MB');
    expect(formatDocumentMeta('image/heic', 200)).toBe('HEIC • 1 KB');
  });
});
