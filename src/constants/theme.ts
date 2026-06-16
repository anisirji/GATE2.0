import { Platform, TextStyle } from 'react-native';

/**
 * Civic Shield — design tokens.
 * Source: Stitch project 10401026301242270114, MySociety Smart Community Platform.
 * Philosophy: "Digital Stewardship" — secure-blue authority + teal community warmth.
 */

export const Palette = {
  primary: '#1e40af',
  primaryDeep: '#00288e',
  primaryContainer: '#dde1ff',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#001453',

  secondary: '#006a61',
  secondaryContainer: '#86f2e4',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#00201d',

  tertiary: '#f59e0b',
  tertiaryContainer: '#ffddb8',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#2a1700',

  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  success: '#16a34a',
  successContainer: '#dcfce7',
  onSuccess: '#ffffff',
  onSuccessContainer: '#052e16',

  warning: '#f59e0b',
  warningContainer: '#fef3c7',

  surface: '#f9f9ff',
  surfaceDim: '#cfdaf2',
  surfaceBright: '#ffffff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eeff',
  surfaceContainerHigh: '#dee8ff',
  surfaceContainerHighest: '#d8e3fb',

  onSurface: '#111c2d',
  onSurfaceVariant: '#444653',
  outline: '#757684',
  outlineVariant: '#c4c5d5',
  inverseSurface: '#263143',
  inverseOnSurface: '#ecf1ff',

  // Status accents for visitor pills
  statusApprovedBg: '#dcfce7',
  statusApprovedText: '#15803d',
  statusExpectedBg: '#fef3c7',
  statusExpectedText: '#a16207',
  statusDeniedBg: '#ffdad6',
  statusDeniedText: '#93000a',
} as const;

export type PaletteKey = keyof typeof Palette;

// Keeping Colors export for compatibility with stock template `ThemedText`/`ThemedView`.
export const Colors = {
  light: {
    text: Palette.onSurface,
    textSecondary: Palette.onSurfaceVariant,
    background: Palette.surface,
    backgroundElement: Palette.surfaceContainerLow,
    backgroundSelected: Palette.surfaceContainerHigh,
  },
  dark: {
    text: '#ecf1ff',
    textSecondary: '#c4c5d5',
    background: '#0b1220',
    backgroundElement: '#1a2236',
    backgroundSelected: '#263248',
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

export const Type: Record<string, TextStyle> = {
  displayLg: { fontFamily: Fonts.headline, fontSize: 48, lineHeight: 60, letterSpacing: -0.96 },
  headlineLg: { fontFamily: Fonts.headline, fontSize: 32, lineHeight: 40, letterSpacing: -0.32 },
  headlineLgMobile: { fontFamily: Fonts.headline, fontSize: 24, lineHeight: 32 },
  headlineMd: { fontFamily: Fonts.headlineSemi, fontSize: 24, lineHeight: 32 },
  titleLg: { fontFamily: Fonts.headlineSemi, fontSize: 20, lineHeight: 28 },
  titleMd: { fontFamily: Fonts.headlineSemi, fontSize: 18, lineHeight: 26 },
  bodyLg: { fontFamily: Fonts.body, fontSize: 18, lineHeight: 28 },
  bodyMd: { fontFamily: Fonts.body, fontSize: 16, lineHeight: 24 },
  bodySm: { fontFamily: Fonts.body, fontSize: 14, lineHeight: 20 },
  labelMd: { fontFamily: Fonts.bodyBold, fontSize: 14, lineHeight: 20, letterSpacing: 0.14 },
  labelSm: { fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  // back-compat with stock template
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 9999,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#1e293b',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  modal: {
    shadowColor: '#1e293b',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
