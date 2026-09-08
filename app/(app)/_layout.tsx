import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const queryClient = new QueryClient();
type SessionStatus = 'checking' | 'authenticated' | 'unauthenticated';

export default function AppLayout() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    isSupabaseConfigured ? 'checking' : 'unauthenticated'
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error || !data.session) {
        setSessionStatus('unauthenticated');
        return;
      }

      setSessionStatus('authenticated');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        setSessionStatus('unauthenticated');
        return;
      }

      setSessionStatus('authenticated');
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {sessionStatus === 'unauthenticated' ? (
        <Redirect href="/login" />
      ) : sessionStatus === 'checking' ? (
        <SafeAreaView style={styles.screen}>
          <View style={styles.loading}>
            <ActivityIndicator color="#FF6400" />
            <Text style={styles.loadingLabel}>Loading your workspace…</Text>
          </View>
        </SafeAreaView>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingLabel: { color: '#C0C0C0', marginTop: 12 },
});
