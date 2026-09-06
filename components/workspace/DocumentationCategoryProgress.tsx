import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationCategoryProgressProps {
  category: DocumentationCategoryScore;
}

export function DocumentationCategoryProgress({ category }: DocumentationCategoryProgressProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-background p-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-sm font-semibold text-wrnc-text-primary">{category.label}</Text>
        <Text className="text-sm font-semibold text-wrnc-data-accent">{category.score}/{category.maxScore}</Text>
      </View>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">
        {category.evidence[0]}
      </Text>
      {category.recommendation ? <Text className="mt-2 text-xs text-wrnc-text-secondary">Next: {category.recommendation}</Text> : null}
    </View>
  );
}
