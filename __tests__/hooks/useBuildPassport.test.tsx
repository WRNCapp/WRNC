import { renderHook } from '@testing-library/react-native';
import { useBuildPassport } from '../../hooks/useBuildPassport';
import { useVehicle } from '../../hooks/useVehicle';
import { useActivities } from '../../hooks/useActivity';
import { useDocuments } from '../../hooks/useDocument';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';

jest.mock('../../hooks/useVehicle', () => ({ useVehicle: jest.fn() }));
jest.mock('../../hooks/useActivity', () => ({ useActivities: jest.fn() }));
jest.mock('../../hooks/useDocument', () => ({ useDocuments: jest.fn() }));
jest.mock('../../hooks/useDocumentationScore', () => ({ useDocumentationScore: jest.fn() }));

describe('useBuildPassport', () => {
  it('returns an aggregated passport from the current domain hooks', () => {
    (useVehicle as jest.Mock).mockReturnValue({
      data: {
        id: 'veh-1',
        workspaceId: 'ws-1',
        vin: '1HGCM82633A004352',
        year: 2000,
        make: 'Honda',
        model: 'Civic',
        trim: null,
        nickname: null,
        engine: null,
        transmission: null,
        mileage: null,
        coverPhotoUrl: null,
        archivedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    });
    (useActivities as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    const documents = [
      { id: 'selected-doc', vehicleId: 'veh-1', documentType: 'receipt', mimeType: 'image/png', archivedAt: null, uploadedAt: '2026-08-29', createdAt: '2026-08-29' },
      { id: 'other-doc', vehicleId: 'veh-2', documentType: 'receipt', mimeType: 'application/pdf', archivedAt: '2026-08-28', uploadedAt: '2026-08-28', createdAt: '2026-08-28' },
    ];
    (useDocuments as jest.Mock).mockImplementation((_workspaceId, options = {}) => ({
      data: documents.filter((document) => !options.vehicleId || document.vehicleId === options.vehicleId),
      isLoading: false,
      error: null,
    }));
    (useDocumentationScore as jest.Mock).mockReturnValue({
      data: {
        overallScore: 88,
        categories: [],
        recommendations: [],
      },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useBuildPassport('veh-1'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data?.documentationSummary.overallScore).toBe(88);
    expect(result.current.data?.vehicleSummary.title).toBe('2000 Honda Civic');
    expect(useDocuments).toHaveBeenCalledWith('ws-1', { includeArchived: true, vehicleId: 'veh-1' });
    expect(result.current.data?.documentationSummary.totalDocuments).toBe(1);
    expect(result.current.data?.documentationSummary.archivedDocuments).toBe(0);
    expect(result.current.data?.statistics.totalPhotos).toBe(1);
  });
});
