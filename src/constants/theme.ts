import { Platform, TextStyle } from 'react-native';

/**
 * Civic Shield — design tokens v2.
 * Direction: modern light minimal, crafted details.
 * Off-white with subtle indigo tint, pure-but-warm cards, hairline borders,
 * one indigo accent, status colors only for status, generous whitespace.
 */

export const Palette = {
  // Single primary accent. Deep indigo carries trust without feeling like every other gov-tech app.
  primary: '#3D4EFF',
  primaryDeep: '#1F2BB8',
  primaryHover: '#2A39E6',
  primaryContainer: '#E8EBFF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#0A1366',

  // Used sparingly for guard role accent (kept in case role needs differentiation, but defaults to primary).
  secondary: '#0A8F82',
  secondaryContainer: '#D7F4F0',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#012A26',

  // Tertiary, used only for admin chrome accents.
  tertiary: '#B8740A',
  tertiaryContainer: '#FFE8C7',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#2A1700',

  // Status colors — used ONLY for status communication, never as decoration.
  error: '#D02F2A',
  errorContainer: '#FCE4E2',
  onError: '#FFFFFF',
  onErrorContainer: '#5C0E0B',

  success: '#0E8B4F',
  successContainer: '#DCF5E5',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#053019',

  warning: '#B07000',
  warningContainer: '#FFEFCC',

  // Surfaces — warm off-white with whisper indigo tint (chroma 0.005 from white).
  surface: '#F7F7FA',                  // app background
  surfaceDim: '#EFEFF4',               // sunken regions
  surfaceBright: '#FFFFFF',            // unused, kept for compat
  surfaceContainerLowest: '#FFFFFF',   // crisp white cards
  surfaceContainerLow: '#F2F2F7',      // recessed input/empty/tip backgrounds
  surfaceContainer: '#ECEDF2',         // chips inactive
  surfaceContainerHigh: '#E4E5EC',     // toggles
  surfaceContainerHighest: '#DCDEE6',  // borders for disabled

  // Text
  onSurface: '#0B0D14',                // headline ink
  onSurfaceVariant: '#5C6070',         // secondary
  onSurfaceMuted: '#8A8E9C',           // tertiary (timestamps, hints)
  outline: '#9CA0AE',
  outlineVariant: '#D7DAE2',

  // Borders — single hairline token used across the system
  border: '#E7E8EE',
  borderStrong: '#D1D4DC',

  inverseSurface: '#0E121C',
  inverseOnSurface: '#ECEEF7',

  // Status accents for visitor pills
  statusApprovedBg: '#DCF5E5',
  statusApprovedText: '#0E6B3C',
  statusExpectedBg: '#FFEFCC',
  statusExpectedText: '#8A5400',
  statusDeniedBg: '#FCE4E2',
  statusDeniedText: '#7D1A16',
} as const;

export type PaletteKey = keyof typeof Palette;

// Back-compat with ThemedText / ThemedView.
export const Colors = {
  light: {
    text: Palette.onSurface,
    textSecondary: Palette.onSurfaceVariant,
    background: Palette.surface,
    backgroundElement: Palette.surfaceContainerLow,
    backgroundSelected: Palette.surfaceContainerHigh,
  },
  dark: {
    text: '#ECEEF7',
    textSecondary: '#B8BBC7',
    background: '#0A0C13',
    backgroundElement: '#15182A',
    backgroundSelected: '#1F233A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    headline: 'PlusJakartaSans_700Bold',
    headlineSemi: 'PlusJakartaSans_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_600SemiBold',
    mono: 'ui-monospace',
    sans: 'Inter_400Regular',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
  },
  android: {
    headline: 'PlusJakartaSans_700Bold',
    headlineSemi: 'PlusJakartaSans_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_600SemiBold',
    mono: 'monospace',
    sans: 'Inter_400Regular',
    serif: 'serif',
    rounded: 'normal',
  },
  default: {
    headline: 'PlusJakartaSans_700Bold',
    headlineSemi: 'PlusJakartaSans_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodyBold: 'Inter_600SemiBold',
    mono: 'monospace',
    sans: 'Inter_400Regular',
    serif: 'serif',
    rounded: 'normal',
  },
})!;

// Typography — sharper hierarchy (≥1.25 ratio between steps).
// Headlines: tight tracking, generous leading. Body: comfortable reading rhythm.
export const Type: Record<string, TextStyle> = {
  displayLg: { fontFamily: Fonts.headline, fontSize: 56, lineHeight: 60, letterSpacing: -1.4 },
  displayMd: { fontFamily: Fonts.headline, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  headlineLg: { fontFamily: Fonts.headline, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  headlineLgMobile: { fontFamily: Fonts.headline, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  headlineMd: { fontFamily: Fonts.headline, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  titleLg: { fontFamily: Fonts.headlineSemi, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  titleMd: { fontFamily: Fonts.headlineSemi, fontSize: 17, lineHeight: 22, letterSpacing: -0.1 },
  titleSm: { fontFamily: Fonts.headlineSemi, fontSize: 15, lineHeight: 20 },
  bodyLg: { fontFamily: Fonts.body, fontSize: 17, lineHeight: 26 },
  bodyMd: { fontFamily: Fonts.body, fontSize: 15, lineHeight: 22 },
  bodySm: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 18 },
  labelMd: { fontFamily: Fonts.bodyBold, fontSize: 14, lineHeight: 18, letterSpacing: 0.05 },
  labelSm: { fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.1 },
  // Section eyebrow: tiny uppercase tracking, used for section labels.
  eyebrow: { fontFamily: Fonts.bodyBold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase' },
  // Mono numerics, used for amounts and times.
  numLg: { fontFamily: Fonts.headline, fontSize: 36, lineHeight: 40, letterSpacing: -0.8 },
  numXl: { fontFamily: Fonts.headline, fontSize: 48, lineHeight: 52, letterSpacing: -1.2 },
};

// Spacing — 4pt scale with a few rhythmic moments.
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  // back-compat
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  pill: 9999,
} as const;

// Shadows — barely-there. Defaults are NO shadow; this is opt-in for the one hero per screen.
export const Shadow = {
  card: {
    shadowColor: '#0B0D14',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  hero: {
    shadowColor: '#0B0D14',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  modal: {
    shadowColor: '#0B0D14',
    shadowOpacity: 0.16,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

// Motion — ease-out-quart matches the design law. No bounce.
export const Motion = {
  duration: { fast: 120, base: 220, slow: 360 },
  easing: { out: [0.22, 1, 0.36, 1] as const },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Layout constants. Use these instead of raw Spacing in screen containers
 * so spacing stays consistent across tabs and the tab bar never overlaps content.
 */
export const Layout = {
  /** Horizontal page gutter for tab screens. */
  pageGutter: Spacing.lg,
  /** Top padding inside SafeArea — leaves room before the first heading. */
  pageTop: Spacing.md,
  /** Bottom padding inside scroll views on tab screens. Clears the tab bar with breathing room. */
  scrollBottom: Platform.select({ ios: 120, android: 100, default: 100 })!,
  /** Vertical gap between major sections. */
  sectionGap: Spacing.xxl,
  /** Vertical gap between rows in a card list. */
  rowGap: Spacing.sm,
} as const;
