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
  onNavigate: (route: string) => void
) {
  if (recommendation.action === 'back') {
    return null;
  }

  if (!recommendation.route) {
    return null;
  }

  return <Button label={recommendation.sourceLabel} variant="secondary" compact onPress={() => onNavigate(recommendation.route as string)} />;
}

function recommendationTitle(title: string) {
  return title.replace(/\s+next step$/i, '').replace(/\s+needs attention$/i, '');
}

function recommendationMessage(message: string) {
  return message.replace(/^Next:\s*/i, '');
}

export function BuildPassportRecommendations({ recommendations, onNavigate }: BuildPassportRecommendationsProps) {
  return (
    <View>
      <Text className="text-lg font-semibold text-wrnc-text-primary">Next Steps</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">Useful records to add next.</Text>

      <View style={passportLayout.stack}>
        {recommendations.length === 0 ? (
          <Text className="text-sm text-wrnc-text-secondary">No next steps right now.</Text>
        ) : (
          recommendations.map((item) => (
            <View key={`${item.category}-${item.title}`} className="rounded-lg bg-wrnc-background p-3">
              <View>
                <View>
                  <Text className="text-sm font-semibold text-wrnc-text-primary">{recommendationTitle(item.title)}</Text>
                  <Text className="mt-1 text-sm text-wrnc-text-secondary">{recommendationMessage(item.message)}</Text>
                </View>
              </View>

              <View style={{ marginTop: 8, minHeight: 44 }}>
                {renderRecommendationLink(item, onNavigate)}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
