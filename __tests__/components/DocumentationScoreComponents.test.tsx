import React from 'react';
import { render } from '@testing-library/react-native';
import { DocumentationScoreCard } from '../../components/workspace/DocumentationScoreCard';
import { DocumentationScoreBreakdown } from '../../components/workspace/DocumentationScoreBreakdown';
import { DocumentationRecommendations } from '../../components/workspace/DocumentationRecommendations';
import { DocumentationCategoryProgress } from '../../components/workspace/DocumentationCategoryProgress';

describe('documentation score components', () => {
  it('renders the score card', () => {
    const { getByText } = render(<DocumentationScoreCard score={72} />);
    expect(getByText('72/100')).toBeTruthy();
  });

  it('renders the breakdown', () => {
    const { getByText } = render(
      <DocumentationScoreBreakdown categories={[{ key: 'vehicleProfile', label: 'Vehicle Profile', score: 5, maxScore: 10, evidence: ['Recorded'] }]} />
    );
    expect(getByText('Vehicle Profile')).toBeTruthy();
  });

  it('renders recommendations', () => {
    const { getByText } = render(
      <DocumentationRecommendations recommendations={[{ category: 'photos', title: 'Photos need attention', message: 'Upload photos', impact: 'medium' }]} />
    );
    expect(getByText('Photos need attention')).toBeTruthy();
  });

  it('renders category progress', () => {
    const { getByText } = render(
      <DocumentationCategoryProgress category={{ key: 'documentsReceipts', label: 'Documents & Receipts', score: 8, maxScore: 10, evidence: ['Recorded'] }} />
    );
    expect(getByText('Documents & Receipts')).toBeTruthy();
  });
});
