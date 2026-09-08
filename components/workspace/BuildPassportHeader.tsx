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
    <View className="rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: 16 }}>
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">WRNC Build Score™</Text>
          <Text className="mt-1 text-3xl font-bold text-wrnc-text-primary">{vehicleTitle}</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">{vehicleSubtitle}</Text>
          <Text className="mt-3 text-xs uppercase tracking-wide text-wrnc-text-secondary">
            How completely this build has been documented, based on existing vehicle, activity, and record data.
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">Score</Text>
          <Text className="text-4xl font-bold text-wrnc-text-primary">{overallScore}</Text>
          <Text className="text-sm text-wrnc-text-secondary">/100</Text>
        </View>
      </View>

      <View style={{ marginTop: 16, maxWidth: 160, minHeight: 44 }}>
        <Button label="← Vehicle" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}
