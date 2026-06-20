import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Palette, Spacing, Type } from '@/constants/theme';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.row, style]}>
      <Text style={[Type.titleMd, { color: Palette.onSurface }]}>{title}</Text>
      {actionLabel ? (
        onAction ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={[Type.labelMd, { color: Palette.primary }]}>{actionLabel}</Text>
          </Pressable>
        ) : (
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{actionLabel}</Text>
        )
      ) : null}
    </View>
  );
}

export function Eyebrow({ children, color = Palette.onSurfaceMuted }: { children: string; color?: string }) {
  return <Text style={[Type.eyebrow, { color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
});
