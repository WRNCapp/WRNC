import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentationScoreCardProps {
  score?: number;
  isLoading?: boolean;
  onPress?: () => void;
}

export function DocumentationScoreCard({ score, isLoading = false, onPress }: DocumentationScoreCardProps) {
  const scoreLabel = isLoading || score === undefined ? '—/100' : `${score}/100`;
  const detailLabel = isLoading || score === undefined ? 'Calculating documentation score…' : `${score} of 100 documentation points`;
  return (
    <View testID="build-score-card" className="rounded-xl border border-wrnc-border bg-wrnc-background p-3" style={{ marginTop: 12 }}>
      <View className="flex-row items-end justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">WRNC Build Score™</Text>
          <Text className="mt-1 text-xs leading-4 text-wrnc-text-secondary">Documentation coverage across this build.</Text>
        </View>
        <Text className="text-3xl font-bold text-wrnc-text-primary">{scoreLabel}</Text>
      </View>
      <Text className="mt-2 text-xs font-medium text-wrnc-text-primary">{detailLabel}</Text>
      <View className="mt-2">
        <Button label="Breakdown & Next Steps" variant="secondary" compact onPress={onPress} />
      </View>
    </View>
  );
}
