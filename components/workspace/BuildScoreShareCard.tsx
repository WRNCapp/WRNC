import React from 'react';
import { Text, View } from 'react-native';
import type { BuildScoreDelta } from '../../types/documentationScore';

export type BuildScoreShareFormat = 'reel' | 'feed';

interface BuildScoreShareCardProps {
  score: number;
  delta?: BuildScoreDelta | null;
  activityTitle?: string;
  documentedSignals?: string[];
  format?: BuildScoreShareFormat;
  compact?: boolean;
}

export function BuildScoreShareCard({
  score,
  delta,
  activityTitle,
  documentedSignals = [],
  format = 'feed',
  compact = false,
}: BuildScoreShareCardProps) {
  const displayDelta = delta && delta.delta !== 0 ? `${delta.delta > 0 ? '+' : ''}${delta.delta}` : null;

  return (
    <View
      testID="build-score-share-card"
      style={{
        backgroundColor: '#080808',
        aspectRatio: format === 'reel' ? 9 / 16 : 4 / 5,
        justifyContent: compact ? 'flex-end' : 'center',
        padding: compact ? 12 : 24,
        width: '100%',
      }}
    >
      <Text style={{ color: '#C0C0C0', fontSize: compact ? 12 : 18, fontWeight: '700', letterSpacing: 2 }}>WRNC</Text>
      <Text style={{ color: '#FFFFFF', fontSize: compact ? 18 : 28, fontWeight: '800', marginTop: 8 }}>BUILD SCORE™</Text>
      <Text style={{ color: '#FF6400', fontSize: compact ? 26 : 48, fontWeight: '800', marginTop: 18 }}>
        {delta ? `${delta.previousScore} → ${delta.currentScore}` : `${score}/100`}
      </Text>
      {displayDelta ? <Text style={{ color: '#FF6400', fontSize: compact ? 16 : 24, fontWeight: '700', marginTop: 4 }}>{displayDelta}</Text> : null}
      {activityTitle ? <Text style={{ color: '#C0C0C0', fontSize: compact ? 11 : 16, marginTop: 18 }}>{activityTitle}</Text> : null}
      {!compact && documentedSignals.length > 0 ? (
        <Text style={{ color: '#C0C0C0', fontSize: 12, marginTop: 18 }}>
          {documentedSignals.map((signal) => `${signal} ✓`).join('   ')}
        </Text>
      ) : null}
      <View style={{ backgroundColor: '#7C3AED', height: 3, marginTop: compact ? 10 : 24, width: compact ? 48 : 80 }} />
    </View>
  );
}