import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface BuildPassportHeaderProps {
  vehicleTitle: string;
  vehicleSubtitle: string;
  overallScore: number;
  onBack: () => void;
}

export function BuildPassportHeader({ vehicleTitle, vehicleSubtitle, overallScore, onBack }: BuildPassportHeaderProps) {
  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to vehicle"
          className="min-h-11 justify-center pr-4"
          onPress={onBack}
        >
          <Text className="text-sm font-semibold text-wrnc-text-secondary">← Vehicle</Text>
        </Pressable>
        <Text className="text-sm font-semibold uppercase tracking-wide text-wrnc-text-secondary">Build Passport</Text>
      </View>
      <View className="flex-row items-start justify-between gap-3 border-b border-wrnc-border pb-3">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-wrnc-text-primary">{vehicleTitle}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{vehicleSubtitle}</Text>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-3xl font-bold text-wrnc-text-primary">{overallScore}</Text>
          <Text className="text-sm text-wrnc-text-secondary">/100</Text>
        </View>
      </View>
    </View>
  );
}
