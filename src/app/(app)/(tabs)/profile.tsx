import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

type Row = { icon: keyof typeof Feather.glyphMap; label: string; hint?: string; onPress?: () => void; danger?: boolean };

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const rows: Row[] = [
    { icon: 'user', label: 'Edit profile', hint: 'Name, photo, contact' },
    { icon: 'users', label: 'Family members', hint: '1 added' },
    { icon: 'bell', label: 'Notifications', hint: 'Visitors, dues, notices' },
    { icon: 'shield', label: 'Trusted vehicles', hint: '2 saved' },
    { icon: 'help-circle', label: 'Help & support' },
    { icon: 'info', label: 'About Civic Shield' },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Profile</Text>
        </View>

        {/* Identity */}
        <Card variant="outlined" padding="lg">
          <View style={styles.identityRow}>
            <Avatar name={user?.name ?? 'You'} color={user?.avatarColor} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[Type.titleLg, { color: Palette.onSurface }]} numberOfLines={1}>
                {user?.name ?? 'Resident'}
              </Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>{user?.phone}</Text>
              <View style={styles.pillRow}>
                <Pill label={user?.role ?? 'resident'} bg={Palette.primaryContainer} color={Palette.onPrimaryContainer} />
                <Pill label={user?.flat ?? '—'} bg={Palette.surfaceContainerLow} color={Palette.onSurface} />
              </View>
            </View>
          </View>
        </Card>

        {/* Settings rows */}
        <Card variant="outlined" padding="xs" style={{ paddingVertical: 0, paddingHorizontal: 0 }}>
          {rows.map((r, i) => (
            <Pressable
              key={r.label}
              onPress={r.onPress}
              style={({ pressed }) => [
                styles.row,
                i < rows.length - 1 && styles.rowBorder,
                pressed && { backgroundColor: Palette.surfaceContainerLow },
              ]}>
              <View style={[styles.rowIcon, r.danger && { backgroundColor: Palette.errorContainer }]}>
                <Feather name={r.icon} size={17} color={r.danger ? Palette.error : Palette.onSurface} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleSm, { color: r.danger ? Palette.error : Palette.onSurface }]}>
                  {r.label}
                </Text>
                {r.hint ? (
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>{r.hint}</Text>
                ) : null}
              </View>
              <Feather name="chevron-right" size={18} color={Palette.outline} />
            </Pressable>
          ))}
        </Card>

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
          Civic Shield · v1.0.0 (demo)
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
  header: { marginBottom: Spacing.sm },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  pillRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
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
    marginTop: Spacing.lg,
  },
});
