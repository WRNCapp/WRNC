import React, { useEffect, useState } from 'react';
import { Share, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '../common/Button';
import { getActiveShare, passportShareUrl, publishShare, revokeShare } from '../../services/passportSharing';
import type { Activity } from '../../types/activity';

interface Props { vehicleId: string; activities: Activity[] }

export function PassportSharing({ vehicleId, activities }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const installed = activities.filter((a) => a.activityType === 'Installed Part' && !a.archivedAt);

  useEffect(() => {
    let mounted = true;
    getActiveShare(vehicleId).then((result) => {
      if (mounted) {
        setToken(result?.token ?? null);
        setSelected(result?.selectedActivityIds ?? []);
      }
    })
      .catch(() => { if (mounted) setError('Could not load sharing status.'); });
    return () => { mounted = false; };
  }, [vehicleId]);

  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try { await task(); } catch { setError('Sharing could not be updated. Try again.'); }
    finally { setBusy(false); }
  }

  return (
    <View className="mb-2 rounded-xl border border-wrnc-border bg-wrnc-surface p-3">
      <Text className="text-lg font-semibold text-wrnc-text-primary">Share this build</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">
        A public link shows the year, make, model and only the installed parts you select. VIN, mileage, photos, documents and private notes stay in your Passport.
      </Text>
      {installed.slice(0, 30).map((item) => {
        const checked = selected.includes(item.id);
        return <View key={item.id} className="mt-2">
          <Button label={`${checked ? '☑' : '☐'} ${item.title}`} variant="secondary" compact
            onPress={() => setSelected((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])} />
        </View>;
      })}
      {installed.length > 30 ? <Text className="mt-2 text-sm text-wrnc-text-secondary">Showing the first 30 installed parts.</Text> : null}
      <View className="mt-3">
        <Button label={token ? 'Update public build' : 'Create public build'} disabled={busy}
          onPress={() => run(async () => setToken(await publishShare(vehicleId, selected)))} />
      </View>
      {token ? <View className="mt-4 items-center">
        <View style={{ padding: 12, backgroundColor: '#FFFFFF' }}>
          <QRCode value={passportShareUrl(token)} size={188} ecl="M" />
        </View>
        <Text selectable className="mt-2 text-center text-sm text-wrnc-text-primary">{passportShareUrl(token)}</Text>
        <View className="mt-3 w-full">
          <Button label="Share link" disabled={busy} onPress={() => Share.share({ message: passportShareUrl(token), url: passportShareUrl(token) })} />
        </View>
        <View className="mt-2 w-full">
          <Button label="Turn off sharing" variant="secondary" disabled={busy}
            onPress={() => run(async () => { await revokeShare(vehicleId); setToken(null); })} />
        </View>
      </View> : null}
      {error ? <Text accessibilityRole="alert" className="mt-2 text-sm text-red-400">{error}</Text> : null}
    </View>
  );
}
