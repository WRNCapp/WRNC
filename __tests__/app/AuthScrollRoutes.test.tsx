import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ScrollView, StyleSheet } from 'react-native';
import LoginScreen from '../../app/login';
import SignupScreen from '../../app/signup';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: { auth: { signInWithPassword: jest.fn(), signUp: jest.fn() } },
}));

describe('authentication route scrolling', () => {
  beforeEach(() => mockReplace.mockClear());

  it('preserves a dedicated scroll container on Sign In', () => {
    const screen = render(<LoginScreen />);
    const scrollView = screen.UNSAFE_getByType(ScrollView);

    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
    expect(StyleSheet.flatten(scrollView.props.style)).toMatchObject({ flex: 1 });
    expect(StyleSheet.flatten(scrollView.props.contentContainerStyle)).toMatchObject({ flexGrow: 1, paddingBottom: 24 });
  });

  it('keeps the Signup to Sign In journey on the scrollable login route', () => {
    const signup = render(<SignupScreen />);
    fireEvent.press(signup.getByText('ALREADY A MEMBER? SIGN IN'));
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it.each([
    ['Sign In', <LoginScreen />, 'NEW TO WRNC? CREATE AN ACCOUNT'],
    ['Signup', <SignupScreen />, 'ALREADY A MEMBER? SIGN IN'],
  ])('keeps %s navigation targets at least 44px tall', (_name, route, secondaryLabel) => {
    const screen = render(route);
    const homeButton = screen.getByLabelText('WRNC home');
    const secondaryButton = screen.getByRole('button', { name: secondaryLabel });

    expect(StyleSheet.flatten(homeButton.props.style)).toMatchObject({ minHeight: 44 });
    expect(StyleSheet.flatten(secondaryButton.props.style)).toMatchObject({ minHeight: 44 });
  });
});
