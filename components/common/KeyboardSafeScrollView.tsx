import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

export function KeyboardSafeScrollView({
  contentContainerStyle,
  children,
  ...props
}: ScrollViewProps) {
  return (
    <KeyboardAvoidingView
      testID="keyboard-safe-container"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        {...props}
        style={[{ flex: 1 }, props.style]}
        contentContainerStyle={[{ paddingBottom: 160 }, contentContainerStyle]}
        automaticallyAdjustKeyboardInsets={Platform.OS !== 'ios'}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
