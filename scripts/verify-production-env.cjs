'use strict';

// EAS runs this after dependencies are installed, before native compilation.
// This is deliberately a presence/shape check, never a credential logger.
if (process.env.EAS_BUILD_PROFILE !== 'production') {
  console.log('WRNC production configuration check skipped for non-production profile.');
  process.exit(0);
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const errors = [];

if (!url) {
  errors.push('EXPO_PUBLIC_SUPABASE_URL is missing from the selected EAS environment.');
} else {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) {
      errors.push('EXPO_PUBLIC_SUPABASE_URL must be a production HTTPS Supabase project URL.');
    }
  } catch {
    errors.push('EXPO_PUBLIC_SUPABASE_URL is not a valid URL.');
  }
}

if (!key || key === 'placeholder-anon-key' || key.trim().length < 20) {
  errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing or invalid in the selected EAS environment.');
}

if (errors.length) {
  console.error('WRNC production EAS configuration FAILED:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('WRNC production EAS configuration PASS: required client configuration is present (values withheld).');
