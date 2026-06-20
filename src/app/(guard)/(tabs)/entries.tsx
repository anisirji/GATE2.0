import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_ENTRY_LOG, type EntryLog } from '@/data/mockData';

type Filter = 'all' | EntryLog['status'];

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'inside', label: 'Inside' },
  { key: 'departed', label: 'Departed' },
  { key: 'denied', label: 'Denied' },
];

export default function Entries() {
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(
    () => (filter === 'all' ? MOCK_ENTRY_LOG : MOCK_ENTRY_LOG.filter((e) => e.status === filter)),
    [filter]
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Entry log</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 4 }]}>
            Audit trail for the gate.
          </Text>
        </View>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="download" size={18} color={Palette.onSurface} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text
                style={[
                  Type.labelMd,
                  { color: active ? Palette.onPrimary : Palette.onSurfaceVariant },
                ]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {list.map((e) => (
          <Card key={e.id} variant="outlined" padding="md">
            <View style={styles.row}>
              <Avatar name={e.visitorName} size={40} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {e.visitorName}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]} numberOfLines={1}>
                  Flat {e.flat} · {e.purpose}
                </Text>
              </View>
              {labelFor(e.status)}
            </View>
            <View style={styles.metaRow}>
              <Meta icon="log-in" text={`In ${e.inAt}`} />
              {e.outAt ? <Meta icon="log-out" text={`Out ${e.outAt}`} /> : null}
              {e.vehicleNo ? <Meta icon="truck" text={e.vehicleNo} /> : null}
            </View>
          </Card>
        ))}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Meta({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.meta}>
      <Feather name={icon} size={11} color={Palette.onSurfaceMuted} />
      <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>{text}</Text>
    </View>
  );
}

function labelFor(status: EntryLog['status']) {
  if (status === 'inside')
    return <Pill label="Inside" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />;
  if (status === 'denied')
    return <Pill label="Denied" bg={Palette.statusDeniedBg} color={Palette.statusDeniedText} />;
  return <Pill label="Departed" bg={Palette.surfaceContainer} color={Palette.onSurfaceVariant} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
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
  filterScroll: { flexGrow: 0, flexShrink: 0 },
  filterRow: { paddingHorizontal: Layout.pageGutter, gap: Spacing.sm, paddingBottom: Spacing.lg },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  chipActive: { backgroundColor: Palette.onSurface, borderColor: Palette.onSurface },
  scroll: { paddingHorizontal: Layout.pageGutter, gap: Spacing.sm, paddingBottom: Layout.scrollBottom },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
