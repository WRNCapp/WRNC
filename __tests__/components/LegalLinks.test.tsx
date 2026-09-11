import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import AboutPage from '../../app/about';
import PrivacyPage from '../../app/privacy';
import TermsPage from '../../app/terms';
import { MarketingFooter } from '../../components/marketing/MarketingFooter';

const mockPush = jest.fn();

jest.mock('@expo/vector-icons/FontAwesome6', () => 'FontAwesome6');

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => ({ push: mockPush }),
}));

describe('legal-link preparation', () => {
  beforeEach(() => mockPush.mockClear());

  it.each([
    ['About', '/about'],
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
  ])('routes the %s footer link to %s', (label, route) => {
    const handlers = {
      onAbout: () => mockPush('/about'),
      onPrivacy: () => mockPush('/privacy'),
      onTerms: () => mockPush('/terms'),
    };
    const screen = render(<MarketingFooter {...handlers} />);
    fireEvent.press(screen.getByText(label));
    expect(mockPush).toHaveBeenCalledWith(route);
  });

  it('renders visible draft markers on every prepared route', () => {
    for (const Page of [AboutPage, PrivacyPage, TermsPage]) {
      const screen = render(<Page />);
      expect(screen.getByText('DRAFT PLACEHOLDER. NOT APPROVED LEGAL TEXT.')).toBeTruthy();
      screen.unmount();
    }
  });
});
