import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { homeRouteForRole, useAuth, type Role } from '@/lib/auth';

type Row = { icon: keyof typeof Feather.glyphMap; label: string; hint?: string; onPress?: () => void };

const ROLES: { role: Role; label: string }[] = [
  { role: 'resident', label: 'Resident' },
  { role: 'guard', label: 'Guard' },
  { role: 'admin', label: 'Admin' },
];

export default function AdminProfile() {
  const { user, switchRole, signOut } = useAuth();
  const router = useRouter();

  const rows: Row[] = [
    { icon: 'home', label: 'Society details', hint: 'Address, contacts, blocks' },
    { icon: 'sliders', label: 'Visitor rules', hint: 'After-hours, pre-approval defaults' },
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

        <Card padding="lg" style={styles.idCard} elevated>
          <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{user?.name}</Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{user?.phone}</Text>
            <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs }}>
              <Pill label="Admin" bg={Palette.warningContainer} color={Palette.warning} />
              <Pill label={user?.designation ?? 'Society Secretary'} bg={Palette.surfaceContainerHigh} color={Palette.onSurface} />
            </View>
          </View>
        </Card>

        <Card padding="sm" style={{ paddingVertical: 0 }}>
          {rows.map((r, i) => (
            <Pressable
              key={r.label}
              onPress={r.onPress}
              style={({ pressed }) => [styles.row, i < rows.length - 1 && styles.rowBorder, pressed && { backgroundColor: Palette.surfaceContainerLow }]}>
              <View style={styles.rowIcon}>
                <Feather name={r.icon} size={18} color={Palette.tertiary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]}>{r.label}</Text>
                {r.hint ? <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{r.hint}</Text> : null}
              </View>
              <Feather name="chevron-right" size={20} color={Palette.outline} />
            </Pressable>
          ))}
        </Card>

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Switch role</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {ROLES.map((r) => {
              const active = r.role === user?.role;
              return (
                <Pressable
                  key={r.role}
                  onPress={() => {
                    switchRole(r.role);
                    router.replace(homeRouteForRole(r.role) as any);
                  }}
                  style={[styles.roleChip, active && styles.roleChipActive]}>
                  <Text style={[Type.labelMd, { color: active ? '#fff' : Palette.onSurface }]}>{r.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Pressable
          onPress={() => {
            signOut();
            router.replace('/(auth)/login');
          }}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.6 }]}>
          <Feather name="log-out" size={18} color={Palette.error} />
          <Text style={[Type.labelMd, { color: Palette.error }]}>Sign out</Text>
        </Pressable>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  idCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.surfaceContainerHigh },
  rowIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Palette.warningContainer, alignItems: 'center', justifyContent: 'center' },
  roleChip: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Palette.surfaceContainerLow },
  roleChipActive: { backgroundColor: Palette.primary },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg, marginTop: Spacing.sm },
});
