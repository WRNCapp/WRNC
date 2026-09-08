import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import { passportLayout } from './passportLayout';
import type { BuildPassportTimelineSummary as BuildPassportTimelineSummaryType } from '../../types/buildPassport';

interface BuildPassportTimelineSummaryProps {
  summary: BuildPassportTimelineSummaryType;
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderLink(
  link: BuildPassportTimelineSummaryType['sourceLinks'][number],
  onNavigate: (route: string) => void,
  onBack: () => void
) {
  if (link.action === 'back') {
    return <Button label={link.label} variant="secondary" onPress={onBack} />;
  }

  if (!link.route) {
    return null;
  }

  return <Button label={link.label} variant="secondary" onPress={() => onNavigate(link.route as string)} />;
}

export function BuildPassportTimelineSummary({ summary, onNavigate, onBack }: BuildPassportTimelineSummaryProps) {
  return (
    <View className="rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
      <Text className="text-lg font-semibold text-wrnc-text-primary">Timeline Summary</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">Recent activity history and timeline depth.</Text>

      <View testID="timeline-stat-grid" style={passportLayout.metricGrid}>
        <Stat label="Activities" value={summary.totalActivities} />
        <Stat label="Active" value={summary.activeActivities} />
        <Stat label="Archived" value={summary.archivedActivities} />
      </View>

      {summary.latestActivity ? (
        <View className="mt-4 rounded-xl bg-wrnc-background px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">Latest Activity</Text>
          <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">{summary.latestActivity.title}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{summary.latestActivity.activityDate}</Text>
        </View>
      ) : null}

      <View style={passportLayout.links}>
        {summary.sourceLinks.map((link) => (
          <View key={link.label} style={passportLayout.link}>
            {renderLink(link, onNavigate, onBack)}
          </View>
        ))}
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View testID="timeline-stat" className="rounded-xl border border-wrnc-border bg-wrnc-background px-3 py-2" style={passportLayout.metric}>
      <Text className="text-xs uppercase tracking-wide text-wrnc-text-secondary">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-wrnc-text-primary">{value}</Text>
    </View>
  );
}
