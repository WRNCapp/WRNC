import { StyleSheet } from 'react-native';

// Explicit RN styles avoid NativeWind 2's gap emulation and undefined min-w utilities.
export const passportLayout = StyleSheet.create({
  metricGrid: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  metric: { width: '48%', minHeight: 88 },
  stack: { marginTop: 16, rowGap: 12 },
  compactStack: { marginTop: 16, rowGap: 8 },
  links: { marginTop: 16, rowGap: 12 },
  link: { width: '100%', minHeight: 44 },
  detail: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: 12 },
  detailLabel: { flexShrink: 0 },
  detailValue: { flex: 1, textAlign: 'right' },
});
