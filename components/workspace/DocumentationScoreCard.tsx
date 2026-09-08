import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentationScoreCardProps {
  score: number;
  onPress?: () => void;
}

export function DocumentationScoreCard({ score, onPress }: DocumentationScoreCardProps) {
  return (
    <View testID="build-score-card" className="rounded-lg border border-wrnc-border bg-wrnc-surface p-4" style={{ marginTop: 12 }}>
      <Text className="text-sm font-semibold uppercase tracking-wide text-wrnc-text-secondary">WRNC Build Score™</Text>
      <Text className="mt-2 text-4xl font-bold text-wrnc-text-primary">{score}/100</Text>
      <Text className="mt-2 text-sm font-semibold text-wrnc-text-primary">{score} of 100 documentation points</Text>
      <Text className="mt-1 text-sm leading-5 text-wrnc-text-secondary">
        Measures how completely this vehicle’s build is documented across vehicle details, work history, photos, parts, receipts, and provenance.
      </Text>
      <View className="mt-3">
        <Button label="See Breakdown & Next Steps" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
}
