import {
  BUILD_SCORE_MAXIMUMS,
  calculateBuildScore,
  calculateScoreDelta,
} from '../../services/documentationScore';
import type { Activity } from '../../types/activity';
import type { Document } from '../../types/document';
import type { Vehicle } from '../../types/vehicle';

const vehicle: Vehicle = {
  id: 'veh-1',
  workspaceId: 'ws-1',
  vin: '1HGCM82633A004352',
  year: 2000,
  make: 'Honda',
  model: 'Civic',
  trim: null,
  nickname: null,
  engine: '2.0L',
  transmission: 'Manual',
  mileage: 120000,
  coverPhotoUrl: null,
  archivedAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function activity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'act-1',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Progress Update',
    title: 'Installed intake system',
    description: 'Documented the intake installation and fitment.',
    activityDate: '2024-03-01',
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: null,
    archivedAt: null,
    ...overrides,
  };
}

function document(overrides: Partial<Document> = {}): Document {
  return {
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
    fileSize: 100,
    uploadedBy: 'user-1',
    uploadedAt: '2024-03-01T10:00:00.000Z',
    archivedAt: null,
    createdAt: '2024-03-01T10:00:00.000Z',
    updatedAt: '2024-03-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('WRNC Build Score v1.0', () => {
  it('has category maximums totaling 100 and always stays bounded', () => {
    expect(Object.values(BUILD_SCORE_MAXIMUMS).reduce((total, value) => total + value, 0)).toBe(100);
    const result = calculateBuildScore({ vehicle: null, activities: [], documents: [] });
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.categories).toHaveLength(9);
  });

  it('does not max Photos from a single image', () => {
    const result = calculateBuildScore({
      vehicle,
      activities: [activity({ photos: ['photo.jpg'] })],
      documents: [],
    });
    const photos = result.categories.find((item) => item.key === 'photos');
    expect(photos?.score).toBeLessThan(15);
  });

  it('does not let repeated low-quality activities farm Timeline points', () => {
    const activities = Array.from({ length: 12 }, (_, index) => activity({
      id: `test-${index}`,
      title: 'test',
      description: null,
      activityDate: `2024-01-${String(index + 1).padStart(2, '0')}`,
    }));
    const result = calculateBuildScore({ vehicle: null, activities, documents: [] });
    expect(result.categories.find((item) => item.key === 'buildTimeline')?.score).toBe(0);
  });

  it('rewards meaningful documentation without making warranty absence a major penalty', () => {
    const result = calculateBuildScore({
      vehicle,
      activities: [activity()],
      documents: [document({ documentType: 'Title' }), document({ id: 'doc-2', documentType: 'Registration' })],
    });
    expect(result.categories.find((item) => item.key === 'buildTimeline')?.score).toBeGreaterThan(0);
    expect(result.categories.find((item) => item.key === 'modifications')?.score).toBeGreaterThan(0);
    expect(result.categories.find((item) => item.key === 'ownershipProvenance')?.score).toBe(5);
    expect(result.categories.some((item) => item.label === 'Warranty Documents')).toBe(false);
  });

  it('represents score increases, no change, and decreases', () => {
    expect(calculateScoreDelta(37, 41)).toEqual({ previousScore: 37, currentScore: 41, delta: 4 });
    expect(calculateScoreDelta(41, 41).delta).toBe(0);
    expect(calculateScoreDelta(41, 37).delta).toBe(-4);
  });
});
