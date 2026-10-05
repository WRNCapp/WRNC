import React, { useEffect, useState } from 'react';
import { Linking, Platform, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '../common/Button';
import { readShare, type PublicBuild as PublicBuildData } from '../../services/passportSharing';

const appStoreUrl = 'https://apps.apple.com/app/id6791770564';

export function PublicBuild() {
  const params = useLocalSearchParams<{ token?: string }>();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const [build, setBuild] = useState<PublicBuildData | null>(null);
  const [status, setStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    if (!token) { setStatus('unavailable'); return; }
    readShare(token).then((result) => {
      if (!mounted) return;
      setBuild(result);
      setStatus(result ? 'available' : 'unavailable');
    }).catch(() => { if (mounted) setStatus('unavailable'); });
    return () => { mounted = false; };
  }, [token]);

  return <ScrollView style={{ flex: 1, backgroundColor: '#080808' }} contentContainerStyle={{ padding: 24, maxWidth: 700, width: '100%', alignSelf: 'center' }}>
    <Text className="text-2xl font-bold text-wrnc-text-primary">WRNC · Build Passport</Text>
    {status === 'loading' ? <Text className="mt-8 text-wrnc-text-secondary">Loading shared build…</Text> : null}
    {status === 'unavailable' ? <Text className="mt-8 text-wrnc-text-secondary">This build link is unavailable or has been turned off.</Text> : null}
    {status === 'available' && build ? <View className="mt-8">
      <Text className="text-3xl font-bold text-wrnc-text-primary">{build.year} {build.make} {build.model}</Text>
      <Text className="mt-6 text-lg font-semibold text-wrnc-text-primary">Installed parts</Text>
      {build.installedParts.length ? build.installedParts.map((part, index) =>
        <Text key={index} className="mt-2 text-wrnc-text-secondary">• {part.title}</Text>
      ) : <Text className="mt-2 text-wrnc-text-secondary">No parts shared yet.</Text>}
    </View> : null}
    {Platform.OS === 'web' && status === 'available' ? <View className="mt-8">
      <Button label="Open in WRNC" onPress={() => Linking.openURL(`wrnc://build/${token}`)} />
    </View> : null}
    {Platform.OS === 'web' ? <View className="mt-3">
      <Button label="Get WRNC for iPhone" variant="secondary" onPress={() => Linking.openURL(appStoreUrl)} />
    </View> : null}
  </ScrollView>;
}
