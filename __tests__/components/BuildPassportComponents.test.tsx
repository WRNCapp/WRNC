import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BuildPassportHeader } from '../../components/workspace/BuildPassportHeader';
import { BuildPassportVehicleSummary } from '../../components/workspace/BuildPassportVehicleSummary';
import { BuildPassportTimelineSummary } from '../../components/workspace/BuildPassportTimelineSummary';
import { BuildPassportDocumentationSummary } from '../../components/workspace/BuildPassportDocumentationSummary';
import { BuildPassportRecommendations } from '../../components/workspace/BuildPassportRecommendations';
import { BuildPassportStatistics } from '../../components/workspace/BuildPassportStatistics';

describe('BuildPassport components', () => {
  it('renders the header and back action', () => {
    const onBack = jest.fn();
    const { getByText } = render(
      <BuildPassportHeader
        vehicleTitle="Bluebird"
        vehicleSubtitle="2000 Honda Civic"
        overallScore={88}
        onBack={onBack}
      />
    );

    fireEvent.press(getByText('← Vehicle'));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(getByText('88')).toBeTruthy();
  });

  it('renders the vehicle summary with navigation', () => {
    const onNavigate = jest.fn();
    const onBack = jest.fn();
    const { getByText } = render(
      <BuildPassportVehicleSummary
        summary={{
          title: 'Bluebird',
          subtitle: '2000 Honda Civic',
          details: [{ label: 'VIN', value: '123' }],
          sourceLinks: [{ label: 'Back to Vehicle Workspace', action: 'back' }],
        }}
        onNavigate={onNavigate}
        onBack={onBack}
      />
    );

    fireEvent.press(getByText('Back to Vehicle Workspace'));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('renders the timeline summary and source links', () => {
    const onNavigate = jest.fn();
    const { getByText } = render(
      <BuildPassportTimelineSummary
        summary={{
          totalActivities: 2,
          activeActivities: 2,
          archivedActivities: 0,
          latestActivity: {
            id: 'act-2',
            vehicleId: 'veh-1',
            userId: 'user-1',
            activityType: 'Progress Update',
            title: 'Build update',
            description: null,
            activityDate: '2024-04-01',
            createdAt: '2024-04-01T10:00:00.000Z',
            updatedAt: '2024-04-01T10:00:00.000Z',
            photos: [],
            attachments: [],
            metadata: null,
            archivedAt: null,
          },
          sourceLinks: [{ label: 'Open Timeline', route: '/vehicle/veh-1/timeline' }],
        }}
        onNavigate={onNavigate}
        onBack={jest.fn()}
      />
    );

    fireEvent.press(getByText('Open Timeline'));
    expect(onNavigate).toHaveBeenCalledWith('/vehicle/veh-1/timeline');
  });

  it('renders the documentation summary and category progress', () => {
    const onNavigate = jest.fn();
    const { getByText } = render(
      <BuildPassportDocumentationSummary
        summary={{
          overallScore: 88,
          totalDocuments: 1,
          activeDocuments: 1,
          archivedDocuments: 0,
          photoDocuments: 0,
          latestDocument: {
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
          categories: [
            { key: 'vehicleProfile', label: 'Vehicle Profile', score: 10, maxScore: 10, evidence: ['Recorded'] },
          ],
          sourceLinks: [{ label: 'Open Documents', route: '/vehicle/veh-1/documents' }],
        }}
        onNavigate={onNavigate}
        onBack={jest.fn()}
      />
    );

    fireEvent.press(getByText('Open Documents'));
    expect(onNavigate).toHaveBeenCalledWith('/vehicle/veh-1/documents');
    expect(getByText('Vehicle Profile')).toBeTruthy();
  });

  it('renders recommendations and statistics', () => {
    const onNavigate = jest.fn();
    const { getByText } = render(
      <BuildPassportRecommendations
        recommendations={[
          {
            category: 'ownershipProvenance',
            title: 'Registration needs attention',
            message: 'Upload registration documents.',
            impact: 'high',
            route: '/vehicle/veh-1/documents',
            sourceLabel: 'Open Documents',
          },
        ]}
        onNavigate={onNavigate}
        onBack={jest.fn()}
      />
    );

    fireEvent.press(getByText('Open Documents'));
    expect(onNavigate).toHaveBeenCalledWith('/vehicle/veh-1/documents');
    expect(getByText('Registration needs attention')).toBeTruthy();

    const { getByText: getStatsByText } = render(
      <BuildPassportStatistics
        statistics={{
          totalActivities: 2,
          activeActivities: 2,
          archivedActivities: 0,
          totalDocuments: 1,
          activeDocuments: 1,
          archivedDocuments: 0,
          totalPhotos: 0,
          maintenanceActivities: 1,
          activityTypeBreakdown: [{ label: 'Maintenance', count: 1 }],
          documentTypeBreakdown: [{ label: 'Receipt', count: 1 }],
          documentationScore: 88,
        }}
      />
    );

    expect(getStatsByText('88/100')).toBeTruthy();
    expect(getStatsByText('Maintenance')).toBeTruthy();
  });
});
