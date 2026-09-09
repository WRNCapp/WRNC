import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface DocumentationScoreCardProps {
  score?: number;
  isLoading?: boolean;
  onPress?: () => void;
}

export function DocumentationScoreCard({ score, isLoading = false, onPress }: DocumentationScoreCardProps) {
  const scoreLabel = isLoading || score === undefined ? '—/100' : `${score}/100`;
  const detailLabel = isLoading || score === undefined ? 'Calculating documentation score…' : `${score} documentation points`;

  return (
    <Pressable
      testID="build-score-card"
      accessibilityRole="button"
      accessibilityLabel="Open Build Score breakdown and next steps"
      className="mt-3 rounded-xl border border-wrnc-border bg-wrnc-background p-3"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">WRNC Build Score™</Text>
          <Text className="mt-1 text-xs text-wrnc-text-secondary">{detailLabel}</Text>
          <Text className="mt-2 text-xs font-semibold text-wrnc-data-accent">Breakdown & Next Steps</Text>
        </View>
        <Text className="text-3xl font-bold text-wrnc-text-primary">{scoreLabel}</Text>
      </View>
    </Pressable>
  );
}
