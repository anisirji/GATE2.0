import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { homeRouteForRole, useAuth, type Role } from '@/lib/auth';

const ROLES: { role: Role; label: string }[] = [
  { role: 'resident', label: 'Resident' },
  { role: 'guard', label: 'Guard' },
  { role: 'admin', label: 'Admin' },
];

export default function GuardProfile() {
  const { user, switchRole, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Profile</Text>

        <Card padding="lg" style={styles.idCard} elevated>
          <Avatar name={user?.name ?? 'Guard'} color={user?.avatarColor} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{user?.name}</Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{user?.phone}</Text>
            <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs }}>
              <Pill label="Guard" bg={Palette.secondaryContainer} color={Palette.onSecondaryContainer} />
              <Pill label={user?.designation ?? 'Day shift'} bg={Palette.surfaceContainerHigh} color={Palette.onSurface} />
            </View>
          </View>
        </Card>

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Shift status</Text>
          <View style={styles.shiftRow}>
            <View style={[styles.shiftBubble, { backgroundColor: Palette.statusApprovedBg }]}>
              <Feather name="check-circle" size={20} color={Palette.statusApprovedText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]}>On duty</Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Since 7:00 AM · Gate 1</Text>
            </View>
            <Pressable style={styles.shiftBtn}>
              <Text style={[Type.labelMd, { color: Palette.primary }]}>End shift</Text>
            </Pressable>
          </View>
        </Card>

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Try another role</Text>
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
  shiftRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  shiftBubble: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  shiftBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, backgroundColor: Palette.surfaceContainerLow },
  roleChip: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Palette.surfaceContainerLow },
  roleChipActive: { backgroundColor: Palette.primary },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
});
