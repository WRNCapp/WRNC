import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../common/Button';
import type { Activity } from '../../types/activity';
import type { Vehicle } from '../../types/vehicle';
import {
  filterTimelineActivities,
  selectTimelineSections,
  type TimelineFilters,
} from '../../utils/activityTimeline';
import { VehicleTimelineEmptyState } from './VehicleTimelineEmptyState';
import { VehicleTimelineFilters } from './VehicleTimelineFilters';
import { VehicleTimelineList } from './VehicleTimelineList';

const DEFAULT_FILTERS: TimelineFilters = {
  sortDirection: 'desc',
  activityType: 'all',
  status: 'all',
  startDate: '',
  endDate: '',
};

export interface VehicleTimelineScreenProps {
  vehicle: Vehicle;
  activities: Activity[];
  isLoading?: boolean;
  onBack: () => void;
  onBuildPassport: () => void;
  onActivityPress: (activityId: string) => void;
  onCreateActivity: () => void;
}

export function VehicleTimelineScreen({
  vehicle,
  activities,
  isLoading,
  onBack,
  onBuildPassport,
  onActivityPress,
  onCreateActivity,
}: VehicleTimelineScreenProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);

  const filteredActivities = useMemo(
    () => filterTimelineActivities(activities, filters),
    [activities, filters]
  );
  const sections = useMemo(
    () => selectTimelineSections(activities, filters),
    [activities, filters]
  );
  const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const listHeader = (
    <View>
      <Button label="← Vehicle" variant="secondary" onPress={onBack} />
      <View className="mt-3">
        <Button label="Build Passport" variant="secondary" onPress={onBuildPassport} />
      </View>
      <View className="mt-4">
        <Text className="text-3xl font-bold text-wrnc-text-primary">Timeline</Text>
        <Text className="mt-2 text-sm text-wrnc-text-secondary">{vehicle.nickname || vehicleLabel}</Text>
      </View>
      <View className="mt-4">
        <Button label="Add Activity" onPress={onCreateActivity} />
      </View>
      <VehicleTimelineFilters filters={filters} onFiltersChange={setFilters} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      {isLoading ? (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {listHeader}
          <View className="items-center justify-center rounded-2xl border border-wrnc-border bg-wrnc-surface px-6 py-12">
            <Text className="text-sm text-wrnc-text-secondary">Loading activities…</Text>
          </View>
        </ScrollView>
      ) : filteredActivities.length === 0 ? (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {listHeader}
          <VehicleTimelineEmptyState onCreateActivity={onCreateActivity} />
        </ScrollView>
      ) : (
        <View className="flex-1 px-4">
          <VehicleTimelineList
            sections={sections}
            totalCount={filteredActivities.length}
            vehicleLabel={vehicleLabel}
            header={listHeader}
            onActivityPress={onActivityPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
