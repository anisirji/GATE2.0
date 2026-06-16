import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_COMPLAINTS, MOCK_ENTRY_LOG, MOCK_STAFF, SOCIETY_STATS } from '@/data/mockData';
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const onDuty = MOCK_STAFF.filter((s) => s.status === 'on-duty');
  const openComplaints = MOCK_COMPLAINTS.filter((c) => c.status !== 'resolved');
  const recentActivity = MOCK_ENTRY_LOG.slice(0, 3);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <View style={{ flex: 1 }}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>Admin overview</Text>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>{user?.society ?? 'Society'}</Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{user?.designation ?? 'Society Secretary'}</Text>
          </View>
          <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor} size={48} />
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {SOCIETY_STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: TONE_BG[s.tone] }]}>
              <Text style={[Type.labelSm, { color: TONE_FG[s.tone] }]}>{s.label}</Text>
              <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: 2 }]}>{s.value}</Text>
              {s.delta ? <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{s.delta}</Text> : null}
            </View>
          ))}
        </View>

        {/* Quick admin actions */}
        <View style={styles.quickGrid}>
          <QuickTile icon="send" label="Broadcast notice" tone={Palette.primary} bg={Palette.primaryContainer} onPress={() => router.push('/(admin)/notice-broadcast')} />
          <QuickTile icon="user-check" label="Staff tracking" tone={Palette.secondary} bg={Palette.secondaryContainer} onPress={() => router.push('/(admin)/staff-tracking')} />
          <QuickTile icon="pie-chart" label="Payments report" tone="#a16207" bg={Palette.warningContainer} onPress={() => router.push('/(admin)/payments-report')} />
          <QuickTile icon="users" label="Residents" tone={Palette.error} bg={Palette.errorContainer} onPress={() => router.push('/(admin)/(tabs)/residents')} />
        </View>

        {/* Open complaints */}
        <SectionHeader title="Open complaints" actionLabel={`${openComplaints.length} active`} />
        {openComplaints.map((c) => (
          <Card key={c.id} padding="md" accentColor={c.status === 'open' ? Palette.error : Palette.warning}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View style={[styles.complaintIcon, { backgroundColor: c.status === 'open' ? Palette.errorContainer : Palette.warningContainer }]}>
                <Feather name="alert-triangle" size={20} color={c.status === 'open' ? Palette.error : Palette.warning} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {c.title}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                  {c.raisedBy} · Flat {c.flat} · {c.raisedAt}
                </Text>
              </View>
              <Pill
                label={c.status === 'open' ? 'New' : 'In progress'}
                bg={c.status === 'open' ? Palette.statusDeniedBg : Palette.warningContainer}
                color={c.status === 'open' ? Palette.statusDeniedText : Palette.warning}
              />
            </View>
          </Card>
        ))}

        {/* Staff on duty */}
        <SectionHeader title="Staff on duty" actionLabel="See all" onAction={() => router.push('/(admin)/staff-tracking')} />
        <Card padding="lg" style={{ gap: Spacing.md }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {onDuty.map((s) => (
              <View key={s.id} style={styles.staffChip}>
                <Avatar name={s.name} color={s.avatarColor} size={28} />
                <View>
                  <Text style={[Type.labelMd, { color: Palette.onSurface, fontSize: 13 }]}>{s.name.split(' ')[0]}</Text>
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{s.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent activity */}
        <SectionHeader title="Recent gate activity" actionLabel="Full log" onAction={() => router.push('/(admin)/(tabs)/visitors')} />
        {recentActivity.map((e) => (
          <Card key={e.id} padding="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Avatar name={e.visitorName} color={Palette.outline} size={36} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]} numberOfLines={1}>
                  {e.visitorName}
                </Text>
                <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>
                  Flat {e.flat} · {e.inAt}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickTile({ icon, label, tone, bg, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; tone: string; bg: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickTile, pressed && { opacity: 0.7 }]}>
      <View style={[styles.quickIcon, { backgroundColor: bg }]}>
        <Feather name={icon} size={22} color={tone} />
      </View>
      <Text style={[Type.labelMd, { color: Palette.onSurface, textAlign: 'center' }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{title}</Text>
      {actionLabel ? (
        onAction ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={[Type.labelMd, { color: Palette.primary }]}>{actionLabel}</Text>
          </Pressable>
        ) : (
          <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>{actionLabel}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%', padding: Spacing.md, borderRadius: Radius.lg, gap: 2 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickTile: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, backgroundColor: Palette.surfaceContainerLowest, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.surfaceContainerHigh },
  quickIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.xs },
  complaintIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  staffChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingRight: Spacing.md, paddingLeft: Spacing.xs, paddingVertical: 4, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
});
