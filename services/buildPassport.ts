import type { Activity } from '../types/activity';
import type { Document } from '../types/document';
import type {
  BuildPassportInput,
  BuildPassportRecommendation,
  BuildPassportResult,
  BuildPassportStatistics,
  BuildPassportTimelineSummary,
  BuildPassportDocumentationSummary,
  BuildPassportVehicleSummary,
  BuildPassportBreakdownItem,
} from '../types/buildPassport';

function formatVehicleTitle(vehicle: BuildPassportInput['vehicle']) {
  if (!vehicle) {
    return 'Vehicle';
  }

  return vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

function formatVehicleSubtitle(vehicle: BuildPassportInput['vehicle']) {
  if (!vehicle) {
    return 'Read-only vehicle history';
  }

  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

function sortActivities(activities: Activity[]) {
  return [...activities].sort((left, right) => {
    const leftDate = new Date(left.activityDate).getTime();
    const rightDate = new Date(right.activityDate).getTime();
    if (leftDate !== rightDate) {
      return rightDate - leftDate;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function sortDocuments(documents: Document[]) {
  return [...documents].sort((left, right) => {
    const leftDate = new Date(left.uploadedAt).getTime();
    const rightDate = new Date(right.uploadedAt).getTime();
    if (leftDate !== rightDate) {
      return rightDate - leftDate;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function buildBreakdown<T>(
  items: T[],
  keySelector: (item: T) => string
): BuildPassportBreakdownItem[] {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const label = keySelector(item).trim() || 'Unspecified';
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([label, count]) => ({ label, count }));
}

function getMaintenanceCount(activities: Activity[]) {
  return activities.filter((activity) => {
    const title = activity.title.toLowerCase();
    const description = activity.description?.toLowerCase() ?? '';
    return activity.activityType === 'Maintenance' || title.includes('maintenance') || description.includes('maintenance');
  }).length;
}

function buildVehicleSummary(vehicle: BuildPassportInput['vehicle']): BuildPassportVehicleSummary {
  const details = vehicle
    ? [
        { label: 'Year', value: String(vehicle.year) },
        { label: 'Make', value: vehicle.make },
        { label: 'Model', value: vehicle.model },
        { label: 'VIN', value: vehicle.vin ?? 'Not recorded' },
        { label: 'Mileage', value: vehicle.mileage !== null ? `${vehicle.mileage.toLocaleString()} miles` : 'Not recorded' },
        { label: 'Status', value: vehicle.archivedAt ? 'Archived' : 'Active' },
      ]
    : [];

  return {
    title: formatVehicleTitle(vehicle),
    subtitle: formatVehicleSubtitle(vehicle),
    details,
    sourceLinks: [{ label: 'Back to Vehicle Workspace', action: 'back' }],
  };
}

function buildTimelineSummary(vehicle: BuildPassportInput['vehicle'], activities: Activity[]): BuildPassportTimelineSummary {
  const sortedActivities = sortActivities(activities);
  const latestActivity = sortedActivities[0] ?? null;

  return {
    totalActivities: activities.length,
    activeActivities: activities.filter((activity) => !activity.archivedAt).length,
    archivedActivities: activities.filter((activity) => Boolean(activity.archivedAt)).length,
    latestActivity,
    sourceLinks: vehicle
      ? [
          { label: 'Open Timeline', route: `/vehicle/${vehicle.id}/timeline` },
          ...(latestActivity ? [{ label: 'Open Latest Activity', route: `/vehicle/${vehicle.id}/activity/${latestActivity.id}` }] : []),
        ]
      : [],
  };
}

function buildDocumentationSummary(
  vehicle: BuildPassportInput['vehicle'],
  documents: Document[],
  documentationScore: BuildPassportInput['documentationScore']
): BuildPassportDocumentationSummary {
  const sortedDocuments = sortDocuments(documents);
  const latestDocument = sortedDocuments[0] ?? null;
  const photoDocuments = documents.filter((document) => document.mimeType.toLowerCase().startsWith('image/')).length;

  return {
    overallScore: documentationScore.overallScore,
    totalDocuments: documents.length,
    activeDocuments: documents.filter((document) => !document.archivedAt).length,
    archivedDocuments: documents.filter((document) => Boolean(document.archivedAt)).length,
    photoDocuments,
    latestDocument,
    categories: documentationScore.categories,
    sourceLinks: vehicle ? [{ label: 'Open Documents', route: `/vehicle/${vehicle.id}/documents` }] : [],
  };
}

function buildStatistics(
  activities: Activity[],
  documents: Document[],
  documentationScore: BuildPassportInput['documentationScore']
): BuildPassportStatistics {
  return {
    totalActivities: activities.length,
    activeActivities: activities.filter((activity) => !activity.archivedAt).length,
    archivedActivities: activities.filter((activity) => Boolean(activity.archivedAt)).length,
    totalDocuments: documents.length,
    activeDocuments: documents.filter((document) => !document.archivedAt).length,
    archivedDocuments: documents.filter((document) => Boolean(document.archivedAt)).length,
    totalPhotos: documents.filter((document) => document.mimeType.toLowerCase().startsWith('image/')).length,
    maintenanceActivities: getMaintenanceCount(activities),
    activityTypeBreakdown: buildBreakdown(activities, (activity) => activity.activityType),
    documentTypeBreakdown: buildBreakdown(documents, (document) => document.documentType),
    documentationScore: documentationScore.overallScore,
  };
}

function recommendationRoute(vehicle: BuildPassportInput['vehicle'], category: BuildPassportRecommendation['category']) {
  if (!vehicle) {
    return undefined;
  }

  if (category === 'vehicleProfile') {
    return undefined;
  }

  if (category === 'buildTimeline' || category === 'maintenance' || category === 'modifications' || category === 'recordQuality') {
    return `/vehicle/${vehicle.id}/timeline`;
  }

  return `/vehicle/${vehicle.id}/documents`;
}

function recommendationLabel(category: BuildPassportRecommendation['category']) {
  if (category === 'vehicleProfile') {
    return 'Back to Vehicle Workspace';
  }

  if (category === 'buildTimeline' || category === 'maintenance' || category === 'modifications' || category === 'recordQuality') {
    return 'Open Timeline';
  }

  return 'Open Documents';
}

function buildRecommendations(input: BuildPassportInput): BuildPassportRecommendation[] {
  return input.documentationScore.recommendations.map((recommendation) => ({
    ...recommendation,
    route: recommendationRoute(input.vehicle, recommendation.category),
    action: recommendation.category === 'vehicleProfile' ? 'back' : undefined,
    sourceLabel: recommendationLabel(recommendation.category),
  }));
}

export function calculateBuildPassport(input: BuildPassportInput): BuildPassportResult {
  const vehicleSummary = buildVehicleSummary(input.vehicle);
  const timelineSummary = buildTimelineSummary(input.vehicle, input.activities);
  const documentationSummary = buildDocumentationSummary(input.vehicle, input.documents, input.documentationScore);
  const statistics = buildStatistics(input.activities, input.documents, input.documentationScore);

  return {
    generatedAt: new Date().toISOString(),
    vehicleSummary,
    timelineSummary,
    documentationSummary,
    statistics,
    recommendations: buildRecommendations(input),
    documentationScore: input.documentationScore,
  };
}