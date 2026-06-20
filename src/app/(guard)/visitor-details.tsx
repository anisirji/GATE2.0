import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DEMO_SCANNED_PASS, MOCK_VISITORS } from '@/data/mockData';

export default function VisitorDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const visitor = useMemo(() => MOCK_VISITORS.find((v) => v.id === id), [id]);
  const isManual = id === 'manual' || !visitor;

  const [name, setName] = useState(visitor?.name ?? '');
  const [flat, setFlat] = useState(visitor?.hostFlat ?? '');
  const [vehicle, setVehicle] = useState(visitor?.vehicleNo ?? '');
  const [purpose, setPurpose] = useState(visitor?.purpose ?? '');

  const canApprove = !isManual || (name.trim() && flat.trim());

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="chevron-left" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Visitor details</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Visitor hero — large avatar, name, purpose pill */}
        <Card variant="outlined" padding="xl">
          <View style={styles.hero}>
            <Avatar name={visitor?.name ?? name ?? '?'} size={84} />
            <Text style={[Type.headlineMd, { color: Palette.onSurface, marginTop: Spacing.md, textAlign: 'center' }]} numberOfLines={1}>
              {visitor?.name ?? name ?? 'New visitor'}
            </Text>
            <View style={{ marginTop: Spacing.sm }}>
              <Pill
                label={visitor?.purpose ?? purpose ?? 'Visit'}
                bg={Palette.primaryContainer}
                color={Palette.onPrimaryContainer}
              />
            </View>
          </View>
        </Card>

        {/* Pre-approval banner */}
        {!isManual && visitor ? (
          <View style={styles.banner}>
            <Feather name="check-circle" size={17} color={Palette.statusApprovedText} />
            <View style={{ flex: 1 }}>
              <Text style={[Type.titleSm, { color: Palette.statusApprovedText }]}>
                Pre-approved by resident
              </Text>
              <Text style={[Type.labelSm, { color: Palette.statusApprovedText, opacity: 0.85 }]}>
                Flat {visitor.hostFlat}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.banner, { backgroundColor: Palette.warningContainer }]}>
            <Feather name="info" size={17} color={Palette.warning} />
            <View style={{ flex: 1 }}>
              <Text style={[Type.titleSm, { color: Palette.warning }]}>
                Not pre-approved
              </Text>
              <Text style={[Type.labelSm, { color: Palette.warning, opacity: 0.85 }]}>
                Confirm with the host before allowing entry.
              </Text>
            </View>
          </View>
        )}

        {/* Detail list — single hairline card with rows */}
        {!isManual && visitor ? (
          <View style={styles.detailList}>
            <DetailRow icon="home" label="Flat" value={`${visitor.hostFlat ?? '—'}`} />
            <DetailRow icon="clock" label="Time" value={visitor.arrivalTime} />
            {visitor.vehicleNo ? <DetailRow icon="truck" label="Vehicle" value={visitor.vehicleNo} /> : null}
            <DetailRow icon="credit-card" label="Pass ID" value={DEMO_SCANNED_PASS.passId} />
            <DetailRow
              icon="shield"
              label="Status"
              value="Valid"
              valueColor={Palette.statusApprovedText}
              valueIcon="check"
              last
            />
          </View>
        ) : (
          /* Manual entry — form fields in a single bordered card */
          <View style={styles.formCard}>
            <Field label="Visitor name" value={name} onChangeText={setName} placeholder="Full name" />
            <Field label="Visiting flat" value={flat} onChangeText={setFlat} placeholder="A-1204" />
            <Field label="Purpose" value={purpose} onChangeText={setPurpose} placeholder="Delivery, family visit…" />
            <Field
              label="Vehicle (optional)"
              value={vehicle}
              onChangeText={setVehicle}
              placeholder="KA 01 AB 1234"
              last
            />
          </View>
        )}

        {/* Notify chips */}
        <View style={styles.notifyBlock}>
          <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Notify host via</Text>
          <View style={styles.notifyRow}>
            <NotifyChip icon="bell" label="App ping" active />
            <NotifyChip icon="phone" label="Call" />
            <NotifyChip icon="message-square" label="SMS" />
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
            disabled={!canApprove}
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
  valueColor,
  valueIcon,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
  valueIcon?: keyof typeof Feather.glyphMap;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowBorder]}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={15} color={Palette.onSurfaceVariant} />
      </View>
      <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, flex: 1 }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {valueIcon ? <Feather name={valueIcon} size={14} color={valueColor ?? Palette.onSurface} /> : null}
        <Text style={[Type.titleSm, { color: valueColor ?? Palette.onSurface }]}>{value}</Text>
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  last,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.field, !last && styles.fieldBorder]}>
      <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.outline}
        style={[Type.bodyMd, styles.fieldInput]}
      />
    </View>
  );
}

function NotifyChip({
  icon,
  label,
  active,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  active?: boolean;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]}>
      <Feather name={icon} size={13} color={active ? Palette.onPrimary : Palette.onSurface} />
      <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{label}</Text>
    </Pressable>
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
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },

  hero: { alignItems: 'center' },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Palette.statusApprovedBg,
  },

  // Detail list
  detailList: {
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

  // Manual form
  formCard: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  field: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  fieldBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Palette.border },
  fieldInput: { color: Palette.onSurface, paddingVertical: 4 },

  // Notify
  notifyBlock: { gap: Spacing.sm },
  notifyRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  chipActive: { backgroundColor: Palette.onSurface, borderColor: Palette.onSurface },

  // Sticky action bar
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
