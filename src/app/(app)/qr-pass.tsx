import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
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
      message: `Visitor pass for ${user?.flat} — valid until ${expiry.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Code: ${payload.slice(0, 24)}…`,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Visitor pass</Text>
          <Pressable onPress={onShare} hitSlop={12} style={styles.iconBtn}>
            <Feather name="share" size={20} color={Palette.onSurface} />
          </Pressable>
        </View>

        <Card padding="xl" style={styles.passCard} elevated>
          <View style={styles.passHead}>
            <Pill label="ACTIVE" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
            <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>One-time entry</Text>
          </View>

          <View style={styles.qrWrap}>
            <QRCode value={payload} size={220} color={Palette.primaryDeep} backgroundColor="#fff" />
          </View>

          <Text style={[Type.titleMd, { color: Palette.onSurface, textAlign: 'center' }]}>{user?.flat}</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>{user?.society}</Text>

          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Issued</Text>
              <Text style={[Type.labelMd, { color: Palette.onSurface }]}>{formatTime(issuedAt)}</Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Valid until</Text>
              <Text style={[Type.labelMd, { color: Palette.primary }]}>{formatTime(expiry)}</Text>
            </View>
          </View>
        </Card>

        <View style={{ gap: Spacing.sm }}>
          <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>Validity</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {DURATIONS.map((d) => {
              const active = d.label === duration.label;
              return (
                <Pressable
                  key={d.label}
                  onPress={() => setDuration(d)}
                  style={[styles.durationChip, active && styles.durationChipActive]}>
                  <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{d.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Card padding="md">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Feather name="shield" size={16} color={Palette.secondary} />
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>
              Show this QR at the gate. The guard's scan logs entry in your visitor list.
            </Text>
          </View>
        </Card>

        <Button label="Share with guest" icon="send" onPress={onShare} />

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
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  passCard: { gap: Spacing.lg, alignItems: 'stretch', backgroundColor: '#fff' },
  passHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qrWrap: { alignSelf: 'center', padding: Spacing.lg, backgroundColor: '#fff', borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.surfaceContainerHigh },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.md },
  timeItem: { flex: 1, alignItems: 'center', gap: 2 },
  timeDivider: { width: 1, alignSelf: 'stretch', backgroundColor: Palette.surfaceContainerHigh },
  durationChip: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderRadius: Radius.md, backgroundColor: Palette.surfaceContainerLow, borderWidth: 1, borderColor: 'transparent' },
  durationChipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
});
