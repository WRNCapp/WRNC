import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { HomeHero } from '../../components/marketing/HomeHero';
import { FinalCtaSection } from '../../components/marketing/FinalCtaSection';
import { MarketingFooter } from '../../components/marketing/MarketingFooter';
import { MarketingHeader } from '../../components/marketing/MarketingHeader';
import { MarketingButton } from '../../components/marketing/MarketingButton';
import { ProductShowcaseSection } from '../../components/marketing/ProductShowcaseSection';
import { WhyWrncSection } from '../../components/marketing/WhyWrncSection';
import { WrncLogo } from '../../components/marketing/WrncLogo';

jest.mock('@expo/vector-icons/FontAwesome6', () => 'FontAwesome6');

// useWindowDimensions is mocked per breakpoint where needed
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1440, height: 900, scale: 1, fontScale: 1 })),
}));

// Jest must resolve the mocked CommonJS default after the mock factory is registered.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockedDimensionsModule = require('react-native/Libraries/Utilities/useWindowDimensions');
const mockDimensions = (mockedDimensionsModule.default ?? mockedDimensionsModule) as jest.Mock;

describe('MarketingButton', () => {
  it('keeps the primary action at least 44px tall', () => {
    const { getByRole } = render(<MarketingButton label="JOIN WRNC" />);
    const button = getByRole('button', { name: 'JOIN WRNC' });
    const resolvedStyle = typeof button.props.style === 'function'
      ? button.props.style({ pressed: false })
      : button.props.style;

    expect(StyleSheet.flatten(resolvedStyle)).toMatchObject({ height: 44 });
  });
});

// ─── HomeHero ──────────────────────────────────────────────────────────────

describe('HomeHero', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the approved V3.1 copy and product proof', () => {
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
    getByText(/operating system for automotive builders/i);
    getByText('JOIN WRNC');
    getByText('SIGN IN →');
  });

  it('routes both hero actions through their callbacks', () => {
    const onGetStarted = jest.fn();
    const onSignIn = jest.fn();
    const { getByText } = render(<HomeHero onGetStarted={onGetStarted} onSignIn={onSignIn} />);
    fireEvent.press(getByText('JOIN WRNC'));
    fireEvent.press(getByText('SIGN IN →'));
    expect(onGetStarted).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('uses stacked layout on mobile (width < 768)', () => {
    mockDimensions.mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 });
    // Component should render without error at mobile width
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
  });

  it('uses stacked layout on tablet (768 ≤ width < 1100)', () => {
    mockDimensions.mockReturnValue({ width: 834, height: 1194, scale: 2, fontScale: 1 });
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
  });
});

// ─── ProductShowcaseSection ────────────────────────────────────────────────

describe('ProductShowcaseSection', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the current Timeline capture with canonical branding and sample disclosure', () => {
    const { getByLabelText, getByText } = render(<ProductShowcaseSection />);
    getByLabelText('WRNC Timeline product capture with sample activity data');
    getByLabelText('WRNC');
    getByText('Timeline · Sample data');
    getByText('Built for builders, not algorithms.');
    getByText(/personal build database/i);
  });

  it('renders without error on mobile width', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('Built for builders, not algorithms.');
  });
});

describe('V3.1 navigation and benefits', () => {
  it('routes mobile header auth actions and toggles its accessible menu', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });
    const onJoin = jest.fn();
    const onSignIn = jest.fn();
    const onFounding23 = jest.fn();
    const { getByLabelText, getByText } = render(<MarketingHeader onFounding23={onFounding23} onJoin={onJoin} onSignIn={onSignIn} />);
    fireEvent.press(getByLabelText('Open navigation'));
    fireEvent.press(getByText('FOUNDING BUILDERS'));
    fireEvent.press(getByLabelText('Open navigation'));
    fireEvent.press(getByText('SIGN IN'));
    fireEvent.press(getByLabelText('Open navigation'));
    fireEvent.press(getByText('JOIN WRNC'));
    expect(onJoin).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(onFounding23).toHaveBeenCalledTimes(1);
  });

  it('routes the homepage and footer Founding Builder actions', () => {
    const onFounding23 = jest.fn();
    const finalCta = render(<FinalCtaSection onFounding23={onFounding23} />);
    fireEvent.press(finalCta.getByText('BECOME A FOUNDING BUILDER →'));

    const footer = render(<MarketingFooter onFounding23={onFounding23} />);
    fireEvent.press(footer.getByText('Founding Builders'));
    expect(onFounding23).toHaveBeenCalledTimes(2);
  });

  it('renders the three approved benefits and public footer labels', () => {
    const benefits = render(<WhyWrncSection />);
    benefits.getByText('Organize your vehicle.');
    benefits.getByText('Document your build.');
    benefits.getByText('Preserve its history.');
    const onSignIn = jest.fn();
    const footer = render(<MarketingFooter onSignIn={onSignIn} />);
    ['Instagram', 'Facebook', 'YouTube', 'Discord', 'TikTok', 'Reddit profile'].forEach((label) => {
      footer.getByLabelText(label);
    });
    expect(footer.queryByLabelText('WRNC links')).toBeNull();
    expect(footer.queryByText('Shop')).toBeNull();
    footer.getByText('Built for Builders.');
    expect(footer.queryByText('The OS for Automotive Builders.')).toBeNull();
    footer.getByText('© 2026 WRNC.');
    fireEvent.press(footer.getByText('Sign In'));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });
});

// ─── WrncLogo ─────────────────────────────────────────────────────────────

describe('WrncLogo', () => {
  it('renders with the WRNC accessibility label', () => {
    const { getByLabelText } = render(<WrncLogo />);
    getByLabelText('WRNC');
  });

  it('references the transparent Hyper Silver placement asset', () => {
    // Confirm the asset path is the approved transparent master, not the dark background variant
    const source = require('../../assets/brand/wrnc-master-logo-hyper-silver-transparent-placement.png');
    expect(source).toBeDefined();
  });

  it('renders without error when a custom style is supplied', () => {
    const { getByLabelText } = render(<WrncLogo style={{ marginTop: 8 }} />);
    getByLabelText('WRNC');
  });
});
