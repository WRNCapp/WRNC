import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Button } from '../common/Button';

type AccountMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export function AccountMenu({ visible, onClose }: AccountMenuProps) {
  const router = useRouter();
  const [confirmingDeletion, setConfirmingDeletion] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isDeleting) return;
    setConfirmingDeletion(false);
    setError(null);
    onClose();
  };

  const signOut = async () => {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError('Unable to sign out. Please try again.');
      return;
    }
    close();
    router.replace('/login');
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    const { error: deletionError } = await supabase.functions.invoke('delete-account', { method: 'POST' });
    if (deletionError) {
      setIsDeleting(false);
      setError('Unable to delete your account. Contact support@wrnc.app if this continues.');
      return;
    }
    await supabase.auth.signOut();
    setIsDeleting(false);
    onClose();
    router.replace('/');
  };

  return (
    <Modal animationType="fade" onRequestClose={close} transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/80 p-5">
        <View className="w-full max-w-lg rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text accessibilityRole="header" className="text-xl font-bold text-wrnc-text-primary">Account</Text>
              <Text className="mt-2 text-sm leading-5 text-wrnc-text-secondary">
                {confirmingDeletion
                  ? 'This permanently deletes your account, vehicles, activities, photos, and documents. This cannot be undone.'
                  : 'Manage your WRNC session and account data.'}
              </Text>
            </View>
            <Pressable accessibilityLabel="Close account menu" accessibilityRole="button" className="min-h-11 min-w-11 items-center justify-center" onPress={close}>
              <Text className="text-2xl text-wrnc-text-secondary">×</Text>
            </Pressable>
          </View>
          {error ? <Text accessibilityRole="alert" className="mt-4 text-sm text-semantic-error">{error}</Text> : null}
          <View className="mt-5 gap-3">
            {confirmingDeletion ? (
              <>
                <Button label="Permanently Delete Account" variant="danger" loading={isDeleting} onPress={deleteAccount} />
                <Button label="Cancel" variant="secondary" disabled={isDeleting} onPress={() => setConfirmingDeletion(false)} />
              </>
            ) : (
              <>
                <Button label="Sign Out" variant="secondary" onPress={signOut} />
                <Button label="Delete Account" variant="danger" onPress={() => setConfirmingDeletion(true)} />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
