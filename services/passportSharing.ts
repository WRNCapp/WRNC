import { supabase } from '../lib/supabase';

export interface PublicBuild {
  year: number;
  make: string;
  model: string;
  installedParts: { title: string }[];
}

export const passportShareUrl = (token: string) => `https://www.wrnc.app/build/${token}`;

export async function getActiveShare(vehicleId: string): Promise<{ token: string; selectedActivityIds: string[] } | null> {
  const { data, error } = await supabase.from('passport_shares')
    .select('token,selected_activity_ids').eq('vehicle_id', vehicleId).is('revoked_at', null).maybeSingle();
  if (error) throw error;
  return data ? { token: data.token, selectedActivityIds: data.selected_activity_ids } : null;
}

export async function publishShare(vehicleId: string, activityIds: string[]): Promise<string> {
  const { data, error } = await supabase.rpc('publish_passport_share', {
    p_vehicle_id: vehicleId,
    p_activity_ids: activityIds,
  });
  if (error) throw error;
  return data as string;
}

export async function revokeShare(vehicleId: string): Promise<void> {
  const { error } = await supabase.rpc('revoke_passport_share', { p_vehicle_id: vehicleId });
  if (error) throw error;
}

export async function readShare(token: string): Promise<PublicBuild | null> {
  if (!/^[0-9a-f]{48}$/.test(token)) return null;
  const { data, error } = await supabase.rpc('read_passport_share', { p_token: token });
  if (error) throw error;
  return data as PublicBuild | null;
}
