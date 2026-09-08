import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface BuildPassportHeaderProps {
  vehicleTitle: string;
  vehicleSubtitle: string;
  overallScore: number;
  onBack: () => void;
}

export function BuildPassportHeader({ vehicleTitle, vehicleSubtitle, overallScore, onBack }: BuildPassportHeaderProps) {
  return (
    <View className="rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: 12 }}>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">WRNC Build Score™</Text>
          <Text className="mt-1 text-2xl font-bold text-wrnc-text-primary">{vehicleTitle}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{vehicleSubtitle}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">Score</Text>
          <Text className="text-4xl font-bold text-wrnc-text-primary">{overallScore}</Text>
          <Text className="text-sm text-wrnc-text-secondary">/100</Text>
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Button label="← Vehicle" variant="secondary" compact onPress={onBack} />
      </View>
    </View>
  );
}
