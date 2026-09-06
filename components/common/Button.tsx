import React from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  compact?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, { bg: string; text: string }> = {
  primary: { bg: 'bg-wrnc-action-primary', text: 'text-wrnc-text-primary' },
  secondary: { bg: 'border border-wrnc-border bg-wrnc-surface-elevated', text: 'text-wrnc-text-secondary' },
  danger: { bg: 'bg-semantic-error', text: 'text-wrnc-text-primary' },
};

/** Common primary action button, shared across screens. */
export function Button({ label, variant = 'primary', loading, disabled, compact = false, ...props }: ButtonProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      className={`min-h-11 items-center justify-center rounded-lg ${compact ? 'px-3 py-2' : 'px-4 py-3'} ${styles.bg} ${
        disabled || loading ? 'opacity-50' : ''
      }`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className={`font-semibold ${styles.text}`}>{label}</Text>
      )}
    </Pressable>
  );
}
