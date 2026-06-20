import { StyleSheet, View, type ViewProps } from 'react-native';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

type CardVariant = 'flat' | 'outlined' | 'hero' | 'sunken' | 'filled';

export type CardProps = ViewProps & {
  padding?: keyof typeof Spacing;
  variant?: CardVariant;
  /** Back-compat shim. `elevated` now maps to 'hero', `accentColor` is ignored. */
  elevated?: boolean;
  /** @deprecated removed — use status badges/pills/leading icons for accent. */
  accentColor?: string;
};

export function Card({
  style,
  padding = 'lg',
  variant,
  elevated,
  accentColor: _accentColor,
  children,
  ...rest
}: CardProps) {
  const v: CardVariant = variant ?? (elevated ? 'hero' : 'outlined');
  const variantStyle = VARIANT_STYLE[v];

  return (
    <View
      style={[
        styles.base,
        { padding: Spacing[padding] },
        variantStyle.container,
        v === 'hero' && Shadow.hero,
        v === 'flat' && Shadow.card,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const VARIANT_STYLE: Record<CardVariant, { container: any }> = {
  outlined: {
    container: {
      backgroundColor: Palette.surfaceContainerLowest,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
    },
  },
  flat: {
    container: {
      backgroundColor: Palette.surfaceContainerLowest,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
    },
  },
  hero: {
    container: {
      backgroundColor: Palette.surfaceContainerLowest,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
    },
  },
  sunken: {
    container: {
      backgroundColor: Palette.surfaceContainerLow,
      borderWidth: 0,
    },
  },
  filled: {
    container: {
      backgroundColor: Palette.primary,
      borderWidth: 0,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
  },
});
