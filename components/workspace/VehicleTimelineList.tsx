import React, { memo } from 'react';
import { SectionList, Text, View } from 'react-native';
import type { Activity } from '../../types/activity';
import type { TimelineSection } from '../../utils/activityTimeline';
import { VehicleTimelineGroupHeader } from './VehicleTimelineGroupHeader';
import { VehicleTimelineItem } from './VehicleTimelineItem';

export interface VehicleTimelineListProps {
  sections: TimelineSection[];
  vehicleLabel: string;
  totalCount: number;
  header?: React.ReactElement;
  onActivityPress: (activityId: string) => void;
}

function VehicleTimelineListComponent({
  sections,
  vehicleLabel,
  totalCount,
  header,
  onActivityPress,
}: VehicleTimelineListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item: Activity) => item.id}
      stickySectionHeadersEnabled={false}
      initialNumToRender={8}
      maxToRenderPerBatch={12}
      windowSize={7}
      ListHeaderComponent={
        <View>
          {header}
          <View className="mb-1 mt-4">
            <Text className="text-sm text-wrnc-text-secondary">
              {totalCount} {totalCount === 1 ? 'activity' : 'activities'}
            </Text>
          </View>
        </View>
      }
      renderSectionHeader={({ section }) => <VehicleTimelineGroupHeader title={section.title} />}
      renderItem={({ item }) => (
        <VehicleTimelineItem activity={item} vehicleLabel={vehicleLabel} onPress={onActivityPress} />
      )}
    />
  );
}

export const VehicleTimelineList = memo(VehicleTimelineListComponent);