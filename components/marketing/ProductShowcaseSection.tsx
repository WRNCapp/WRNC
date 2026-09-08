import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WrncLogo } from './WrncLogo';

export function ProductShowcaseSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <View style={[styles.section, isMobile && styles.sectionMobile]}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View style={[styles.visual, isMobile && styles.visualMobile]}>
          <View style={styles.previewHeader}>
            <WrncLogo />
            <Text style={styles.caption}>Timeline · Sample data</Text>
          </View>
          <View style={styles.captureFrame}>
            <Image
            accessibilityLabel="WRNC Timeline product capture with sample activity data"
            resizeMode="contain"
            source={require('../../assets/marketing/wrnc-timeline-product-capture.png')}
            style={styles.image}
            />
          </View>
        </View>
        <View style={styles.copy}>
          <Text style={[styles.heading, isMobile && styles.headingMobile]}>Built for builders, not algorithms.</Text>
          <Text style={styles.body}>WRNC is not social media. It’s your personal build database.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#080808', paddingHorizontal: 48, paddingVertical: 72 },
  sectionMobile: { paddingHorizontal: 20, paddingVertical: 48 },
  content: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 48, maxWidth: 1344, width: '100%' },
  contentMobile: { alignItems: 'stretch', flexDirection: 'column', gap: 30 },
  visual: { flex: 1.25, minWidth: 0, borderColor: '#2A2A2A', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  visualMobile: { flexBasis: 'auto', flexGrow: 0, flexShrink: 0 },
  previewHeader: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', padding: 16 },
  caption: { color: '#C0C0C0', fontSize: 12 },
  captureFrame: { aspectRatio: 1280 / 900, width: '100%' },
  image: { height: '100%', width: '100%' },
  copy: { flex: 0.75, maxWidth: 430, minWidth: 0 },
  heading: { color: '#FFFFFF', fontSize: 42, fontWeight: '700', letterSpacing: -0.8, lineHeight: 47 },
  headingMobile: { fontSize: 32, lineHeight: 37 },
  body: { color: '#C0C0C0', fontSize: 17, lineHeight: 26, marginTop: 18 },
});
