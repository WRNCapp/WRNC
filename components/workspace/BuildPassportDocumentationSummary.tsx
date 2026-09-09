import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import { passportLayout } from './passportLayout';
import { DocumentationCategoryProgress } from './DocumentationCategoryProgress';
import type { BuildPassportDocumentationSummary as BuildPassportDocumentationSummaryType } from '../../types/buildPassport';

interface BuildPassportDocumentationSummaryProps {
  summary: BuildPassportDocumentationSummaryType;
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderLink(
  link: BuildPassportDocumentationSummaryType['sourceLinks'][number],
  onNavigate: (route: string) => void
) {
  if (link.action === 'back') {
    return null;
  }

  if (!link.route) {
    return null;
  }

  return <Button label={link.label} variant="secondary" compact onPress={() => onNavigate(link.route as string)} />;
}

export function BuildPassportDocumentationSummary({ summary, onNavigate }: BuildPassportDocumentationSummaryProps) {
  return (
    <View>
      <Text className="text-lg font-semibold text-wrnc-text-primary">Documentation</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">What is recorded and where the build history can improve.</Text>

      <View testID="documentation-stat-grid" style={passportLayout.metricGrid}>
        <Stat label="Score" value={`${summary.overallScore}/100`} />
        <Stat label="Documents" value={summary.totalDocuments} />
        <Stat label="Photos" value={summary.photoDocuments} />
        <Stat label="Archived" value={summary.archivedDocuments} />
      </View>

      {summary.latestDocument ? (
        <View className="mt-4 rounded-xl bg-wrnc-background px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">Latest Document</Text>
          <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">{summary.latestDocument.title}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{summary.latestDocument.documentType}</Text>
        </View>
      ) : null}

      <View style={passportLayout.compactStack}>
        {summary.categories.map((category) => (
          <DocumentationCategoryProgress key={category.key} category={category} />
        ))}
      </View>

      <View style={passportLayout.links}>
        {summary.sourceLinks.map((link) => (
          <View key={link.label} style={passportLayout.link}>
            {renderLink(link, onNavigate)}
          </View>
        ))}
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View testID="documentation-stat" className="rounded-xl border border-wrnc-border bg-wrnc-background px-3 py-2" style={passportLayout.metric}>
      <Text className="text-xs uppercase tracking-wide text-wrnc-text-secondary">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-wrnc-text-primary">{value}</Text>
    </View>
  );
}
