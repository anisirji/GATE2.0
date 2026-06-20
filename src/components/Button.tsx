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
  const minHeight = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;

  return (
    <Pressable
      onPress={() => {
        if (disabled || loading) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        { minHeight },
        container,
        fullWidth && styles.fullWidth,
        pressed && !disabled && { transform: [{ scale: 0.985 }], opacity: 0.94 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      {loading ? (
        <ActivityIndicator color={text.color as string} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <Feather name={icon} size={size === 'sm' ? 15 : 17} color={text.color as string} />}
          <Text style={[Type.labelMd, text, size === 'lg' && { fontSize: 16 }]}>{label}</Text>
          {icon && iconPosition === 'right' && <Feather name={icon} size={size === 'sm' ? 15 : 17} color={text.color as string} />}
        </View>
      )}
    </Pressable>
  );
}

function useButtonStyles(variant: Variant, size: Size, disabled: boolean) {
  const padV = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const padH = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const sizeStyle: ViewStyle = { paddingVertical: padV, paddingHorizontal: padH };

  switch (variant) {
    case 'primary':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHigh : Palette.primary },
        text: { color: disabled ? Palette.outline : Palette.onPrimary },
      };
    case 'secondary':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHigh : Palette.onSurface },
        text: { color: disabled ? Palette.outline : '#FFFFFF' },
      };
    case 'danger':
      return {
        container: { ...sizeStyle, backgroundColor: disabled ? Palette.surfaceContainerHigh : Palette.error },
        text: { color: Palette.onError },
      };
    case 'outline':
      return {
        container: {
          ...sizeStyle,
          backgroundColor: Palette.surfaceContainerLowest,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: Palette.borderStrong,
        },
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidth: { alignSelf: 'stretch' },
});
