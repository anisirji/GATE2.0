import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Palette, Radius, Spacing, Type } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled,
  loading,
  fullWidth = true,
  style,
}: ButtonProps) {
  const { container, text } = useButtonStyles(variant, size, !!disabled);

  return (
    <Pressable
      onPress={() => {
        if (disabled || loading) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        container,
        fullWidth && styles.fullWidth,
        pressed && !disabled && { transform: [{ scale: 0.98 }], opacity: 0.92 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      {loading ? (
        <ActivityIndicator color={text.color as string} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <Feather name={icon} size={size === 'sm' ? 16 : 18} color={text.color as string} />}
          <Text style={[Type.labelMd, text, size === 'lg' && { fontSize: 16 }]}>{label}</Text>
          {icon && iconPosition === 'right' && <Feather name={icon} size={size === 'sm' ? 16 : 18} color={text.color as string} />}
        </View>
      )}
    </Pressable>
  );
}

function useButtonStyles(variant: Variant, size: Size, disabled: boolean) {
  const padV = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const padH = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;

  const sizeStyle: ViewStyle = { paddingVertical: padV, paddingHorizontal: padH };

  switch (variant) {
    case 'primary':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHighest : Palette.primary },
        text: { color: disabled ? Palette.outline : Palette.onPrimary },
      };
    case 'secondary':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHighest : Palette.secondary },
        text: { color: disabled ? Palette.outline : Palette.onSecondary },
      };
    case 'danger':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHighest : Palette.error },
        text: { color: Palette.onError },
      };
    case 'outline':
      return {
        container: { ...sizeStyle, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Palette.outlineVariant },
        text: { color: Palette.onSurface },
      };
    case 'ghost':
    default:
      return {
        container: { ...sizeStyle, backgroundColor: 'transparent' },
        text: { color: Palette.primary },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidth: { alignSelf: 'stretch' },
});
