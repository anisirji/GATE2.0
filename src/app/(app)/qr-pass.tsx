import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

const DURATIONS = [
  { label: '1 hour', minutes: 60 },
  { label: '4 hours', minutes: 240 },
  { label: '1 day', minutes: 60 * 24 },
];

export default function QRPass() {
  const router = useRouter();
  const { user } = useAuth();
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [issuedAt] = useState(() => new Date());

  const payload = useMemo(() => {
    const expiry = new Date(issuedAt.getTime() + duration.minutes * 60 * 1000);
    return JSON.stringify({
      flat: user?.flat,
      host: user?.name,
      society: user?.society,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiry.toISOString(),
      passId: 'MSP-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    });
  }, [user, duration, issuedAt]);

  const expiry = new Date(issuedAt.getTime() + duration.minutes * 60 * 1000);

  const onShare = async () => {
    await Share.share({
      title: 'Visitor pass',
      message: `Visitor pass for ${user?.flat}, valid until ${expiry.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Code: ${payload.slice(0, 24)}…`,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={20} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Visitor pass</Text>
          <Pressable onPress={onShare} hitSlop={12} style={styles.iconBtn}>
            <Feather name="share" size={18} color={Palette.onSurface} />
          </Pressable>
        </View>

        {/* Hero pass ticket */}
        <View style={[styles.ticket, Shadow.hero]}>
          <View style={styles.ticketTop}>
            <View style={styles.statusRow}>
              <View style={styles.liveDot} />
              <Text style={[Type.labelMd, { color: Palette.statusApprovedText }]}>Active</Text>
            </View>
            <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>One‑time entry</Text>
          </View>

          <View style={styles.qrWrap}>
            <QRCode
              value={payload}
              size={220}
              color={Palette.onSurface}
              backgroundColor="#FFFFFF"
              quietZone={0}
            />
          </View>

          <Text style={[Type.headlineMd, { color: Palette.onSurface, textAlign: 'center' }]}>
            {user?.flat}
          </Text>
          <Text
            style={[Type.bodySm, { color: Palette.onSurfaceMuted, textAlign: 'center', marginTop: 2 }]}>
            {user?.society}
          </Text>

          {/* Perforated divider */}
          <View style={styles.perfRow}>
            <View style={styles.perfNotchL} />
            <View style={styles.perfLine} />
            <View style={styles.perfNotchR} />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Issued</Text>
              <Text style={[Type.titleMd, { color: Palette.onSurface, marginTop: 4 }]}>
                {formatTime(issuedAt)}
              </Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>Valid until</Text>
              <Text style={[Type.titleMd, { color: Palette.primary, marginTop: 4 }]}>
                {formatTime(expiry)}
              </Text>
            </View>
          </View>
        </View>

        {/* Duration */}
        <View style={{ gap: Spacing.md, marginTop: Spacing.xl }}>
          <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Valid for</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => {
              const active = d.label === duration.label;
              return (
                <Pressable
                  key={d.label}
                  onPress={() => setDuration(d)}
                  style={[styles.durationChip, active && styles.durationChipActive]}>
                  <Text
                    style={[
                      Type.labelMd,
                      { color: active ? Palette.onPrimary : Palette.onSurface },
                    ]}>
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tip}>
          <Feather name="shield" size={15} color={Palette.onSurfaceVariant} />
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, flex: 1 }]}>
            Show this QR at the gate. Your guard's scan automatically logs the visit.
          </Text>
        </View>

        <Button label="Share with guest" icon="send" onPress={onShare} style={{ marginTop: Spacing.xl }} />

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ticket
  ticket: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.statusApprovedText,
  },

  qrWrap: {
    alignSelf: 'center',
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    marginBottom: Spacing.lg,
  },

  // Perforated edge
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.xl,
  },
  perfNotchL: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.surface,
    marginLeft: -8,
  },
  perfNotchR: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.surface,
    marginRight: -8,
  },
  perfLine: {
    flex: 1,
    height: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.borderStrong,
    borderStyle: 'dashed',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  timeItem: { flex: 1, alignItems: 'center', gap: 0 },
  timeDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: Palette.border, marginVertical: 4 },

  durationRow: { flexDirection: 'row', gap: Spacing.sm },
  durationChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  durationChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },

  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.md,
    marginTop: Spacing.xl,
  },
});
