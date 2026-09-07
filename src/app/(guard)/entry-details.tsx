import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { type EntryLog, type Visitor } from '@/data/mockData';
import { useVisitors } from '@/lib/visitor-store';

export default function GuardEntryDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entryLog, visitors, getVisitorPass, notifications } = useVisitors();

  const entry = useMemo(() => entryLog.find((item) => item.id === id), [entryLog, id]);
  const visitor = entry ? visitorForEntry(entry, visitors) : undefined;
  const pass = visitor ? getVisitorPass(visitor.id) : undefined;
  const liveNotification = visitor ? notifications.find((item) => item.visitorId === visitor.id) : undefined;

  if (!entry) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.empty}>
          <Feather name="alert-circle" size={28} color={Palette.outline} />
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Entry not found</Text>
          <Button label="Back" variant="outline" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="chevron-left" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Entry details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" padding="xl">
          <View style={styles.hero}>
            <Avatar name={entry.visitorName} size={88} />
            <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: Spacing.md }]} numberOfLines={1}>
              {entry.visitorName}
            </Text>
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: 4 }]}>
              Flat {entry.flat} · {entry.purpose}
            </Text>
            <View style={{ marginTop: Spacing.md }}>{labelFor(entry.status)}</View>
          </View>
        </Card>

        {pass?.lastExtendedMinutes ? (
          <Card variant="sunken" padding="lg">
            <View style={styles.liveRow}>
              <View style={styles.liveIcon}>
                <Feather name="refresh-cw" size={17} color={Palette.statusApprovedText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleSm, { color: Palette.onSurface }]}>Validity extended</Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: 2 }]}>
                  Resident increased this visitor's time by {formatDuration(pass.lastExtendedMinutes)}. Valid until {pass.validUntil}.
                </Text>
              </View>
            </View>
          </Card>
        ) : liveNotification ? (
          <Card variant="sunken" padding="lg">
            <View style={styles.liveRow}>
              <View style={styles.liveIcon}>
                <Feather name="clock" size={17} color={Palette.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleSm, { color: Palette.onSurface }]}>{liveNotification.title}</Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: 2 }]}>
                  {liveNotification.body}
                </Text>
              </View>
            </View>
          </Card>
        ) : null}

        <View style={styles.detailList}>
          <Detail icon="home" label="Flat" value={entry.flat} />
          <Detail icon="info" label="Purpose" value={entry.purpose} />
          <Detail icon="log-in" label="In time" value={entry.inAt} />
          {entry.outAt ? <Detail icon="log-out" label="Out time" value={entry.outAt} /> : null}
          <Detail icon="shield" label="Verified by" value={entry.verifiedBy} />
          {entry.vehicleNo ? <Detail icon="truck" label="Vehicle" value={entry.vehicleNo} /> : null}
          {pass ? <Detail icon="credit-card" label="Pass ID" value={pass.passId} /> : null}
          {pass ? <Detail icon="clock" label="Issued" value={pass.issuedAt} /> : null}
          {pass ? <Detail icon="clock" label="Valid until" value={pass.validUntil} valueColor={entry.status === 'inside' ? Palette.warning : undefined} /> : null}
          {pass?.lastExtendedAt ? <Detail icon="refresh-cw" label="Last extended" value={pass.lastExtendedAt} /> : null}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={15} color={Palette.onSurfaceVariant} />
      </View>
      <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, flex: 1 }]}>{label}</Text>
      <Text style={[Type.titleSm, { color: valueColor ?? Palette.onSurface, flexShrink: 1, textAlign: 'right' }]}>
        {value}
      </Text>
    </View>
  );
}

function labelFor(status: EntryLog['status']) {
  if (status === 'inside') return <Pill label="Inside" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />;
  if (status === 'denied') return <Pill label="Denied" bg={Palette.statusDeniedBg} color={Palette.statusDeniedText} />;
  return <Pill label="Departed" bg={Palette.surfaceContainer} color={Palette.onSurfaceVariant} />;
}

function visitorForEntry(entry: EntryLog, visitors: Visitor[]) {
  const spotId = entry.id.startsWith('spot-') ? entry.id.replace(/^spot-/, '') : null;
  return visitors.find((visitor) => {
    if (spotId && visitor.id === spotId) return true;
    return (
      visitor.name === entry.visitorName &&
      visitor.hostFlat === entry.flat &&
      (!entry.vehicleNo || visitor.vehicleNo === entry.vehicleNo)
    );
  });
}

function formatDuration(minutes: number) {
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${minutes} min`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  hero: { alignItems: 'center' },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  liveIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailList: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  detailRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: Spacing.lg },
});
