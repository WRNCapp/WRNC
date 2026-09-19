import React, { memo } from 'react';
import { Text, Pressable, View } from 'react-native';
import { Input } from '../common/Input';
import { ACTIVITY_TYPES, type ActivityType } from '../../types/activity';
import type { TimelineFilters } from '../../utils/activityTimeline';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`rounded-full px-3 py-2 ${selected ? 'bg-wrnc-data-accent' : 'bg-wrnc-surface-elevated'}`}
      onPress={onPress}
    >
      <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-wrnc-text-secondary'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export interface VehicleTimelineFiltersProps {
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
}

function VehicleTimelineFiltersComponent({
  filters,
  onFiltersChange,
}: VehicleTimelineFiltersProps) {
  const setActivityType = (activityType: ActivityType | 'all') => {
    onFiltersChange({ ...filters, activityType });
  };

  const setStatus = (status: TimelineFilters['status']) => {
    onFiltersChange({ ...filters, status });
  };

  return (
    <View className="mb-3 mt-3 rounded-xl border border-wrnc-border bg-wrnc-surface p-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-wrnc-text-primary">Filters</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            onFiltersChange({
              ...filters,
              sortDirection: filters.sortDirection === 'desc' ? 'asc' : 'desc',
            })
          }
        >
          <Text className="text-sm font-semibold text-wrnc-data-accent">
            {filters.sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
          </Text>
        </Pressable>
      </View>

      <Text className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
        Activity Type
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <FilterChip label="All" selected={filters.activityType === 'all'} onPress={() => setActivityType('all')} />
        {ACTIVITY_TYPES.map((type) => (
          <FilterChip
            key={type}
            label={type}
            selected={filters.activityType === type}
            onPress={() => setActivityType(type)}
          />
        ))}
      </View>

      <Text className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
        Status
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <FilterChip label="All" selected={filters.status === 'all'} onPress={() => setStatus('all')} />
        <FilterChip label="Active" selected={filters.status === 'active'} onPress={() => setStatus('active')} />
        <FilterChip label="Archived" selected={filters.status === 'archived'} onPress={() => setStatus('archived')} />
      </View>

      <View className="mt-3 flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Start Date"
            value={filters.startDate}
            onChangeText={(startDate) => onFiltersChange({ ...filters, startDate })}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View className="flex-1">
          <Input
            label="End Date"
            value={filters.endDate}
            onChangeText={(endDate) => onFiltersChange({ ...filters, endDate })}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
    </View>
  );
}

export const VehicleTimelineFilters = memo(VehicleTimelineFiltersComponent);
