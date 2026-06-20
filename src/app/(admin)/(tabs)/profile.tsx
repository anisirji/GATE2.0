import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

type Row = { icon: keyof typeof Feather.glyphMap; label: string; hint?: string; onPress?: () => void };

export default function AdminProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const rows: Row[] = [
    { icon: 'home', label: 'Society details', hint: 'Address, contacts, blocks' },
    { icon: 'sliders', label: 'Visitor rules', hint: 'After‑hours, pre‑approval defaults' },
    { icon: 'credit-card', label: 'Billing & dues setup', hint: 'Maintenance, utilities, late fees' },
    { icon: 'users', label: 'Committee members' },
    { icon: 'shield', label: 'Roles & permissions' },
    { icon: 'database', label: 'Data export & backups' },
    { icon: 'help-circle', label: 'Help & support' },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Admin settings</Text>

        <Card variant="outlined" padding="lg">
          <View style={styles.idRow}>
            <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[Type.titleLg, { color: Palette.onSurface }]} numberOfLines={1}>
                {user?.name}
              </Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>{user?.phone}</Text>
              <View style={styles.pillRow}>
                <Pill label="Admin" bg={Palette.tertiaryContainer} color={Palette.onTertiaryContainer} />
                <Pill
                  label={user?.designation ?? 'Society Secretary'}
                  bg={Palette.surfaceContainerLow}
                  color={Palette.onSurface}
                />
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.list}>
          {rows.map((r, i) => (
            <Pressable
              key={r.label}
              onPress={r.onPress}
              style={({ pressed }) => [
                styles.row,
                i < rows.length - 1 && styles.rowBorder,
                pressed && { backgroundColor: Palette.surfaceContainerLow },
              ]}>
              <View style={styles.rowIcon}>
                <Feather name={r.icon} size={17} color={Palette.onSurface} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleSm, { color: Palette.onSurface }]}>{r.label}</Text>
                {r.hint ? (
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>{r.hint}</Text>
                ) : null}
              </View>
              <Feather name="chevron-right" size={18} color={Palette.outline} />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => {
            signOut();
            router.replace('/(auth)/login');
          }}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.6 }]}>
          <Feather name="log-out" size={16} color={Palette.error} />
          <Text style={[Type.labelMd, { color: Palette.error }]}>Sign out</Text>
        </Pressable>

        <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, textAlign: 'center', marginTop: Spacing.md }]}>
          Civic Shield · v1.0.0
        </Text>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
    gap: Spacing.lg,
  },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  pillRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },
  list: {
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
