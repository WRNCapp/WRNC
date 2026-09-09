import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import { passportLayout } from './passportLayout';
import type { BuildPassportVehicleSummary as BuildPassportVehicleSummaryType } from '../../types/buildPassport';

interface BuildPassportVehicleSummaryProps {
  summary: BuildPassportVehicleSummaryType;
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderLink(
  link: BuildPassportVehicleSummaryType['sourceLinks'][number],
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

export function BuildPassportVehicleSummary({ summary, onNavigate }: BuildPassportVehicleSummaryProps) {
  return (
    <View>
      <Text className="text-lg font-semibold text-wrnc-text-primary">Vehicle Information</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">Identity and specifications saved to this build.</Text>

      <View style={passportLayout.compactStack}>
        {summary.details.map((detail) => (
          <View key={detail.label} style={passportLayout.detail} className="rounded-xl bg-wrnc-background px-3 py-2">
            <Text style={passportLayout.detailLabel} className="text-sm text-wrnc-text-secondary">{detail.label}</Text>
            <Text style={passportLayout.detailValue} className="text-sm font-medium text-wrnc-text-primary">{detail.value}</Text>
          </View>
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
