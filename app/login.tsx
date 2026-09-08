import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WrncLogo } from '../components/marketing/WrncLogo';
import { KeyboardSafeScrollView } from '../components/common/KeyboardSafeScrollView';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

/** Universal WRNC sign-in route for returning members. */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      setError('Sign in is not configured yet. Add the WRNC Supabase environment variables to enable it.');
      return;
    }

    if (!normalizedEmail || !password) {
      setError('Enter your email address and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    if (!data.session) {
      setError('Your sign-in session could not be started. Please try again.');
      return;
    }

    router.replace('/workspace');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardSafeScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Pressable accessibilityLabel="WRNC home" accessibilityRole="button" onPress={() => router.replace('/')} style={styles.wordmark}>
            <WrncLogo />
          </Pressable>

          <View style={styles.card}>
            <Text style={styles.eyebrow}>WELCOME BACK</Text>
            <Text style={styles.title}>CONTINUE YOUR BUILD RECORD.</Text>
            <Text style={styles.intro}>Sign in to return to the work, history, and story behind your build.</Text>

            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              placeholder="you@example.com"
              placeholderTextColor="#777777"
              returnKeyType="next"
              style={styles.input}
              value={email}
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              accessibilityLabel="Password"
              autoComplete="current-password"
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              placeholder="Your password"
              placeholderTextColor="#777777"
              ref={passwordInputRef}
              returnKeyType="go"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleLogin}
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
            >
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>SIGN IN</Text>}
            </Pressable>

            <Pressable accessibilityRole="button" onPress={() => router.replace('/signup')} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>NEW TO WRNC? CREATE AN ACCOUNT</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  container: { alignSelf: 'center', maxWidth: 560, paddingHorizontal: 24, paddingVertical: 48, width: '100%' },
  wordmark: { alignSelf: 'flex-start', justifyContent: 'center', marginBottom: 72, minHeight: 44 },
  card: { backgroundColor: '#1A1D22', borderColor: '#34373D', borderRadius: 8, borderWidth: 1, padding: 32 },
  eyebrow: { color: '#FF6400', fontSize: 14, fontWeight: '600', lineHeight: 17 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '600', lineHeight: 40, marginTop: 16 },
  intro: { color: '#C0C0C0', fontSize: 17, fontWeight: '500', lineHeight: 24, marginBottom: 32, marginTop: 16 },
  label: { color: '#C0C0C0', fontSize: 13, fontWeight: '600', lineHeight: 16, marginBottom: 8, marginTop: 18 },
  input: { backgroundColor: '#080808', borderColor: '#4C5057', borderRadius: 4, borderWidth: 1, color: '#FFFFFF', fontSize: 16, height: 48, paddingHorizontal: 14 },
  error: { color: '#FF8F5B', fontSize: 14, lineHeight: 20, marginTop: 20 },
  primaryButton: { alignItems: 'center', backgroundColor: '#FF6400', borderRadius: 4, height: 48, justifyContent: 'center', marginTop: 28 },
  primaryButtonDisabled: { opacity: 0.65 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', lineHeight: 17 },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', marginTop: 22, minHeight: 44 },
  secondaryButtonText: { color: '#C0C0C0', fontSize: 13, fontWeight: '600', lineHeight: 16 },
});
