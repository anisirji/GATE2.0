import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useVisitors } from '@/lib/visitor-store';

export default function ResidentVisitorDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { visitors, getVisitorPass, extendVisitorValidity } = useVisitors();
  const [extended, setExtended] = useState(false);

  const visitor = useMemo(() => visitors.find((item) => item.id === id), [id, visitors]);
  const pass = visitor ? getVisitorPass(visitor.id) : null;

  if (!visitor || !pass) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.empty}>
          <Feather name="alert-circle" size={28} color={Palette.outline} />
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Visitor not found</Text>
          <Button label="Back" variant="outline" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const canExtend = visitor.status === 'checked-in';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="chevron-left" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Visitor details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card variant="outlined" padding="xl">
          <View style={styles.hero}>
            <Avatar name={visitor.name} size={88} />
            <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: Spacing.md }]} numberOfLines={1}>
              {visitor.name}
            </Text>
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: 4 }]}>{visitor.purpose}</Text>
            <View style={{ marginTop: Spacing.md }}>
              <StatusBadge status={visitor.status} />
            </View>
          </View>
        </Card>

        <View style={styles.detailList}>
          <Detail icon="credit-card" label="Pass ID" value={pass.passId} />
          <Detail icon="home" label="Flat" value={visitor.hostFlat ?? '-'} />
          <Detail icon="log-in" label="Issued" value={pass.issuedAt} />
          <Detail icon="clock" label="Valid until" value={pass.validUntil} valueColor={canExtend ? Palette.warning : undefined} />
          <Detail icon="clock" label="Validity" value={`${pass.validityMinutes} min`} />
          {visitor.phone ? <Detail icon="phone" label="Phone" value={visitor.phone} /> : null}
          {visitor.vehicleNo ? <Detail icon="truck" label="Vehicle" value={visitor.vehicleNo} /> : null}
          {pass.lastExtendedAt ? <Detail icon="refresh-cw" label="Last extended" value={pass.lastExtendedAt} /> : null}
        </View>

        {canExtend ? (
          <Card variant="sunken" padding="lg" style={{ gap: Spacing.md }}>
            <View style={styles.alertRow}>
              <View style={styles.alertIcon}>
                <Feather name={extended ? 'check' : 'bell'} size={17} color={extended ? Palette.statusApprovedText : Palette.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleSm, { color: Palette.onSurface }]}>
                  {extended ? 'Validity extended' : 'Validity alert active'}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: 2 }]}>
                  {extended
                    ? 'Resident, guard, and admin were notified.'
                    : 'This pass is close to expiry. Extend it to keep the visitor active.'}
                </Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <Button
                label="+30 min"
                size="sm"
                icon="plus"
                onPress={() => {
                  extendVisitorValidity(visitor.id, 30);
                  setExtended(true);
                }}
              />
              <Button
                label="+60 min"
                size="sm"
                icon="plus"
                variant="outline"
                onPress={() => {
                  extendVisitorValidity(visitor.id, 60);
                  setExtended(true);
                }}
              />
            </View>
          </Card>
        ) : null}

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
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: { flexDirection: 'row', gap: Spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: Spacing.lg },
});
