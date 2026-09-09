import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { Activity } from '../../types/activity';
import {
  formatTimelineDate,
  getActivityCost,
  getActivityOdometer,
  getActivityPreviewPhotoUrl,
} from '../../utils/activityTimeline';

export interface VehicleTimelineItemProps {
  activity: Activity;
  vehicleLabel: string;
  onPress: (activityId: string) => void;
}

function VehicleTimelineItemComponent({
  activity,
  vehicleLabel,
  onPress,
}: VehicleTimelineItemProps) {
  const previewPhotoUrl = getActivityPreviewPhotoUrl(activity);
  const cost = getActivityCost(activity);
  const odometer = getActivityOdometer(activity);

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 rounded-xl border border-wrnc-border bg-wrnc-surface p-3"
      onPress={() => onPress(activity.id)}
    >
      <View className="flex-row items-start gap-3">
        {previewPhotoUrl ? (
          <Image
            source={{ uri: previewPhotoUrl }}
            className="h-16 w-16 rounded-lg bg-wrnc-surface-elevated"
            accessibilityLabel={`${activity.title} preview image`}
          />
        ) : null}

        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="rounded-full bg-wrnc-data-accent/20 px-2 py-1 text-xs font-semibold text-wrnc-data-accent">
              {activity.activityType}
            </Text>
            {activity.archivedAt ? (
              <Text className="rounded-full bg-wrnc-surface-elevated px-2 py-1 text-xs font-semibold text-wrnc-text-secondary">
                Archived
              </Text>
            ) : null}
          </View>

          <Text className="mt-2 text-lg font-semibold text-wrnc-text-primary">{activity.title}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{formatTimelineDate(activity.activityDate)}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{vehicleLabel}</Text>

          {activity.description ? (
            <Text className="mt-2 text-sm leading-5 text-wrnc-text-secondary">{activity.description}</Text>
          ) : null}

          {cost !== null || odometer !== null ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {odometer !== null ? (
                <Text className="rounded-full bg-wrnc-surface-elevated px-3 py-1 text-xs font-medium text-wrnc-text-secondary">
                  {odometer.toLocaleString()} miles
                </Text>
              ) : null}
              {cost !== null ? (
                <Text className="rounded-full bg-wrnc-surface-elevated px-3 py-1 text-xs font-medium text-wrnc-text-secondary">
                  ${cost.toFixed(2)}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export const VehicleTimelineItem = memo(VehicleTimelineItemComponent);
