import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { FinalCtaSection } from '../components/marketing/FinalCtaSection';
import { MarketingFooter } from '../components/marketing/MarketingFooter';
import { MarketingHeader } from '../components/marketing/MarketingHeader';
import { HomeHero } from '../components/marketing/HomeHero';
import { ProductShowcaseSection } from '../components/marketing/ProductShowcaseSection';
import { WhyWrncSection } from '../components/marketing/WhyWrncSection';

export default function WebsiteHomeScreen() {
  const router = useRouter();
  const openSignup = () => router.push('/signup');
  const openLogin = () => router.push('/login');
  const openFounding23 = () => router.push('/founding23');
  const openAbout = () => router.push('/about');
  const openPrivacy = () => router.push('/privacy');
  const openTerms = () => router.push('/terms');

  return (
    <>
      <Head>
        <title>WRNC — Every build deserves a living record.</title>
        <meta name="description" content="WRNC is the operating system for automotive builders. Organize, document, and preserve your vehicle’s journey." />
        <meta name="theme-color" content="#080808" />
        <link rel="canonical" href="https://wrnc.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="WRNC" />
        <meta property="og:title" content="WRNC — Every build deserves a living record." />
        <meta property="og:description" content="The operating system for automotive builders." />
        <meta property="og:url" content="https://wrnc.app/" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <ScrollView contentContainerStyle={styles.content} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <MarketingHeader onFounding23={openFounding23} onJoin={openSignup} onSignIn={openLogin} />
        <HomeHero onGetStarted={openSignup} onSignIn={openLogin} />
        <WhyWrncSection />
        <ProductShowcaseSection />
        <FinalCtaSection onFounding23={openFounding23} onJoin={openSignup} />
        <MarketingFooter
          onAbout={openAbout}
          onFounding23={openFounding23}
          onPrivacy={openPrivacy}
          onSignIn={openLogin}
          onTerms={openTerms}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({ content: { backgroundColor: '#080808', width: '100%' } });
