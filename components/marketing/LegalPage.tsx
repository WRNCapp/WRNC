import React from 'react';
import Head from 'expo-router/head';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WrncLogo } from './WrncLogo';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalPage({ title, description, updated, sections }: LegalPageProps) {
  return (
    <>
      <Head>
        <title>{title} | WRNC</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#080808" />
      </Head>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.content}>
          <Pressable accessibilityLabel="WRNC home" accessibilityRole="link" onPress={() => Linking.openURL('https://wrnc.app')}>
            <WrncLogo style={styles.logo} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.updated}>Last updated: {updated}</Text>
          <Text style={styles.intro}>{description}</Text>
          {sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text accessibilityRole="header" style={styles.heading}>{section.heading}</Text>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} style={styles.body}>{paragraph}</Text>
              ))}
            </View>
          ))}
          <View style={styles.contact}>
            <Text style={styles.body}>Questions? </Text>
            <Pressable accessibilityRole="link" onPress={() => Linking.openURL('mailto:support@wrnc.app')}>
              <Text style={styles.link}>support@wrnc.app</Text>
            </Pressable>
          </View>
          <Text style={styles.copyright}>© 2026 Swear Like A Sailor, LLC. WRNC is a trademark of Swear Like A Sailor, LLC.</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#080808', minHeight: '100%', paddingHorizontal: 24, paddingVertical: 48 },
  content: { alignSelf: 'center', maxWidth: 820, width: '100%' },
  logo: { height: 42, marginBottom: 48, width: 190 },
  title: { color: '#FFFFFF', fontSize: 42, fontWeight: '800', lineHeight: 48 },
  updated: { color: '#8E8E93', fontSize: 13, marginTop: 12 },
  intro: { color: '#D6D6D6', fontSize: 18, lineHeight: 28, marginTop: 28 },
  section: { borderTopColor: '#2B2B2D', borderTopWidth: 1, marginTop: 34, paddingTop: 28 },
  heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { color: '#C0C0C0', fontSize: 16, lineHeight: 25, marginTop: 10 },
  contact: { alignItems: 'baseline', flexDirection: 'row', flexWrap: 'wrap', marginTop: 36 },
  link: { color: '#FF6400', fontSize: 16, fontWeight: '700', lineHeight: 25, marginTop: 10 },
  copyright: { color: '#77777C', fontSize: 12, lineHeight: 18, marginTop: 48 },
});
