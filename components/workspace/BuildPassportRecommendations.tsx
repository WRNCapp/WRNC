import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import { passportLayout } from './passportLayout';
import type { BuildPassportRecommendation } from '../../types/buildPassport';

interface BuildPassportRecommendationsProps {
  recommendations: BuildPassportRecommendation[];
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderRecommendationLink(
  recommendation: BuildPassportRecommendation,
  onNavigate: (route: string) => void,
  onBack: () => void
) {
  if (recommendation.action === 'back') {
    return <Button label={recommendation.sourceLabel} variant="secondary" onPress={onBack} />;
  }

  if (!recommendation.route) {
    return null;
  }

  return <Button label={recommendation.sourceLabel} variant="secondary" onPress={() => onNavigate(recommendation.route as string)} />;
}

export function BuildPassportRecommendations({ recommendations, onNavigate, onBack }: BuildPassportRecommendationsProps) {
  return (
    <View className="rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
      <Text className="text-lg font-semibold text-wrnc-text-primary">Missing Documentation Recommendations</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">Actionable gaps linked back to source records.</Text>

      <View style={passportLayout.stack}>
        {recommendations.length === 0 ? (
          <Text className="text-sm text-wrnc-text-secondary">No recommendations. The current record set is complete for the configured categories.</Text>
        ) : (
          recommendations.map((item) => (
            <View key={`${item.category}-${item.title}`} className="rounded-xl border border-wrnc-border bg-wrnc-background p-4">
              <View>
                <View>
                  <Text className="text-sm font-semibold text-wrnc-text-primary">{item.title}</Text>
                  <Text className="mt-1 text-sm text-wrnc-text-secondary">{item.message}</Text>
                </View>
                <Text className="mt-2 self-start text-xs uppercase tracking-wide text-wrnc-text-secondary">{item.impact}</Text>
              </View>

              <View style={{ marginTop: 12, minHeight: 44 }}>
                {renderRecommendationLink(item, onNavigate, onBack)}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
