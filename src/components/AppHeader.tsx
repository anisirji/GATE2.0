import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing, Type } from '@/constants/theme';

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
};

export function AppHeader({ title, subtitle, showBack = true, rightIcon, onRightPress }: AppHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            accessibilityLabel="Go back">
            <Feather name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'} size={24} color={Palette.onSurface} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.titleWrap}>
        <Text style={[Type.titleLg, { color: Palette.onSurface }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.side}>
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={12}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}>
            <Feather name={rightIcon} size={22} color={Palette.onSurface} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
    backgroundColor: Palette.surface,
  },
  side: { width: 40, alignItems: 'center' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1, alignItems: 'center' },
});
