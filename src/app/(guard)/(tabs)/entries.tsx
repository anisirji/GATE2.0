import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
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
  const list = useMemo(() => (filter === 'all' ? MOCK_ENTRY_LOG : MOCK_ENTRY_LOG.filter((e) => e.status === filter)), [filter]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Entry log</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Audit trail for the gate.</Text>
        </View>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="download" size={20} color={Palette.onSurface} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[Type.labelMd, { color: active ? '#fff' : Palette.onSurface }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {list.map((e) => (
          <Card key={e.id} padding="md" accentColor={accentFor(e.status)}>
            <View style={styles.row}>
              <Avatar name={e.visitorName} color={avatarFor(e.status)} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {e.visitorName}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                  Flat {e.flat} · {e.purpose}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
                {labelFor(e.status)}
              </View>
            </View>
            <View style={styles.metaRow}>
              <Feather name="log-in" size={13} color={Palette.onSurfaceVariant} />
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>In: {e.inAt}</Text>
              {e.outAt ? (
                <>
                  <Feather name="log-out" size={13} color={Palette.onSurfaceVariant} style={{ marginLeft: Spacing.md }} />
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Out: {e.outAt}</Text>
                </>
              ) : null}
              {e.vehicleNo ? (
                <>
                  <Feather name="truck" size={13} color={Palette.onSurfaceVariant} style={{ marginLeft: Spacing.md }} />
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{e.vehicleNo}</Text>
                </>
              ) : null}
            </View>
          </Card>
        ))}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function accentFor(status: EntryLog['status']) {
  if (status === 'inside') return Palette.statusApprovedText;
  if (status === 'denied') return Palette.statusDeniedText;
  return Palette.outline;
}
function avatarFor(status: EntryLog['status']) {
  if (status === 'inside') return Palette.success;
  if (status === 'denied') return Palette.error;
  return Palette.outline;
}
function labelFor(status: EntryLog['status']) {
  if (status === 'inside') return <Pill label="Inside" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />;
  if (status === 'denied') return <Pill label="Denied" bg={Palette.statusDeniedBg} color={Palette.statusDeniedText} />;
  return <Pill label="Departed" bg={Palette.surfaceContainerHigh} color={Palette.onSurfaceVariant} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: Spacing.md },
  iconBtn: { width: 44, height: 44, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.secondary },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm, flexWrap: 'wrap' },
});
