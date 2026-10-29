import React from 'react';
import { Text, View } from 'react-native';

export interface VehicleTimelineGroupHeaderProps {
  title: string;
}

export function VehicleTimelineGroupHeader({ title }: VehicleTimelineGroupHeaderProps) {
  return (
    <View className="bg-wrnc-background py-3">
      <Text className="text-sm font-semibold uppercase tracking-wide text-wrnc-text-secondary">{title}</Text>
    </View>
  );
}