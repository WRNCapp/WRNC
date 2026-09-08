import {
  calculateCategoryScores,
  calculateDocumentationScore,
  generateRecommendations,
} from '../../services/documentationScore';
import type { DocumentationScoreInput } from '../../types/documentationScore';

describe('documentation score service', () => {
  const baseInput: DocumentationScoreInput = {
    vehicle: {
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
    activities: [
      {
        id: 'act-1',
        vehicleId: 'veh-1',
        userId: 'user-1',
        activityType: 'Maintenance',
        title: 'Maintenance update',
        description: 'Oil change completed',
        activityDate: '2024-01-01',
        photos: [],
        attachments: [],
        metadata: null,
        archivedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        workspaceId: 'ws-1',
        vehicleId: 'veh-1',
        activityId: null,
        documentType: 'Receipt',
        title: 'Receipt',
        description: null,
        fileUrl: 'https://example.com/receipt.pdf',
        thumbnailUrl: null,
        mimeType: 'application/pdf',
        fileSize: 1024,
        uploadedBy: 'user-1',
        uploadedAt: '2024-01-01T00:00:00.000Z',
        archivedAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ],
  };

  it('calculates category scores from existing records', () => {
    const categories = calculateCategoryScores(baseInput);
    const vehicleCategory = categories.find((category) => category.key === 'vehicleProfile');
    const activityCategory = categories.find((category) => category.key === 'buildTimeline');
    const photoCategory = categories.find((category) => category.key === 'photos');
    expect(vehicleCategory?.score).toBeGreaterThan(0);
    expect(vehicleCategory?.score).toBeLessThanOrEqual(100);
    expect(activityCategory?.evidence).toEqual([
      '1 meaningful activities across 1 documented stages',
      '1 total activity records reviewed',
    ]);
    expect(photoCategory?.evidence).toEqual([
      '0 photos across 0 documented activities',
      'Diminishing returns prevent a single upload from maxing Photos',
    ]);
  });

  it('produces an overall documentation score', () => {
    const result = calculateDocumentationScore(baseInput);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.categories.length).toBe(9);
  });

  it('generates recommendations for low-scoring categories', () => {
    const recommendations = generateRecommendations(baseInput);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].title).toContain('next step');
  });
});
