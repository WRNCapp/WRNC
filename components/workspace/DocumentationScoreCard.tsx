import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentationScoreCardProps {
  score: number;
  onPress?: () => void;
}

export function DocumentationScoreCard({ score, onPress }: DocumentationScoreCardProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-surface p-4">
      <Text className="text-sm font-semibold uppercase tracking-wide text-wrnc-text-secondary">WRNC Build Score™</Text>
      <Text className="mt-2 text-4xl font-bold text-wrnc-text-primary">{score}/100</Text>
      <View className="mt-3">
        <Button label="View Details" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
}
