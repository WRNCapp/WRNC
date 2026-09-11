import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type LegalSection = {
  id: string;
  title: string;
  placeholder: string;
};

type LegalDocumentPageProps = {
  title: string;
  documentType: 'about' | 'privacy' | 'terms';
  sections: LegalSection[];
};

const LEGAL_OPERATOR = 'Swear Like A Sailor, LLC';

export function LegalDocumentPage({ title, documentType, sections }: LegalDocumentPageProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.document}>
          <Link accessibilityRole="link" href="/" style={styles.backLink}>WRNC HOME</Link>
          <Text style={styles.status}>DRAFT PLACEHOLDER. NOT APPROVED LEGAL TEXT.</Text>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.meta}>Legal operator: {LEGAL_OPERATOR}</Text>
          <Text style={styles.meta}>Effective date: [FOUNDER AND LEGAL APPROVAL REQUIRED]</Text>
          <Text style={styles.meta}>Last updated: [APPROVAL REQUIRED]</Text>
          <Text style={styles.meta}>Version: DRAFT PLACEHOLDER</Text>

          <View accessibilityLabel={`${title} table of contents`} style={styles.toc}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>TABLE OF CONTENTS</Text>
            {sections.map((section) => (
              <Link key={section.id} accessibilityRole="link" href={`/${documentType}#${section.id}`} style={styles.tocLink}>
                {section.title}
              </Link>
            ))}
          </View>

          {sections.map((section) => (
            <View key={section.id} nativeID={section.id} style={styles.section}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.placeholder}>{section.placeholder}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  scrollContent: { flexGrow: 1 },
  document: { alignSelf: 'center', maxWidth: 880, paddingHorizontal: 24, paddingVertical: 48, width: '100%' },
  backLink: { color: '#C0C0C0', fontSize: 13, fontWeight: '600', marginBottom: 40, minHeight: 44, paddingVertical: 12 },
  status: { color: '#FF8F5B', fontSize: 13, fontWeight: '700', lineHeight: 20 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '600', lineHeight: 43, marginBottom: 20, marginTop: 12 },
  meta: { color: '#C0C0C0', fontSize: 15, lineHeight: 23 },
  toc: { backgroundColor: '#111318', borderColor: '#34373D', borderRadius: 6, borderWidth: 1, gap: 8, marginTop: 36, padding: 24 },
  tocLink: { color: '#FFFFFF', fontSize: 16, lineHeight: 24, minHeight: 32, paddingVertical: 4, textDecorationLine: 'underline' },
  section: { borderTopColor: '#34373D', borderTopWidth: 1, marginTop: 36, paddingTop: 28 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '600', lineHeight: 27 },
  placeholder: { color: '#C0C0C0', fontSize: 17, lineHeight: 27, marginTop: 12 },
});
