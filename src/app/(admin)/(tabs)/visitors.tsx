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

export default function AdminVisitors() {
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(() => (filter === 'all' ? MOCK_ENTRY_LOG : MOCK_ENTRY_LOG.filter((e) => e.status === filter)), [filter]);

  const insideCount = MOCK_ENTRY_LOG.filter((e) => e.status === 'inside').length;
  const today = MOCK_ENTRY_LOG.length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Visitor management</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Society-wide gate activity.</Text>
        </View>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="download" size={20} color={Palette.onSurface} />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Inside now</Text>
          <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>{insideCount}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Today total</Text>
          <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>{today}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Pre-approved</Text>
          <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>3</Text>
        </View>
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
          <Card key={e.id} padding="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Avatar name={e.visitorName} color={avatarColor(e.status)} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {e.visitorName}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                  Flat {e.flat} · {e.purpose}
                </Text>
                <Text style={[Type.labelSm, { color: Palette.outline }]}>
                  {e.inAt}{e.outAt ? ` → ${e.outAt}` : ''}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Pill
                  label={statusLabel(e.status)}
                  bg={pillBg(e.status)}
                  color={pillFg(e.status)}
                />
                <Text style={[Type.labelSm, { color: Palette.outline }]}>{e.verifiedBy}</Text>
              </View>
            </View>
          </Card>
        ))}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function avatarColor(s: EntryLog['status']) {
  if (s === 'inside') return Palette.success;
  if (s === 'denied') return Palette.error;
  return Palette.outline;
}
function statusLabel(s: EntryLog['status']) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function pillBg(s: EntryLog['status']) {
  if (s === 'inside') return Palette.statusApprovedBg;
  if (s === 'denied') return Palette.statusDeniedBg;
  return Palette.surfaceContainerHigh;
}
function pillFg(s: EntryLog['status']) {
  if (s === 'inside') return Palette.statusApprovedText;
  if (s === 'denied') return Palette.statusDeniedText;
  return Palette.onSurfaceVariant;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: Spacing.md },
  iconBtn: { width: 44, height: 44, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  summaryCard: { flex: 1, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Palette.surfaceContainerLow, gap: 2 },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.tertiary },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
});
