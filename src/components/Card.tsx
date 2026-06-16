import { StyleSheet, View, type ViewProps } from 'react-native';
import { Palette, Radius, Shadow, Spacing } from '@/constants/theme';

export type CardProps = ViewProps & {
  padding?: keyof typeof Spacing;
  elevated?: boolean;
  accentColor?: string;
};

export function Card({ style, padding = 'lg', elevated = true, accentColor, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: Spacing[padding] },
        elevated && Shadow.card,
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
  },
});
