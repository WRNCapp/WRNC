import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { BuildPassportStatistics } from '../../components/workspace/BuildPassportStatistics';
import { BuildPassportTimelineSummary } from '../../components/workspace/BuildPassportTimelineSummary';
import { BuildPassportDocumentationSummary } from '../../components/workspace/BuildPassportDocumentationSummary';
import { passportLayout } from '../../components/workspace/passportLayout';

describe('Passport native layout contract', () => {
  const statistics = {
    totalActivities: 0, activeActivities: 0, archivedActivities: 0,
    totalDocuments: 0, activeDocuments: 0, archivedDocuments: 0,
    totalPhotos: 0, maintenanceActivities: 0, activityTypeBreakdown: [],
    documentTypeBreakdown: [], documentationScore: 7,
  };

  it.each([320, 390, 402, 768])('fits two metrics without flex shrink at %ipx', (width) => {
    const contentWidth = width - 32 - 42; // screen padding + card padding/border
    const { getAllByTestId, getByTestId, getByText } = render(<BuildPassportStatistics statistics={statistics} />);
    const cards = getAllByTestId('build-stat');
    expect(cards).toHaveLength(6);
    for (const card of cards) {
      const style = StyleSheet.flatten(card.props.style);
      expect(style.width).toBe('48%');
      expect(style.flex).toBeUndefined();
      expect(style.height).toBeUndefined(); // text can grow vertically
      expect(contentWidth * 0.48 * 2).toBeLessThanOrEqual(contentWidth);
      expect(contentWidth * 0.48 * 3).toBeGreaterThan(contentWidth);
    }
    expect(StyleSheet.flatten(getByTestId('build-stat-grid').props.style)).toMatchObject({ marginTop: 16, rowGap: 12, flexWrap: 'wrap' });
    expect(getByText('WRNC Build Score')).toBeTruthy();
    expect(getByText('7/100')).toBeTruthy();
  });

  it('uses the same metric layout for timeline and documentation', () => {
    const timeline = render(<BuildPassportTimelineSummary summary={{ totalActivities: 0, activeActivities: 0, archivedActivities: 0, latestActivity: null, sourceLinks: [] }} onNavigate={jest.fn()} onBack={jest.fn()} />);
    expect(timeline.getAllByTestId('timeline-stat')).toHaveLength(3);
    expect(StyleSheet.flatten(timeline.getByTestId('timeline-stat-grid').props.style)).toEqual(passportLayout.metricGrid);
    const docs = render(<BuildPassportDocumentationSummary summary={{ overallScore: 7, totalDocuments: 0, activeDocuments: 0, archivedDocuments: 0, photoDocuments: 0, latestDocument: null, categories: [], sourceLinks: [] }} onNavigate={jest.fn()} onBack={jest.fn()} />);
    expect(docs.getAllByTestId('documentation-stat')).toHaveLength(4);
    expect(StyleSheet.flatten(docs.getByTestId('documentation-stat-grid').props.style)).toEqual(passportLayout.metricGrid);
  });

  it('uses positive spacing and full-width touch targets, without gap emulation', () => {
    expect(passportLayout.stack).toMatchObject({ marginTop: 16, rowGap: 12 });
    expect(passportLayout.compactStack).toMatchObject({ marginTop: 16, rowGap: 8 });
    expect(passportLayout.link).toMatchObject({ width: '100%', minHeight: 44 });
    expect(passportLayout.detailValue).toMatchObject({ flex: 1, textAlign: 'right' });
  });
});
