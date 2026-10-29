import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Vehicle } from '../../types/vehicle';
import { VehicleHeroPhoto } from './VehicleHeroPhoto';

export interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export function vehicleIdentity(vehicle: Pick<Vehicle, 'year' | 'make' | 'model' | 'nickname'>) {
  const yearMakeModel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  return {
    title: vehicle.nickname || yearMakeModel,
    subtitle: vehicle.nickname ? yearMakeModel : null,
  };
}

/** Garage list item: photo first, then identity. */
export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const { title, subtitle } = vehicleIdentity(vehicle);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${title}`}
      className="overflow-hidden rounded-xl border border-wrnc-border bg-wrnc-surface"
      onPress={onPress}
    >
      <VehicleHeroPhoto coverPhotoPath={vehicle.coverPhotoPath} capsCard />
      <View className="flex-row items-center justify-between gap-3 p-4">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-wrnc-text-primary" numberOfLines={1}>{title}</Text>
          {subtitle ? <Text className="mt-1 text-sm text-wrnc-text-secondary">{subtitle}</Text> : null}
          {vehicle.archivedAt ? (
            <View className="mt-2 flex-row">
              <Text className="rounded-full bg-wrnc-data-accent/20 px-2 py-1 text-xs font-medium text-wrnc-data-accent-text">Archived</Text>
            </View>
          ) : null}
        </View>
        <Text className="text-xl text-wrnc-text-secondary">›</Text>
      </View>
    </Pressable>
  );
}
