import React from 'react';
import { Platform, ScrollView, Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { KeyboardSafeScrollView } from '../../components/common/KeyboardSafeScrollView';

describe('KeyboardSafeScrollView', () => {
  it('keeps forms scrollable with consistent keyboard behavior', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <KeyboardSafeScrollView contentContainerStyle={{ padding: 16 }}>
        <Text>Form</Text>
      </KeyboardSafeScrollView>
    );

    expect(getByTestId('keyboard-safe-container')).toBeTruthy();

    const scroll = UNSAFE_getByType(ScrollView);
    expect(scroll.props.automaticallyAdjustKeyboardInsets).toBe(Platform.OS !== 'ios');
    expect(scroll.props.keyboardDismissMode).toBe('interactive');
    expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
    expect(scroll.props.contentContainerStyle).toEqual([
      { paddingBottom: 160 },
      { padding: 16 },
    ]);
  });
});
