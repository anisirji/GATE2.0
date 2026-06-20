import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DEMO_SCANNED_PASS } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

export default function EntryApproved() {
  const router = useRouter();
  const { user } = useAuth();
  const scale = useRef(new Animated.Value(0.5)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const tick = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }),
      Animated.timing(tick, { toValue: 1, duration: 320, delay: 120, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [scale, ring, tick]);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });
  const tickOpacity = tick.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const flat = DEMO_SCANNED_PASS.flat ?? '—';
  const name = DEMO_SCANNED_PASS.visitorName ?? 'Visitor';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        {/* Hero — animated check */}
        <View style={styles.hero}>
          <View style={styles.badgeWrap}>
            <Animated.View
              style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
            />
            <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
              <Animated.View style={{ opacity: tickOpacity }}>
                <Feather name="check" size={56} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
          </View>

          <Text style={[Type.headlineLg, styles.title]}>Entry approved</Text>
          <Text style={[Type.bodyMd, styles.subtitle]} numberOfLines={2}>
            {name} has been granted entry to {flat}.
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          <DetailRow label="Entry time" value={currentTime()} />
          <DetailRow label="Guard" value={user?.designation?.split('·')[0]?.trim() ?? 'Gate 1'} />
          <DetailRow label="Pass ID" value={DEMO_SCANNED_PASS.passId} last mono />
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Feather name="bell" size={13} color={Palette.onSurfaceMuted} />
          <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, flex: 1 }]}>
            Resident has been notified. Pass marked single-use.
          </Text>
        </View>
      </View>

      {/* Footer actions */}
      <View style={styles.footer}>
        <Button
          label="View entry log"
          icon="list"
          onPress={() => router.replace('/(guard)/(tabs)/entries')}
        />
        <Button
          label="Back to dashboard"
          variant="outline"
          onPress={() => router.replace('/(guard)/(tabs)')}
        />
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  last,
  mono,
}: {
  label: string;
  value: string;
  last?: boolean;
  mono?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>{label}</Text>
      <Text
        style={[
          Type.titleSm,
          { color: Palette.onSurface },
          mono && { fontVariant: ['tabular-nums'], letterSpacing: 0.5 },
        ]}>
        {value}
      </Text>
    </View>
  );
}

function currentTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    gap: Spacing.xxl,
  },

  hero: { alignItems: 'center', gap: Spacing.md },
  badgeWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: Palette.statusApprovedText,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.statusApprovedText,
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  ring: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: Palette.statusApprovedText,
  },
  title: { color: Palette.onSurface, textAlign: 'center', marginTop: 4 },
  subtitle: {
    color: Palette.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: 6,
  },

  detailCard: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  detailRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
