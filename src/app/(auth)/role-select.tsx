import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { homeRouteForRole, useAuth, type Role } from '@/lib/auth';

type Option = {
  role: Role;
  title: string;
  body: string;
  icon: keyof typeof Feather.glyphMap;
  tint: string;
  bg: string;
};

const OPTIONS: Option[] = [
  {
    role: 'resident',
    title: 'I am a Resident',
    body: 'Manage visitors, pay maintenance, follow society notices.',
    icon: 'home',
    tint: Palette.primary,
    bg: Palette.primaryContainer,
  },
  {
    role: 'guard',
    title: 'I am a Guard',
    body: 'Scan visitor passes at the gate, log entries, and verify residents.',
    icon: 'shield',
    tint: Palette.secondary,
    bg: Palette.secondaryContainer,
  },
  {
    role: 'admin',
    title: 'I am Society Admin',
    body: 'Broadcast notices, manage residents, oversee dues and staff.',
    icon: 'briefcase',
    tint: '#a16207',
    bg: '#fef3c7',
  },
];

export default function RoleSelect() {
  const router = useRouter();
  const { signInAs } = useAuth();

  const choose = (role: Role) => {
    signInAs(role);
    router.replace(homeRouteForRole(role) as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>
            How will you use{'\n'}MySociety today?
          </Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
            Pick the experience you want to explore. You can switch later from Profile.
          </Text>
        </View>

        <View style={styles.options}>
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.role}
              onPress={() => choose(opt.role)}
              style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}>
              <View style={[styles.iconBubble, { backgroundColor: opt.bg }]}>
                <Feather name={opt.icon} size={28} color={opt.tint} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{opt.title}</Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{opt.body}</Text>
              </View>
              <Feather name="chevron-right" size={22} color={Palette.outline} />
            </Pressable>
          ))}
        </View>

        <Text style={[Type.labelSm, { color: Palette.outline, textAlign: 'center', marginTop: Spacing.xl }]}>
          Demo build · all three roles use mocked data
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.xl, paddingTop: Spacing.xxl, flexGrow: 1 },
  hero: { gap: Spacing.md, marginTop: Spacing.md },
  options: { gap: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Palette.surfaceContainerLowest,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.surfaceContainerHigh,
  },
  iconBubble: { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
});
