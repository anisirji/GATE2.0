import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill, StatusBadge } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { GUARD_SHIFT_STATS, MOCK_ENTRY_LOG, MOCK_VISITORS } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

const TONE_BG: Record<string, string> = {
  primary: Palette.primaryContainer,
  success: Palette.statusApprovedBg,
  warning: Palette.warningContainer,
  neutral: Palette.surfaceContainerHigh,
};
const TONE_FG: Record<string, string> = {
  primary: Palette.primary,
  success: Palette.statusApprovedText,
  warning: Palette.warning,
  neutral: Palette.onSurfaceVariant,
};

export default function GuardDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const expected = MOCK_VISITORS.filter((v) => v.status === 'expected');
  const recentInside = MOCK_ENTRY_LOG.filter((e) => e.status === 'inside');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <View style={{ flex: 1 }}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>On shift</Text>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>{user?.name.split(' ')[0] ?? 'Guard'}</Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{user?.designation ?? 'Day shift'} · {user?.society}</Text>
          </View>
          <Avatar name={user?.name ?? 'Guard'} color={user?.avatarColor} size={48} />
        </View>

        {/* Big scan CTA */}
        <Pressable onPress={() => router.push('/(guard)/(tabs)/scan')}>
          <Card padding="xl" style={styles.scanCta} elevated>
            <View style={styles.scanIcon}>
              <Feather name="maximize" size={36} color="#fff" />
            </View>
            <View style={{ flex: 1, gap: Spacing.xs }}>
              <Text style={[Type.titleLg, { color: '#fff' }]}>Scan visitor pass</Text>
              <Text style={[Type.bodySm, { color: '#fff', opacity: 0.85 }]}>Tap to open the camera and validate a QR.</Text>
            </View>
            <Feather name="arrow-right" size={22} color="#fff" />
          </Card>
        </Pressable>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {GUARD_SHIFT_STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: TONE_BG[s.tone] }]}>
              <Feather name={s.icon as any} size={18} color={TONE_FG[s.tone]} />
              <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: Spacing.xs }]}>{s.value}</Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Expected visitors */}
        <SectionHeader title="Expected" actionLabel="All" onAction={() => router.push('/(guard)/(tabs)/entries')} />
        {expected.length === 0 ? (
          <EmptyState icon="user-check" text="Nobody pre-approved right now." />
        ) : (
          expected.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => router.push({ pathname: '/(guard)/visitor-details', params: { id: v.id } })}>
              <Card padding="md" accentColor={Palette.warning}>
                <View style={styles.visitorRow}>
                  <Avatar name={v.name} color={Palette.warning} size={42} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                      {v.name}
                    </Text>
                    <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                      Flat {v.hostFlat} · {v.arrivalTime}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={Palette.outline} />
                </View>
              </Card>
            </Pressable>
          ))
        )}

        {/* Currently inside */}
        <SectionHeader title="Inside society" />
        {recentInside.map((e) => (
          <Card key={e.id} padding="md" accentColor={Palette.success}>
            <View style={styles.visitorRow}>
              <Avatar name={e.visitorName} color={Palette.success} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {e.visitorName}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>
                  Flat {e.flat} · in at {e.inAt.replace('Today, ', '')}
                </Text>
              </View>
              <Pill label="Inside" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
            </View>
          </Card>
        ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[Type.labelMd, { color: Palette.secondary }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function EmptyState({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.empty}>
      <Feather name={icon} size={28} color={Palette.outline} />
      <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>{text}</Text>
    </View>
  );
}

// Suppress unused warning
const _u = StatusBadge;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xs },
  scanCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    backgroundColor: Palette.secondary,
  },
  scanIcon: { width: 64, height: 64, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%', padding: Spacing.md, borderRadius: Radius.lg, gap: 2 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.xs },
  visitorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.lg },
});
