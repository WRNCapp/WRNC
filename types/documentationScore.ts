import type { Activity } from './activity';
import type { Document } from './document';
import type { Vehicle } from './vehicle';

export type BuildScoreCategoryKey =
  | 'vehicleProfile'
  | 'buildTimeline'
  | 'modifications'
  | 'maintenance'
  | 'photos'
  | 'partsInventory'
  | 'documentsReceipts'
  | 'ownershipProvenance'
  | 'recordQuality';

export type DocumentationCategoryKey = BuildScoreCategoryKey;

export interface BuildScoreCategory {
  key: BuildScoreCategoryKey;
  label: string;
  score: number;
  maxScore: number;
  evidence: string[];
  recommendation?: string;
}

export type DocumentationCategoryScore = BuildScoreCategory;

export interface DocumentationRecommendation {
  category: BuildScoreCategoryKey;
  title: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DocumentationScoreResult {
  overallScore: number;
  categories: BuildScoreCategory[];
  recommendations: DocumentationRecommendation[];
}

export type BuildScoreResult = DocumentationScoreResult;

export interface BuildScoreDelta {
  previousScore: number;
  currentScore: number;
  delta: number;
}

export interface DocumentationScoreInput {
  vehicle: Vehicle | null | undefined;
  activities: Activity[];
  documents: Document[];
}

export type BuildScoreInput = DocumentationScoreInput;
