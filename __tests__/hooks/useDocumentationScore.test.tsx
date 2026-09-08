import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';
import { useVehicle } from '../../hooks/useVehicle';
import { useActivities } from '../../hooks/useActivity';
import { useDocuments } from '../../hooks/useDocument';

const queryClients: QueryClient[] = [];

jest.mock('../../hooks/useVehicle', () => ({ useVehicle: jest.fn() }));
jest.mock('../../hooks/useActivity', () => ({ useActivities: jest.fn() }));
jest.mock('../../hooks/useDocument', () => ({ useDocuments: jest.fn() }));

afterEach(() => {
  queryClients.forEach((client) => client.clear());
  queryClients.length = 0;
});

describe('useDocumentationScore', () => {
  it('returns a calculated score when the required data is available', async () => {
    (useVehicle as jest.Mock).mockReturnValue({ data: { id: 'veh-1', workspaceId: 'ws-1' }, isSuccess: true });
    (useActivities as jest.Mock).mockReturnValue({ data: [], isSuccess: true });
    const documents = [
      { vehicleId: 'veh-1', documentType: 'receipt', mimeType: 'application/pdf' },
      { vehicleId: 'veh-2', documentType: 'insurance', mimeType: 'image/png' },
    ];
    (useDocuments as jest.Mock).mockImplementation((_workspaceId, options = {}) => ({
      data: documents.filter((document) => !options.vehicleId || document.vehicleId === options.vehicleId),
      isSuccess: true,
    }));

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    queryClients.push(queryClient);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDocumentationScore('veh-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.overallScore).toBeDefined();
    expect(useDocuments).toHaveBeenCalledWith('ws-1', { vehicleId: 'veh-1' });
    expect(result.current.data?.categories.find((category) => category.key === 'documentsReceipts')?.score).toBe(4);
    expect(result.current.data?.categories.find((category) => category.key === 'photos')?.score).toBe(0);
    expect(result.current.data?.categories.find((category) => category.key === 'ownershipProvenance')?.score).toBe(0);
  });
});
