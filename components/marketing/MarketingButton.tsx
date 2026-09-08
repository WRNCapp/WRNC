import React from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

type MarketingButtonProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'orange' | 'light';
};

/** Shared action treatment for WRNC marketing sections. */
export function MarketingButton({ label, onPress, style, tone = 'orange' }: MarketingButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, tone === 'light' && styles.buttonLight, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, tone === 'light' && styles.labelLight]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FF6400',
    borderRadius: 4,
    height: 44,
    justifyContent: 'center',
    minWidth: 137,
    paddingHorizontal: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 17,
  },
  buttonLight: {
    backgroundColor: '#FFFFFF',
  },
  labelLight: {
    color: '#080808',
  },
  pressed: {
    opacity: 0.88,
  },
});
