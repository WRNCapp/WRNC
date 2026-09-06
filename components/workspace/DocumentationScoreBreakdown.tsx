import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationScoreBreakdownProps {
  categories: DocumentationCategoryScore[];
}

export function DocumentationScoreBreakdown({ categories }: DocumentationScoreBreakdownProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-surface p-4">
      {categories.map((category) => (
        <View key={category.key} className="mb-3 last:mb-0">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-wrnc-text-primary">{category.label}</Text>
            <Text className="text-sm text-wrnc-text-secondary">{category.score}/{category.maxScore}</Text>
          </View>
          <Text className="mt-1 text-xs text-wrnc-text-secondary">{category.evidence.join(', ')}</Text>
          {category.recommendation ? <Text className="mt-1 text-xs text-wrnc-text-secondary">Next: {category.recommendation}</Text> : null}
        </View>
      ))}
    </View>
  );
}
