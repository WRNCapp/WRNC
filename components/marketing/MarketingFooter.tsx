import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WrncLogo } from './WrncLogo';

const productLinks = ['About', 'Founding Builders', 'Sign In'];
const legalLinks = [
  { label: 'Privacy', url: 'https://wrnc.app/privacy' },
  { label: 'Terms', url: 'https://wrnc.app/terms' },
  { label: 'Contact', url: 'mailto:contact@wrnc.app' },
  { label: 'Support', url: 'https://wrnc.app/support' },
];
const socialLinks = [
  { label: 'Instagram', icon: 'instagram', iconStyle: 'brand', url: 'https://www.instagram.com/wrnc.app/' },
  { label: 'Facebook', icon: 'facebook', iconStyle: 'brand', url: 'https://www.facebook.com/WRNCapp/' },
  { label: 'YouTube', icon: 'youtube', iconStyle: 'brand', url: 'https://www.youtube.com/@WRNC_app' },
  { label: 'Discord', icon: 'discord', iconStyle: 'brand', url: 'https://discord.gg/YfbcetDD' },
  { label: 'TikTok', icon: 'tiktok', iconStyle: 'brand', url: 'https://www.tiktok.com/@wrnc.app' },
  { label: 'Reddit profile', icon: 'reddit', iconStyle: 'brand', url: 'https://www.reddit.com/user/WRNC_app/' },
] as const;

type MarketingFooterProps = { onFounding23?: () => void; onSignIn?: () => void };

export function MarketingFooter({ onFounding23, onSignIn }: MarketingFooterProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isCompact = width < 1100;
  return (
    <View style={[styles.footer, isCompact && styles.footerCompact, isMobile && styles.footerMobile]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <View style={styles.brand}>
          <WrncLogo />
          <Text style={styles.tagline}>Built for Builders.</Text>
          <View accessibilityLabel="WRNC social media" style={styles.socials}>
            {socialLinks.map(({ label, icon, iconStyle, url }) => (
              <Pressable
                accessibilityLabel={label}
                accessibilityRole="link"
                key={label}
                onPress={() => Linking.openURL(url)}
                style={styles.socialLink}
              >
                <FontAwesome6 color="#C0C0C0" iconStyle={iconStyle} name={icon} size={20} />
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.links}>{productLinks.map((item) => item === 'Sign In' ? (
          <Pressable accessibilityRole="button" key={item} onPress={onSignIn} style={styles.linkPressable}><Text style={styles.link}>{item}</Text></Pressable>
        ) : item === 'Founding Builders' ? (
          <Pressable accessibilityRole="link" key={item} onPress={onFounding23} style={styles.linkPressable}><Text style={styles.link}>{item}</Text></Pressable>
        ) : <Text key={item} style={styles.link}>{item}</Text>)}</View>
        <View style={styles.links}>{legalLinks.map((item) => (
          <Pressable accessibilityRole="link" key={item.label} onPress={() => Linking.openURL(item.url)} style={styles.linkPressable}>
            <Text style={styles.link}>{item.label}</Text>
          </Pressable>
        ))}</View>
        <View style={styles.legal}>
          <Text style={styles.legalText}>© 2026 WRNC.</Text>
          <Text style={styles.legalText}>A Swear Like A Sailor, LLC company.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: '#080808', paddingHorizontal: 48, paddingVertical: 44 },
  footerCompact: { paddingHorizontal: 32 },
  footerMobile: { paddingHorizontal: 20, paddingVertical: 40 },
  content: { alignItems: 'flex-start', alignSelf: 'center', flexDirection: 'row', gap: 64, justifyContent: 'space-between', maxWidth: 1344, width: '100%' },
  contentCompact: { flexDirection: 'column', gap: 28 },
  brand: { gap: 10 },
  tagline: { color: '#C0C0C0', fontSize: 12 },
  socials: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  socialLink: { alignItems: 'center', borderColor: '#34373D', borderRadius: 18, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  links: { gap: 11 },
  link: { color: '#C0C0C0', fontSize: 13 },
  linkPressable: { justifyContent: 'center', minHeight: 44 },
  legal: { gap: 5 },
  legalText: { color: '#C0C0C0', fontSize: 12 },
});
