import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WrncLogo } from '../components/marketing/WrncLogo';
import { KeyboardSafeScrollView } from '../components/common/KeyboardSafeScrollView';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

/** Universal WRNC account creation route used by the homepage CTAs. */
export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSignup = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured) {
      setError('Account creation is not configured yet. Add the WRNC Supabase environment variables to enable signup.');
      return;
    }

    if (!normalizedEmail || !password) {
      setError('Enter your email address and password.');
      return;
    }

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const emailRedirectTo =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error: signupError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });

    setIsSubmitting(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setIsComplete(true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardSafeScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Pressable accessibilityLabel="WRNC home" accessibilityRole="button" onPress={() => router.replace('/')} style={styles.wordmark}>
            <WrncLogo />
          </Pressable>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>JOIN THE GARAGE</Text>
          <Text style={styles.title}>START YOUR BUILD RECORD.</Text>
          <Text style={styles.intro}>
            Create your WRNC account to begin documenting the work, history, and story behind your build.
          </Text>

          {isComplete ? (
            <View style={styles.successBox}>
              <Text style={styles.successTitle}>CHECK YOUR EMAIL</Text>
              <Text style={styles.successText}>
                Your WRNC account is ready to confirm. Follow the email from WRNC to finish signing up.
              </Text>
              <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>BACK TO WRNC</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#777777"
                style={styles.input}
                value={email}
              />

              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                accessibilityLabel="Password"
                autoComplete="new-password"
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#777777"
                secureTextEntry
                style={styles.input}
                value={password}
              />

              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput
                accessibilityLabel="Confirm password"
                autoComplete="new-password"
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor="#777777"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
              />

              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={handleSignup}
                style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              >
                {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>CREATE ACCOUNT</Text>}
              </Pressable>

              <Pressable accessibilityRole="button" onPress={() => router.replace('/login')} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>ALREADY A MEMBER? SIGN IN</Text>
              </Pressable>
            </>
          )}
          </View>
        </View>
      </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  scrollContent: { flexGrow: 1 },
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
  successBox: { backgroundColor: '#111318', borderColor: '#42464E', borderRadius: 4, borderWidth: 1, padding: 20 },
  successTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', lineHeight: 20 },
  successText: { color: '#C0C0C0', fontSize: 16, lineHeight: 23, marginTop: 8 },
});
