import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_VISITORS, type VisitorStatus } from '@/data/mockData';

type FilterKey = 'all' | VisitorStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'expected', label: 'Expected' },
  { key: 'checked-in', label: 'Inside' },
  { key: 'checked-out', label: 'Departed' },
  { key: 'denied', label: 'Denied' },
];

export default function Visitors() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? MOCK_VISITORS : MOCK_VISITORS.filter((v) => v.status === filter)),
    [filter]
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Visitors</Text>
        <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 4 }]}>
          Who's coming, who's been by.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button label="Pre‑approve" icon="user-plus" size="sm" onPress={() => router.push('/(app)/guest-pass')} />
        <Button
          label="Generate QR"
          icon="maximize"
          size="sm"
          variant="outline"
          onPress={() => router.push('/(app)/qr-pass')}
        />
      </View>

      {/* Filter row */}
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
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={24} color={Palette.outline} />
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>No visitors here.</Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>Tap Pre‑approve to invite one.</Text>
          </View>
        ) : (
          filtered.map((v) => (
            <Card key={v.id} variant="outlined" padding="md">
              <View style={styles.row}>
                <Avatar name={v.name} size={42} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                    {v.name}
                  </Text>
                  <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                    {v.purpose}
                  </Text>
                  <View style={styles.metaInline}>
                    <Feather name="clock" size={11} color={Palette.onSurfaceMuted} />
                    <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>{v.arrivalTime}</Text>
                    {v.vehicleNo ? (
                      <>
                        <View style={styles.metaDot} />
                        <Feather name="truck" size={11} color={Palette.onSurfaceMuted} />
                        <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>{v.vehicleNo}</Text>
                      </>
                    ) : null}
                  </View>
                </View>
                <StatusBadge status={v.status} />
              </View>
            </Card>
          ))
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Spacing.xl,
  },
  actions: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Layout.pageGutter, marginBottom: Spacing.lg },
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
  metaInline: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Palette.outlineVariant, marginHorizontal: 6 },
  empty: {
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.lg,
  },
});
