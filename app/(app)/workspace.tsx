import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

/** Protected WRNC product workspace for authenticated members. */
export default function WorkspaceScreen() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      router.replace('/login');
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error || !data.session) {
        router.replace('/login');
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loading}>
          <ActivityIndicator color="#FF6400" />
          <Text style={styles.loadingLabel}>Loading your workspace…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <VehicleWorkspaceShell />;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingLabel: { color: '#C0C0C0', marginTop: 12 },
});
