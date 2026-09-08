import React from 'react';
import { render } from '@testing-library/react-native';
import { BuildScoreShareCard } from '../../components/workspace/BuildScoreShareCard';

describe('BuildScoreShareCard', () => {
  it('renders the score delta and compact watermark', () => {
    const { getByText, getByTestId } = render(
      <BuildScoreShareCard
        score={41}
        delta={{ previousScore: 37, currentScore: 41, delta: 4 }}
        activityTitle="Fuel Pump Relay Installation"
        documentedSignals={['ACTIVITY', 'PHOTOS', 'PART']}
        format="reel"
        compact
      />
    );

    expect(getByTestId('build-score-share-card')).toBeTruthy();
    expect(getByText('WRNC')).toBeTruthy();
    expect(getByText('BUILD SCORE™')).toBeTruthy();
    expect(getByText('37 → 41')).toBeTruthy();
    expect(getByText('+4')).toBeTruthy();
  });

  it('renders a feed card at the public score format', () => {
    const { getByText } = render(<BuildScoreShareCard score={42} format="feed" />);
    expect(getByText('42/100')).toBeTruthy();
  });
});
