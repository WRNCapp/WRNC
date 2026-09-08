import { useMemo } from 'react';
import { useActivities } from './useActivity';
import { useDocuments } from './useDocument';
import { useDocumentationScore } from './useDocumentationScore';
import { useVehicle } from './useVehicle';
import { calculateBuildPassport } from '../services/buildPassport';
import type { BuildPassportResult } from '../types/buildPassport';

export interface UseBuildPassportResult {
  data: BuildPassportResult | null;
  isLoading: boolean;
  error: unknown;
}

export function useBuildPassport(vehicleId: string | undefined): UseBuildPassportResult {
  const vehicleQuery = useVehicle(vehicleId);
  const activitiesQuery = useActivities(vehicleId, { includeArchived: true });
  const documentsQuery = useDocuments(vehicleQuery.data?.workspaceId, { includeArchived: true, vehicleId });
  const documentationScoreQuery = useDocumentationScore(vehicleId);

  const data = useMemo(() => {
    if (!vehicleQuery.data || !activitiesQuery.data || !documentsQuery.data || !documentationScoreQuery.data) {
      return null;
    }

    return calculateBuildPassport({
      vehicle: vehicleQuery.data,
      activities: activitiesQuery.data,
      documents: documentsQuery.data,
      documentationScore: documentationScoreQuery.data,
    });
  }, [activitiesQuery.data, documentsQuery.data, documentationScoreQuery.data, vehicleQuery.data]);

  return {
    data,
    isLoading:
      Boolean(vehicleId) &&
      (vehicleQuery.isLoading || activitiesQuery.isLoading || documentsQuery.isLoading || documentationScoreQuery.isLoading),
    error: vehicleQuery.error ?? activitiesQuery.error ?? documentsQuery.error ?? documentationScoreQuery.error ?? null,
  };
}
