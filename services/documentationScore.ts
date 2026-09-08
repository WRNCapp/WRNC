import type { Activity } from '../types/activity';
import type { Document } from '../types/document';
import type { Vehicle } from '../types/vehicle';
import type {
  BuildScoreCategory,
  BuildScoreCategoryKey,
  BuildScoreDelta,
  BuildScoreInput,
  BuildScoreResult,
  DocumentationRecommendation,
} from '../types/documentationScore';

export const BUILD_SCORE_MAXIMUMS: Record<BuildScoreCategoryKey, number> = {
  vehicleProfile: 10,
  buildTimeline: 20,
  modifications: 15,
  maintenance: 10,
  photos: 15,
  partsInventory: 10,
  documentsReceipts: 10,
  ownershipProvenance: 5,
  recordQuality: 5,
};

const CATEGORY_LABELS: Record<BuildScoreCategoryKey, string> = {
  vehicleProfile: 'Vehicle Profile',
  buildTimeline: 'Build Timeline',
  modifications: 'Modifications',
  maintenance: 'Maintenance',
  photos: 'Photos',
  partsInventory: 'Parts & Inventory',
  documentsReceipts: 'Documents & Receipts',
  ownershipProvenance: 'Ownership / Provenance',
  recordQuality: 'Record Quality',
};

function clamp(value: number, maximum: number) {
  return Math.max(0, Math.min(maximum, Math.round(value)));
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function distinctCount(values: string[]) {
  return new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)).size;
}

function meaningfulActivities(activities: Activity[]) {
  const seen = new Set<string>();
  return activities.filter((activity) => {
    const title = activity.title.trim();
    const description = activity.description?.trim() ?? '';
    if (!title || /^(test|untitled|activity|update)$/i.test(title)) return false;
    if (!description && title.length < 12) return false;
    const identity = `${activity.activityType}:${title.toLowerCase()}:${activity.activityDate}`;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

function category(
  key: BuildScoreCategoryKey,
  score: number,
  evidence: string[],
  recommendation: string
): BuildScoreCategory {
  return {
    key,
    label: CATEGORY_LABELS[key],
    score: clamp(score, BUILD_SCORE_MAXIMUMS[key]),
    maxScore: BUILD_SCORE_MAXIMUMS[key],
    evidence: evidence.length > 0 ? evidence : ['No evidence found yet'],
    recommendation,
  };
}

function vehicleProfile(vehicle: Vehicle | null | undefined) {
  const evidence: string[] = [];
  let score = 0;
  if (vehicle?.year) { score += 2; evidence.push('Year recorded'); }
  if (vehicle?.make && vehicle.model) { score += 2; evidence.push('Make and model recorded'); }
  if (vehicle?.vin) { score += 2; evidence.push('VIN recorded'); }
  if (vehicle?.mileage !== null && vehicle?.mileage !== undefined) { score += 1; evidence.push('Mileage recorded'); }
  if (vehicle?.engine) { score += 1; evidence.push('Engine recorded'); }
  if (vehicle?.transmission) { score += 1; evidence.push('Transmission recorded'); }
  if (vehicle?.trim || vehicle?.nickname) { score += 1; evidence.push('Additional identity detail recorded'); }
  return category('vehicleProfile', score, evidence, 'Complete the missing vehicle identity fields.');
}

function buildTimeline(activities: Activity[], meaningful: Activity[]) {
  const stages = distinctCount(meaningful.map((activity) => activity.activityType));
  const score = meaningful.length === 0 ? 0 : Math.min(20, 5 + Math.min(3, Math.max(0, stages - 1)) * 5);
  return category(
    'buildTimeline',
    score,
    [`${meaningful.length} meaningful activities across ${stages} documented stages`, `${activities.length} total activity records reviewed`],
    'Add meaningful dated entries for undocumented build stages.'
  );
}

function modifications(meaningful: Activity[]) {
  const records = meaningful.filter((activity) => {
    const text = `${activity.activityType} ${activity.title} ${activity.description ?? ''}`.toLowerCase();
    return activity.activityType === 'Installed Part' || hasAny(text, ['install', 'modif', 'upgrade', 'fabricat', 'build', 'swap', 'tune']);
  });
  const score = records.length === 0 ? 0 : Math.min(15, 5 + Math.min(2, Math.max(0, distinctCount(records.map((activity) => activity.title)) - 1)) * 5);
  return category('modifications', score, [`${records.length} meaningful modification records`, 'Scored from existing activity records'], 'Document the next installation or build change with details and media.');
}

function maintenance(meaningful: Activity[]) {
  const records = meaningful.filter((activity) => {
    const text = `${activity.activityType} ${activity.title} ${activity.description ?? ''}`.toLowerCase();
    return activity.activityType === 'Maintenance' || hasAny(text, ['service', 'repair', 'inspection', 'oil change', 'brake']);
  });
  const score = records.length === 0 ? 0 : Math.min(10, 4 + Math.min(2, Math.max(0, distinctCount(records.map((activity) => activity.title)) - 1)) * 3);
  return category('maintenance', score, [`${records.length} maintenance or service records`, 'Scored from activity type and service language'], 'Log additional service or repair history with mileage when available.');
}

function photos(activities: Activity[], documents: Document[]) {
  const activityPhotos = activities.filter((activity) => activity.photos.length > 0);
  const documentPhotos = documents.filter((document) => document.mimeType.toLowerCase().startsWith('image/'));
  const coverageIds = new Set([
    ...activityPhotos.map((activity) => activity.id),
    ...documentPhotos.filter((document) => document.activityId).map((document) => document.activityId as string),
  ]);
  const photoCount = activityPhotos.reduce((count, activity) => count + activity.photos.length, 0) + documentPhotos.length;
  const coverage = coverageIds.size;
  const score = photoCount === 0 ? 0 : Math.min(15, 4 + Math.min(2, Math.max(0, coverage - 1)) * 4 + (coverage >= 4 ? 3 : 0));
  return category('photos', score, [`${photoCount} photos across ${coverage} documented activities`, 'Diminishing returns prevent a single upload from maxing Photos'], 'Add visual documentation to undocumented build events.');
}

function partsInventory(meaningful: Activity[]) {
  const parts = meaningful.filter((activity) => activity.activityType === 'Purchased Part' || activity.activityType === 'Installed Part');
  const score = parts.length === 0 ? 0 : Math.min(10, 3 + Math.min(2, Math.max(0, distinctCount(parts.map((activity) => activity.title)) - 1)) * 3 + (parts.length >= 4 ? 1 : 0));
  return category('partsInventory', score, [`${parts.length} documented part records`, 'Inventory relationships are not present in the current data model'], 'Record part purchases or installations with identifiers and supporting records.');
}

function documentsReceipts(documents: Document[]) {
  const records = documents.filter((document) => hasAny(document.documentType.toLowerCase(), ['receipt', 'invoice', 'diagram', 'manual', 'technical', 'reference', 'document']));
  const score = records.length === 0 ? 0 : Math.min(10, 4 + Math.min(2, Math.max(0, distinctCount(records.map((document) => document.documentType)) - 1)) * 3);
  return category('documentsReceipts', score, [`${records.length} receipts, invoices, or technical documents`, 'Scored from existing document types'], 'Attach receipts or technical references to the relevant build record.');
}

function ownershipProvenance(documents: Document[]) {
  const records = documents.filter((document) => hasAny(document.documentType.toLowerCase(), ['title', 'registration', 'ownership', 'provenance']));
  const hasTitle = records.some((document) => document.documentType.toLowerCase().includes('title'));
  const hasRegistration = records.some((document) => document.documentType.toLowerCase().includes('registration'));
  const score = hasTitle && hasRegistration ? 5 : records.length > 0 ? 3 : 0;
  return category('ownershipProvenance', score, [`${records.length} ownership or provenance records`, 'Warranty and insurance are not independent scoring categories'], 'Add title or registration evidence if relevant to this build.');
}

function recordQuality(meaningful: Activity[], documents: Document[]) {
  const qualityRecords = meaningful.filter((activity) => Boolean(activity.description?.trim()) && Boolean(activity.activityDate));
  const linkedRecords = meaningful.filter((activity) => activity.photos.length > 0 || activity.attachments.length > 0 || documents.some((document) => document.activityId === activity.id));
  const score = qualityRecords.length === 0 ? 0 : Math.min(5, 2 + (linkedRecords.length > 0 ? 2 : 0) + (qualityRecords.length >= 3 ? 1 : 0));
  return category('recordQuality', score, [`${qualityRecords.length} records include meaningful notes and dates`, `${linkedRecords.length} records include associated media or documents`], 'Add clear notes, dates, mileage, and supporting records to important events.');
}

export function calculateBuildScore(input: BuildScoreInput): BuildScoreResult {
  const meaningful = meaningfulActivities(input.activities);
  const categories = [
    vehicleProfile(input.vehicle),
    buildTimeline(input.activities, meaningful),
    modifications(meaningful),
    maintenance(meaningful),
    photos(input.activities, input.documents),
    partsInventory(meaningful),
    documentsReceipts(input.documents),
    ownershipProvenance(input.documents),
    recordQuality(meaningful, input.documents),
  ];
  const overallScore = clamp(categories.reduce((total, item) => total + item.score, 0), 100);
  const recommendations: DocumentationRecommendation[] = categories
    .filter((item) => item.score < item.maxScore)
    .map((item) => ({
      category: item.key,
      title: `${item.label} next step`,
      message: item.recommendation ?? 'Add supporting documentation to this category.',
      impact: item.score < item.maxScore / 2 ? 'high' : 'medium',
    }));
  return { overallScore, categories, recommendations };
}

export function calculateScoreDelta(previousScore: number, currentScore: number): BuildScoreDelta {
  return { previousScore, currentScore, delta: currentScore - previousScore };
}

export const calculateDocumentationScore = calculateBuildScore;
export function calculateCategoryScores(input: BuildScoreInput) {
  return calculateBuildScore(input).categories;
}
export const generateRecommendations = (input: BuildScoreInput) => calculateBuildScore(input).recommendations;
