import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill, StatusBadge } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_NOTICES, MOCK_PAYMENTS, MOCK_VISITORS, QUICK_ACTIONS } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

const TONE_COLORS: Record<string, { bg: string; fg: string }> = {
  primary: { bg: '#1e40af15', fg: Palette.primary },
  secondary: { bg: '#006a6115', fg: Palette.secondary },
  tertiary: { bg: '#f59e0b15', fg: '#a16207' },
  neutral: { bg: Palette.surfaceContainer, fg: Palette.onSurfaceVariant },
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const greeting = useGreeting();

  const upcoming = MOCK_VISITORS.filter((v) => v.status === 'expected').slice(0, 3);
  const pendingPayment = MOCK_PAYMENTS.find((p) => p.status === 'pending');
  const pinnedNotice = MOCK_NOTICES.find((n) => n.pinned) ?? MOCK_NOTICES[0];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>{greeting},</Text>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]} numberOfLines={1}>
              {user?.name.split(' ')[0] ?? 'Resident'}
            </Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: 2 }]}>
              {user?.flat} · {user?.society}
            </Text>
          </View>
          <Pressable hitSlop={12} onPress={() => router.push('/(app)/(tabs)/profile')}>
            <Avatar name={user?.name ?? 'You'} color={user?.avatarColor} size={48} />
          </Pressable>
        </View>

        {/* Hero QR card */}
        <Pressable onPress={() => router.push('/(app)/qr-pass')}>
          <Card style={styles.heroCard} padding="xl" elevated>
            <View style={styles.heroLeft}>
              <Pill label="Quickest" bg={Palette.primaryContainer} color={Palette.primaryDeep} />
              <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Generate a visitor pass</Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>
                One-tap QR your guard can scan at the gate.
              </Text>
              <View style={styles.heroCta}>
                <Text style={[Type.labelMd, { color: Palette.primary }]}>Open</Text>
                <Feather name="arrow-right" size={16} color={Palette.primary} />
              </View>
            </View>
            <View style={styles.heroQr}>
              <Feather name="maximize" size={56} color={Palette.primary} />
            </View>
          </Card>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((qa) => {
            const tone = TONE_COLORS[qa.tone];
            return (
              <Pressable
                key={qa.id}
                onPress={() => router.push(qa.route as any)}
                style={({ pressed }) => [styles.quickItem, pressed && { opacity: 0.7 }]}>
                <View style={[styles.quickIcon, { backgroundColor: tone.bg }]}>
                  <Feather name={qa.icon as any} size={22} color={tone.fg} />
                </View>
                <Text style={[Type.labelMd, { color: Palette.onSurface, textAlign: 'center' }]} numberOfLines={2}>
                  {qa.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Upcoming visitors */}
        <SectionHeader title="Upcoming visitors" actionLabel="See all" onAction={() => router.push('/(app)/(tabs)/visitors')} />
        <View style={{ gap: Spacing.sm }}>
          {upcoming.length === 0 ? (
            <EmptyState icon="user-check" text="No visitors expected." />
          ) : (
            upcoming.map((v) => (
              <Card key={v.id} padding="md" accentColor={Palette.statusExpectedText}>
                <View style={styles.visitorRow}>
                  <Avatar name={v.name} color={Palette.secondary} size={42} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                      {v.name}
                    </Text>
                    <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                      {v.purpose} · {v.arrivalTime}
                    </Text>
                  </View>
                  <StatusBadge status={v.status} />
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Pending dues */}
        {pendingPayment ? (
          <>
            <SectionHeader title="Society dues" actionLabel="Pay now" onAction={() => router.push('/(app)/(tabs)/payments')} />
            <Card padding="lg" accentColor={Palette.warning}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View style={[styles.dueIcon, { backgroundColor: Palette.warningContainer }]}>
                  <Feather name="alert-circle" size={22} color={Palette.warning} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface }]}>{pendingPayment.label}</Text>
                  <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>
                    Due by {formatDate(pendingPayment.dueDate)}
                  </Text>
                </View>
                <Text style={[Type.titleLg, { color: Palette.onSurface }]}>₹{pendingPayment.amount}</Text>
              </View>
            </Card>
          </>
        ) : null}

        {/* Pinned notice */}
        {pinnedNotice ? (
          <>
            <SectionHeader title="From the society" actionLabel="All notices" onAction={() => router.push('/(app)/(tabs)/notices')} />
            <Card padding="lg" accentColor={Palette.primary}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs }}>
                <Feather name="bookmark" size={14} color={Palette.primary} />
                <Text style={[Type.labelSm, { color: Palette.primary }]}>PINNED · {pinnedNotice.category.toUpperCase()}</Text>
              </View>
              <Text style={[Type.titleMd, { color: Palette.onSurface, marginBottom: Spacing.xs }]}>{pinnedNotice.title}</Text>
              <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]} numberOfLines={3}>
                {pinnedNotice.body}
              </Text>
              <Text style={[Type.labelSm, { color: Palette.outline, marginTop: Spacing.md }]}>
                {pinnedNotice.postedBy} · {pinnedNotice.postedAt}
              </Text>
            </Card>
          </>
        ) : null}

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
          <Text style={[Type.labelMd, { color: Palette.primary }]}>{actionLabel}</Text>
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

function useGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Up late';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xs },
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, backgroundColor: Palette.surfaceContainerLow },
  heroLeft: { flex: 1, gap: Spacing.sm },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  heroQr: {
    width: 88,
    height: 88,
    borderRadius: Radius.lg,
    backgroundColor: Palette.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickGrid: { flexDirection: 'row', gap: Spacing.sm },
  quickItem: { flex: 1, alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, backgroundColor: Palette.surfaceContainerLowest, borderRadius: Radius.lg },
  quickIcon: { width: 48, height: 48, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md, marginBottom: Spacing.xs },
  visitorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dueIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.lg },
});
