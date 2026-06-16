import { useState, forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Palette, Radius, Spacing, Type } from '@/constants/theme';

export type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  containerStyle?: ViewStyle;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, hint, error, leftIcon, containerStyle, onFocus, onBlur, style, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);
  const showError = !!error;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? <Text style={[Type.labelMd, styles.label]}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && !showError && styles.fieldFocused,
          showError && styles.fieldError,
        ]}>
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={18}
            color={showError ? Palette.error : focused ? Palette.primary : Palette.onSurfaceVariant}
            style={{ marginRight: Spacing.sm }}
          />
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor={Palette.outline}
          style={[Type.bodyMd, styles.input, style]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {showError ? (
        <Text style={[Type.labelSm, { color: Palette.error, marginTop: Spacing.xs }]}>{error}</Text>
      ) : hint ? (
        <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { color: Palette.onSurfaceVariant, marginBottom: Spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: Palette.surfaceContainerLowest,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
  },
  fieldFocused: { borderColor: Palette.primary, borderWidth: 1.5 },
  fieldError: { borderColor: Palette.error, borderWidth: 1.5 },
  input: { flex: 1, color: Palette.onSurface, paddingVertical: Spacing.md },
});
