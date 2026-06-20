import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Eyebrow, SectionHeader } from '@/components/Section';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_COMPLAINTS, MOCK_ENTRY_LOG, MOCK_STAFF, SOCIETY_STATS } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const onDuty = MOCK_STAFF.filter((s) => s.status === 'on-duty');
  const openComplaints = MOCK_COMPLAINTS.filter((c) => c.status !== 'resolved');
  const recentActivity = MOCK_ENTRY_LOG.slice(0, 3);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <View style={{ flex: 1 }}>
            <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Admin overview</Text>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, marginTop: 6 }]} numberOfLines={1}>
              {user?.society ?? 'Society'}
            </Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
              {user?.designation ?? 'Society Secretary'}
            </Text>
          </View>
          <Avatar name={user?.name ?? 'Admin'} color={user?.avatarColor} size={44} ring />
        </View>

        {/* Stats — quiet 2x2 grid */}
        <View style={styles.statsGrid}>
          {SOCIETY_STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>{s.label}</Text>
              <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: 6 }]} numberOfLines={1}>
                {s.value}
              </Text>
              {s.delta ? (
                <Text style={[Type.labelSm, { color: deltaColor(s.tone), marginTop: 4 }]} numberOfLines={1}>
                  {s.delta}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Quick actions — list rather than grid for clarity */}
        <View style={styles.quickList}>
          <QuickRow
            icon="send"
            label="Broadcast notice"
            hint="Reach all residents in seconds"
            onPress={() => router.push('/(admin)/notice-broadcast')}
          />
          <QuickRow
            icon="user-check"
            label="Staff tracking"
            hint={`${onDuty.length} on duty now`}
            onPress={() => router.push('/(admin)/staff-tracking')}
          />
          <QuickRow
            icon="pie-chart"
            label="Payments report"
            hint="Dues, collection trend"
            onPress={() => router.push('/(admin)/payments-report')}
          />
          <QuickRow
            icon="users"
            label="Residents directory"
            hint="486 active flats"
            onPress={() => router.push('/(admin)/(tabs)/residents')}
            last
          />
        </View>

        {/* Open complaints */}
        <SectionHeader title="Open complaints" actionLabel={`${openComplaints.length} active`} />
        <View style={{ gap: Spacing.sm }}>
          {openComplaints.slice(0, 4).map((c) => (
            <Card key={c.id} variant="outlined" padding="md">
              <View style={styles.row}>
                <View
                  style={[
                    styles.cIcon,
                    {
                      backgroundColor:
                        c.status === 'open' ? Palette.errorContainer : Palette.warningContainer,
                    },
                  ]}>
                  <Feather
                    name="alert-triangle"
                    size={17}
                    color={c.status === 'open' ? Palette.error : Palette.warning}
                  />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                    {c.title}
                  </Text>
                  <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]} numberOfLines={1}>
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
        </View>

        {/* Staff on duty */}
        <SectionHeader title="Staff on duty" actionLabel="See all" onAction={() => router.push('/(admin)/staff-tracking')} />
        <Card variant="outlined" padding="lg">
          <Eyebrow>{onDuty.length} active</Eyebrow>
          <View style={styles.staffRow}>
            {onDuty.slice(0, 6).map((s) => (
              <View key={s.id} style={styles.staffChip}>
                <Avatar name={s.name} color={s.avatarColor} size={26} />
                <View>
                  <Text style={[Type.labelMd, { color: Palette.onSurface }]} numberOfLines={1}>
                    {s.name.split(' ')[0]}
                  </Text>
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]} numberOfLines={1}>
                    {s.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent gate activity */}
        <SectionHeader
          title="Recent gate activity"
          actionLabel="Full log"
          onAction={() => router.push('/(admin)/(tabs)/visitors')}
        />
        <View style={{ gap: Spacing.sm }}>
          {recentActivity.map((e) => (
            <Card key={e.id} variant="outlined" padding="md">
              <View style={styles.row}>
                <Avatar name={e.visitorName} size={36} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[Type.titleSm, { color: Palette.onSurface }]} numberOfLines={1}>
                    {e.visitorName}
                  </Text>
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>
                    Flat {e.flat} · {e.inAt}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={Palette.outline} />
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickRow({
  icon,
  label,
  hint,
  onPress,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  hint: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.qrow,
        !last && styles.qrowBorder,
        pressed && { backgroundColor: Palette.surfaceContainerLow },
      ]}>
      <View style={styles.qIcon}>
        <Feather name={icon} size={17} color={Palette.onSurface} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Type.titleSm, { color: Palette.onSurface }]}>{label}</Text>
        <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>{hint}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Palette.outline} />
    </Pressable>
  );
}

function deltaColor(tone: string) {
  if (tone === 'success') return Palette.statusApprovedText;
  if (tone === 'warning') return Palette.warning;
  if (tone === 'primary') return Palette.primary;
  return Palette.onSurfaceMuted;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
  },

  greeting: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    width: '48%',
    flexGrow: 1,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },

  quickList: {
    marginTop: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  qrow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  qrowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  qIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  staffRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  staffChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceContainerLow,
  },
});
