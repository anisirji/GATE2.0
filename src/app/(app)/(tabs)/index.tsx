import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/Section';
import { Pill, StatusBadge } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { MOCK_NOTICES, MOCK_PAYMENTS, MOCK_VISITORS, QUICK_ACTIONS } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

const QA_ICON: Record<string, keyof typeof Feather.glyphMap> = {
  'qr-code': 'maximize',
  'user-plus': 'user-plus',
  wallet: 'credit-card',
  megaphone: 'message-square',
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
            <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>{greeting}</Text>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, marginTop: 2 }]} numberOfLines={1}>
              {user?.name.split(' ')[0] ?? 'Resident'}
            </Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={12} color={Palette.onSurfaceMuted} />
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]} numberOfLines={1}>
                {user?.flat} · {user?.society}
              </Text>
            </View>
          </View>
          <Pressable hitSlop={12} onPress={() => router.push('/(app)/(tabs)/profile')}>
            <Avatar name={user?.name ?? 'You'} color={user?.avatarColor} size={44} ring />
          </Pressable>
        </View>

        {/* Hero — QR pass */}
        <Pressable onPress={() => router.push('/(app)/qr-pass')} style={({ pressed }) => pressed && { transform: [{ scale: 0.995 }] }}>
          <View style={[styles.hero, Shadow.hero]}>
            <View style={styles.heroInner}>
              <View style={{ flex: 1, gap: Spacing.md }}>
                <Text style={[Type.eyebrow, { color: Palette.primary }]}>One‑tap entry</Text>
                <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>Your visitor pass</Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={2}>
                  Generate a QR your guard can scan in seconds.
                </Text>
                <View style={styles.heroCta}>
                  <Text style={[Type.labelMd, { color: Palette.primary }]}>Open pass</Text>
                  <Feather name="arrow-right" size={15} color={Palette.primary} />
                </View>
              </View>
              <View style={styles.heroArt}>
                <View style={styles.heroArtInner}>
                  <View style={styles.qrGlyph}>
                    {QR_DOTS.map((row, ri) => (
                      <View key={ri} style={styles.qrRow}>
                        {row.map((on, ci) => (
                          <View
                            key={ci}
                            style={[
                              styles.qrCell,
                              { backgroundColor: on ? Palette.onSurface : 'transparent' },
                            ]}
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((qa) => (
            <Pressable
              key={qa.id}
              onPress={() => router.push(qa.route as any)}
              style={({ pressed }) => [styles.quickItem, pressed && { backgroundColor: Palette.surfaceContainer }]}>
              <View style={styles.quickIcon}>
                <Feather name={QA_ICON[qa.icon] ?? 'circle'} size={19} color={Palette.onSurface} />
              </View>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant, textAlign: 'center' }]} numberOfLines={2}>
                {qa.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Pending dues — surfaces as a callout strip */}
        {pendingPayment ? (
          <Pressable onPress={() => router.push('/(app)/(tabs)/payments')}>
            <Card variant="outlined" padding="md">
              <View style={styles.dueRow}>
                <View style={styles.dueDot} />
                <View style={{ flex: 1 }}>
                  <Text style={[Type.eyebrow, { color: Palette.warning }]}>Dues</Text>
                  <Text style={[Type.titleMd, { color: Palette.onSurface, marginTop: 2 }]}>
                    {pendingPayment.label}
                  </Text>
                  <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
                    Due {formatDate(pendingPayment.dueDate)}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={[Type.titleLg, { color: Palette.onSurface }]}>
                    ₹{pendingPayment.amount.toLocaleString('en-IN')}
                  </Text>
                  <View style={styles.payChip}>
                    <Text style={[Type.labelSm, { color: Palette.onPrimary }]}>Pay</Text>
                    <Feather name="arrow-right" size={12} color={Palette.onPrimary} />
                  </View>
                </View>
              </View>
            </Card>
          </Pressable>
        ) : null}

        {/* Upcoming visitors */}
        <SectionHeader
          title="Expected today"
          actionLabel="See all"
          onAction={() => router.push('/(app)/(tabs)/visitors')}
        />
        <View style={{ gap: Spacing.sm }}>
          {upcoming.length === 0 ? (
            <EmptyState icon="user-check" text="No visitors expected." />
          ) : (
            upcoming.map((v) => (
              <Card key={v.id} variant="outlined" padding="md">
                <View style={styles.visitorRow}>
                  <Avatar name={v.name} size={40} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                      {v.name}
                    </Text>
                    <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]} numberOfLines={1}>
                      {v.purpose} · {v.arrivalTime.replace('Today, ', '')}
                    </Text>
                  </View>
                  <StatusBadge status={v.status} />
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Pinned notice */}
        {pinnedNotice ? (
          <>
            <SectionHeader
              title="From the society"
              actionLabel="All notices"
              onAction={() => router.push('/(app)/(tabs)/notices')}
            />
            <Card variant="outlined" padding="lg">
              <View style={styles.noticeMeta}>
                <Pill label="Pinned" bg={Palette.primaryContainer} color={Palette.onPrimaryContainer} />
                <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>{pinnedNotice.category}</Text>
              </View>
              <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.md }]}>
                {pinnedNotice.title}
              </Text>
              <Text
                style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}
                numberOfLines={3}>
                {pinnedNotice.body}
              </Text>
              <View style={styles.noticeFoot}>
                <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>
                  {pinnedNotice.postedBy} · {pinnedNotice.postedAt}
                </Text>
              </View>
            </Card>
          </>
        ) : null}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyState({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.empty}>
      <Feather name={icon} size={22} color={Palette.outline} />
      <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>{text}</Text>
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

// Tiny 7x7 QR-like glyph just for the hero art. Not a real QR.
const QR_DOTS = [
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 0, 0],
  [1, 0, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 1],
];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
  },

  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },

  // Hero
  hero: {
    borderRadius: Radius.xl,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.xs },
  heroArt: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
    backgroundColor: Palette.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroArtInner: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGlyph: { width: 56, height: 56, justifyContent: 'space-between' },
  qrRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qrCell: { width: 7, height: 7, borderRadius: 1.5 },

  // Quick actions — quiet monochrome row, single tone
  quickGrid: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: 4,
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Dues callout
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  dueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.warning,
  },
  payChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primary,
  },

  // Visitor rows
  visitorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },

  // Notice
  noticeMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  noticeFoot: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Palette.border },

  // Empty
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.lg,
  },
});
