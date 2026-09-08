import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AppLayout from '../../app/(app)/_layout';

const mockRedirect = jest.fn((_props: { href: string }) => null);
const mockStack = jest.fn((_props: unknown) => null);
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockUnsubscribe = jest.fn();
let mockIsSupabaseConfigured = false;

jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
  Stack: function ProtectedStack(props: unknown) {
    const { useQueryClient } = jest.requireActual('@tanstack/react-query');
    useQueryClient();
    return mockStack(props);
  },
}));

jest.mock('../../lib/supabase', () => ({
  get isSupabaseConfigured() {
    return mockIsSupabaseConfigured;
  },
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      onAuthStateChange: (...args: unknown[]) => mockOnAuthStateChange(...args),
    },
  },
}));

describe('protected application layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSupabaseConfigured = false;
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  it('declaratively redirects when authentication is not configured', () => {
    render(<AppLayout />);

    expect(mockRedirect).toHaveBeenCalledWith({ href: '/login' });
    expect(mockGetSession).not.toHaveBeenCalled();
    expect(mockStack).not.toHaveBeenCalled();
  });

  it('redirects after a configured session check finds no session', async () => {
    mockIsSupabaseConfigured = true;
    render(<AppLayout />);

    await waitFor(() => expect(mockRedirect).toHaveBeenCalledWith({ href: '/login' }));
    expect(mockStack).not.toHaveBeenCalled();
  });

  it('mounts protected routes only after authentication is confirmed', async () => {
    mockIsSupabaseConfigured = true;
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null });
    render(<AppLayout />);

    await waitFor(() => expect(mockStack).toHaveBeenCalled());
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
