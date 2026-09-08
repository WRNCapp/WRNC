import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WrncLogo } from '../../components/marketing/WrncLogo';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

type CallbackState = 'loading' | 'confirmed' | 'unavailable';

/**
 * Receives Supabase email-confirmation redirects on web and keeps the newly
 * confirmed session available to the rest of the WRNC application.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();
  const [state, setState] = useState<CallbackState>('loading');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState('unavailable');
      return;
    }

    let isMounted = true;

    const markConfirmed = () => {
      if (isMounted) {
        setState('confirmed');
      }
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        markConfirmed();
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        markConfirmed();
      }
    });

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setState((currentState) => currentState === 'loading' ? 'unavailable' : currentState);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      listener.subscription.unsubscribe();
    };
  }, []);

  const heading = state === 'confirmed' ? 'EMAIL CONFIRMED.' : 'CONFIRMING YOUR EMAIL.';
  const detail = state === 'confirmed'
    ? 'Your WRNC account is confirmed and ready for its first Build Passport™.'
    : state === 'unavailable'
      ? 'This confirmation link could not finish locally. Sign in to WRNC, or request a new confirmation email.'
      : 'Securing your WRNC account and preparing your build record.';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Pressable accessibilityLabel="WRNC home" accessibilityRole="button" onPress={() => router.replace('/')} style={styles.wordmark}>
          <WrncLogo />
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>BUILD RECORD READY</Text>
          <Text style={styles.title}>{heading}</Text>
          <Text style={styles.detail}>{detail}</Text>

          {state === 'loading' ? (
            <ActivityIndicator accessibilityLabel="Confirming email" color="#FF6400" style={styles.loader} />
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace(state === 'confirmed' ? '/workspace' : '/login')}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>{state === 'confirmed' ? 'CONTINUE TO WRNC' : 'SIGN IN TO WRNC'}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  container: { alignSelf: 'center', maxWidth: 560, paddingHorizontal: 24, paddingVertical: 48, width: '100%' },
  wordmark: { alignSelf: 'flex-start', justifyContent: 'center', marginBottom: 72, minHeight: 44 },
  card: { backgroundColor: '#1A1D22', borderColor: '#34373D', borderRadius: 8, borderWidth: 1, padding: 32 },
  eyebrow: { color: '#FF6400', fontSize: 14, fontWeight: '600', lineHeight: 17 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '600', lineHeight: 40, marginTop: 16 },
  detail: { color: '#C0C0C0', fontSize: 17, fontWeight: '500', lineHeight: 24, marginTop: 16 },
  loader: { alignSelf: 'flex-start', marginTop: 32 },
  primaryButton: { alignItems: 'center', backgroundColor: '#FF6400', borderRadius: 4, height: 48, justifyContent: 'center', marginTop: 32 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', lineHeight: 17 },
});
