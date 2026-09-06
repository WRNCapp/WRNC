import React from 'react';
import { Text, View } from 'react-native';
import { passportLayout } from './passportLayout';
import type { BuildPassportStatistics as BuildPassportStatisticsType } from '../../types/buildPassport';

interface BuildPassportStatisticsProps {
  statistics: BuildPassportStatisticsType;
}

export function BuildPassportStatistics({ statistics }: BuildPassportStatisticsProps) {
  return (
    <View className="rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
      <Text className="text-lg font-semibold text-wrnc-text-primary">Build Statistics</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">High-level counts derived from the vehicle history.</Text>

      <View testID="build-stat-grid" style={passportLayout.metricGrid}>
        <Stat label="WRNC Build Score" value={`${statistics.documentationScore}/100`} />
        <Stat label="Activities" value={statistics.totalActivities} />
        <Stat label="Documents" value={statistics.totalDocuments} />
        <Stat label="Photos" value={statistics.totalPhotos} />
        <Stat label="Maintenance" value={statistics.maintenanceActivities} />
        <Stat label="Archived Records" value={statistics.archivedActivities + statistics.archivedDocuments} />
      </View>

      <View style={passportLayout.stack}>
        <Breakdown title="Activity Types" items={statistics.activityTypeBreakdown} />
        <Breakdown title="Document Types" items={statistics.documentTypeBreakdown} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View testID="build-stat" className="rounded-xl border border-wrnc-border bg-wrnc-background px-3 py-2" style={passportLayout.metric}>
      <Text className="text-xs uppercase tracking-wide text-wrnc-text-secondary">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-wrnc-text-primary">{value}</Text>
    </View>
  );
}

function Breakdown({
  title,
  items,
}: {
  title: string;
  items: BuildPassportStatisticsType['activityTypeBreakdown'];
}) {
  return (
    <View className="rounded-xl border border-wrnc-border bg-wrnc-background p-4">
      <Text className="text-sm font-semibold text-wrnc-text-primary">{title}</Text>
      <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {items.length === 0 ? (
          <Text className="text-sm text-wrnc-text-secondary">No records.</Text>
        ) : (
          items.map((item) => (
            <View key={`${title}-${item.label}`} className="rounded-full bg-wrnc-surface px-3 py-1">
              <Text className="text-xs font-medium text-wrnc-text-secondary">
                {item.label} {item.count}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
