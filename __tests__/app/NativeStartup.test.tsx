import React from 'react';
import { render } from '@testing-library/react-native';
import NativeRoot from '../../app/index';

const mockRedirect = jest.fn((_props: { href: string }) => null);
const mockWorkspaceMounted = jest.fn();

jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
}));

// Keep the real query-context requirement. Mounting the workspace directly
// from the native root must reproduce build 1's missing-provider exception.
jest.mock('../../components/workspace/VehicleWorkspaceShell', () => ({
  VehicleWorkspaceShell: function WorkspaceProbe() {
    const { useQueryClient } = jest.requireActual('@tanstack/react-query');
    mockWorkspaceMounted();
    useQueryClient();
    return null;
  },
}));

describe('native cold start without an application provider', () => {
  it('redirects to the protected workspace without mounting query consumers', () => {
    render(<NativeRoot />);
    expect(mockRedirect).toHaveBeenCalledWith({ href: '/workspace' });
    expect(mockWorkspaceMounted).not.toHaveBeenCalled();
  });
});
