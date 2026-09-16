import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { WrncLogo } from './WrncLogo';

type Section = { heading: string; paragraphs: string[] };

type LegalPageProps = {
  title: string;
  description: string;
  canonicalPath: string;
  updated: string;
  sections: Section[];
};

export function LegalPage({ title, description, canonicalPath, updated, sections }: LegalPageProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title} | WRNC</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#080808" />
        <link rel="canonical" href={`https://wrnc.app${canonicalPath}`} />
      </Head>
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable accessibilityRole="link" onPress={() => router.push('/')}><WrncLogo /></Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/')}><Text style={styles.back}>Back to WRNC</Text></Pressable>
        </View>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>WRNC · A Swear Like A Sailor, LLC company</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.updated}>Effective / last updated: {updated}</Text>
        </View>
        <View style={styles.body}>
          {sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text style={styles.heading}>{section.heading}</Text>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>{paragraph}</Text>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 WRNC. A Swear Like A Sailor, LLC company.</Text>
          <Text style={styles.footerText}>support@wrnc.app</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#080808', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 980, paddingHorizontal: 24, paddingBottom: 64, width: '100%' },
  header: { alignItems: 'center', borderBottomColor: '#30343A', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 24 },
  back: { color: '#C0C0C0', fontSize: 13 },
  hero: { gap: 14, paddingBottom: 44, paddingTop: 64 },
  eyebrow: { color: '#7C3AED', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: '#FFFFFF', fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  description: { color: '#C0C0C0', fontSize: 18, lineHeight: 28, maxWidth: 760 },
  updated: { color: '#8F949C', fontSize: 12 },
  body: { borderTopColor: '#30343A', borderTopWidth: 1 },
  section: { borderBottomColor: '#30343A', borderBottomWidth: 1, gap: 12, paddingVertical: 28 },
  heading: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  paragraph: { color: '#C0C0C0', fontSize: 15, lineHeight: 24 },
  footer: { gap: 6, paddingTop: 36 },
  footerText: { color: '#8F949C', fontSize: 12 },
});
