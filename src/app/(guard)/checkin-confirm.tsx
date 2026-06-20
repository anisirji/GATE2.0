import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DEMO_SCANNED_PASS } from '@/data/mockData';

export default function CheckInConfirm() {
  const router = useRouter();
  const pass = DEMO_SCANNED_PASS;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="chevron-left" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Confirm entry</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Valid pass banner */}
        <View style={styles.validBanner}>
          <Feather name="check-circle" size={17} color={Palette.statusApprovedText} />
          <View style={{ flex: 1 }}>
            <Text style={[Type.titleSm, { color: Palette.statusApprovedText }]}>Valid pass</Text>
            <Text style={[Type.labelSm, { color: Palette.statusApprovedText, opacity: 0.85 }]}>
              ID {pass.passId}
            </Text>
          </View>
        </View>

        {/* Visitor hero */}
        <View style={styles.heroCard}>
          <Avatar name={pass.visitorName ?? '?'} size={80} />
          <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: Spacing.md, textAlign: 'center' }]} numberOfLines={1}>
            {pass.visitorName}
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm }}>
            <Pill label={pass.flat ?? '—'} bg={Palette.primaryContainer} color={Palette.onPrimaryContainer} />
            <Pill label={pass.purpose ?? 'Visit'} bg={Palette.surfaceContainerLow} color={Palette.onSurface} />
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          <DetailRow icon="user" label="Host" value={pass.hostName ?? '—'} />
          <DetailRow icon="home" label="Flat" value={pass.flat ?? '—'} />
          <DetailRow icon="clock" label="Valid until" value={pass.validUntil ?? '—'} last />
        </View>

        {/* Pre-entry checklist */}
        <View style={styles.checklist}>
          <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Before entry</Text>
          <View style={styles.checkListCard}>
            <CheckRow label="ID matches the name above" />
            <CheckRow label="Vehicle plate logged (if any)" />
            <CheckRow label="Visitor is alone or with expected party" last />
          </View>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View style={styles.actionBar}>
        <View style={{ flex: 1 }}>
          <Button
            label="Deny"
            variant="outline"
            icon="x"
            onPress={() => router.replace('/(guard)/(tabs)')}
          />
        </View>
        <View style={{ flex: 1.4 }}>
          <Button
            label="Approve entry"
            icon="check"
            onPress={() => router.replace('/(guard)/entry-approved')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={15} color={Palette.onSurfaceVariant} />
      </View>
      <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, flex: 1 }]}>{label}</Text>
      <Text style={[Type.titleSm, { color: Palette.onSurface }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function CheckRow({ label, last }: { label: string; last?: boolean }) {
  return (
    <View style={[styles.checkRow, !last && styles.checkRowBorder]}>
      <View style={styles.checkBox}>
        <Feather name="check" size={12} color={Palette.statusApprovedText} />
      </View>
      <Text style={[Type.bodySm, { color: Palette.onSurface, flex: 1 }]}>{label}</Text>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },

  validBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Palette.statusApprovedBg,
  },

  heroCard: {
    alignItems: 'center',
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    padding: Spacing.xl,
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
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  detailRowBorder: {
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

  checklist: { gap: Spacing.sm },
  checkListCard: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  checkRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Palette.statusApprovedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    backgroundColor: Palette.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
});
