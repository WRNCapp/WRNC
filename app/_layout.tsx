import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

export const MINIMUM_SPLASH_DURATION_MS = 2000;

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [minimumHoldComplete, setMinimumHoldComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumHoldComplete(true), MINIMUM_SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!minimumHoldComplete) return;
    void SplashScreen.hideAsync();
  }, [minimumHoldComplete]);

  return (
    <View testID="wrnc-root-background" style={{ flex: 1, backgroundColor: '#080808' }}>
      <Slot />
    </View>
  );
}
