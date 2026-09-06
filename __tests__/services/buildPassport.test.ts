import { calculateBuildPassport } from '../../services/buildPassport';
import type { Activity } from '../../types/activity';
import type { DocumentationScoreResult } from '../../types/documentationScore';
import type { Document } from '../../types/document';
import type { Vehicle } from '../../types/vehicle';

describe('build passport service', () => {
  const vehicle: Vehicle = {
    id: 'veh-1',
    workspaceId: 'ws-1',
    vin: '1HGCM82633A004352',
    year: 2000,
    make: 'Honda',
    model: 'Civic',
    trim: null,
    nickname: 'Bluebird',
    engine: null,
    transmission: null,
    mileage: 120000,
    coverPhotoUrl: null,
    archivedAt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const activities: Activity[] = [
    {
      id: 'act-1',
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Maintenance',
      title: 'Oil change',
      description: 'Maintenance completed',
      activityDate: '2024-03-01',
      createdAt: '2024-03-01T10:00:00.000Z',
      updatedAt: '2024-03-01T10:00:00.000Z',
      photos: [],
      attachments: [],
      metadata: null,
      archivedAt: null,
    },
    {
      id: 'act-2',
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Progress Update',
      title: 'Build update',
      description: 'Installed intake',
      activityDate: '2024-04-01',
      createdAt: '2024-04-01T10:00:00.000Z',
      updatedAt: '2024-04-01T10:00:00.000Z',
      photos: [],
      attachments: [],
      metadata: null,
      archivedAt: null,
    },
  ];

  const documents: Document[] = [
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
      uploadedAt: '2024-02-01T10:00:00.000Z',
      archivedAt: null,
      createdAt: '2024-02-01T10:00:00.000Z',
      updatedAt: '2024-02-01T10:00:00.000Z',
    },
    {
      id: 'doc-2',
      workspaceId: 'ws-1',
      vehicleId: 'veh-1',
      activityId: null,
      documentType: 'Photo',
      title: 'Garage photo',
      description: null,
      fileUrl: 'https://example.com/photo.jpg',
      thumbnailUrl: null,
      mimeType: 'image/jpeg',
      fileSize: 2048,
      uploadedBy: 'user-1',
      uploadedAt: '2024-05-01T10:00:00.000Z',
      archivedAt: null,
      createdAt: '2024-05-01T10:00:00.000Z',
      updatedAt: '2024-05-01T10:00:00.000Z',
    },
  ];

  const documentationScore: DocumentationScoreResult = {
    overallScore: 72,
    categories: [
      {
        key: 'vehicleProfile',
        label: 'Vehicle Profile',
        score: 10,
        maxScore: 100,
        evidence: ['Recorded'],
      },
      {
        key: 'buildTimeline',
        label: 'Build Timeline',
        score: 10,
        maxScore: 100,
        evidence: ['Recorded'],
      },
    ],
    recommendations: [
      {
        category: 'buildTimeline',
        title: 'Build Timeline next step',
        message: 'Add meaningful dated entries for undocumented build stages.',
        impact: 'medium',
      },
      {
        category: 'ownershipProvenance',
        title: 'Ownership / Provenance next step',
        message: 'Add title or registration evidence if relevant to this build.',
        impact: 'high',
      },
    ],
  };

  it('aggregates the current vehicle record into passport sections', () => {
    const passport = calculateBuildPassport({ vehicle, activities, documents, documentationScore });

    expect(passport.vehicleSummary.title).toBe('Bluebird');
    expect(passport.vehicleSummary.sourceLinks[0]).toEqual({ label: 'Back to Vehicle Workspace', action: 'back' });
    expect(passport.timelineSummary.totalActivities).toBe(2);
    expect(passport.timelineSummary.latestActivity?.id).toBe('act-2');
    expect(passport.documentationSummary.totalDocuments).toBe(2);
    expect(passport.documentationSummary.photoDocuments).toBe(1);
    expect(passport.statistics.totalPhotos).toBe(1);
    expect(passport.statistics.maintenanceActivities).toBe(1);
    expect(passport.statistics.activityTypeBreakdown[0]).toEqual({ label: 'Maintenance', count: 1 });
  });

  it('maps recommendations back to the relevant source sections', () => {
    const passport = calculateBuildPassport({ vehicle, activities, documents, documentationScore });

    expect(passport.recommendations[0]).toMatchObject({
      route: '/vehicle/veh-1/timeline',
      sourceLabel: 'Open Timeline',
    });
    expect(passport.recommendations[1]).toMatchObject({
      route: '/vehicle/veh-1/documents',
      sourceLabel: 'Open Documents',
    });
  });
});