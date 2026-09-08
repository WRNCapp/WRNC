import React from 'react';
import { act, render } from '@testing-library/react-native';

const mockSlot = jest.fn(() => null);

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-router', () => ({ Slot: () => mockSlot() }));

// Mocks must be registered before the module-level splash call runs.
// eslint-disable-next-line import/first
import RootLayout, { MINIMUM_SPLASH_DURATION_MS } from '../../app/_layout';
// eslint-disable-next-line import/first
import * as SplashScreen from 'expo-splash-screen';

const mockPreventAutoHide = SplashScreen.preventAutoHideAsync as jest.Mock;
const mockHide = SplashScreen.hideAsync as jest.Mock;

describe('RootLayout splash hold', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockHide.mockClear();
    mockSlot.mockClear();
  });

  afterEach(() => jest.useRealTimers());

  it('keeps the native splash visible for at least two seconds', () => {
    const screen = render(<RootLayout />);
    expect(MINIMUM_SPLASH_DURATION_MS).toBe(2000);
    expect(mockPreventAutoHide).toHaveBeenCalled();
    expect(mockSlot).toHaveBeenCalledTimes(1);
    expect(mockHide).not.toHaveBeenCalled();
    expect(screen.getByTestId('wrnc-root-background').props.style).toEqual({
      flex: 1,
      backgroundColor: '#080808',
    });

    act(() => jest.advanceTimersByTime(1999));
    expect(mockSlot).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(1));
    expect(mockSlot).toHaveBeenCalledTimes(2);
    expect(mockHide).toHaveBeenCalledTimes(1);
  });
});
