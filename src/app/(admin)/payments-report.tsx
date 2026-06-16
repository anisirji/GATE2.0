import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_DUES, type DuesSummary } from '@/data/mockData';

type Filter = 'all' | DuesSummary['status'];
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
];

export default function PaymentsReport() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => (filter === 'all' ? MOCK_DUES : MOCK_DUES.filter((d) => d.status === filter)), [filter]);

  const totals = MOCK_DUES.reduce(
    (acc, d) => {
      if (d.status === 'paid') acc.collected += d.amount;
      else acc.outstanding += d.amount;
      return acc;
    },
    { collected: 0, outstanding: 0 }
  );
  const total = totals.collected + totals.outstanding;
  const pct = total > 0 ? Math.round((totals.collected / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="x" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Payments report</Text>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="download" size={20} color={Palette.onSurface} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Card padding="xl" style={{ backgroundColor: Palette.primary, gap: Spacing.md }} elevated>
          <Text style={[Type.labelMd, { color: '#fff', opacity: 0.85 }]}>Collected this cycle</Text>
          <Text style={[Type.displayLg, { color: '#fff', fontSize: 40, lineHeight: 48 }]}>
            ₹{totals.collected.toLocaleString('en-IN')}
          </Text>
          <Text style={[Type.bodySm, { color: '#fff', opacity: 0.85 }]}>
            of ₹{total.toLocaleString('en-IN')} · {pct}% complete
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </Card>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: Palette.statusApprovedBg }]}>
            <Text style={[Type.labelSm, { color: Palette.statusApprovedText }]}>Paid</Text>
            <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>
              {MOCK_DUES.filter((d) => d.status === 'paid').length}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Palette.warningContainer }]}>
            <Text style={[Type.labelSm, { color: Palette.warning }]}>Pending</Text>
            <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>
              {MOCK_DUES.filter((d) => d.status === 'pending').length}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Palette.statusDeniedBg }]}>
            <Text style={[Type.labelSm, { color: Palette.statusDeniedText }]}>Overdue</Text>
            <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>
              {MOCK_DUES.filter((d) => d.status === 'overdue').length}
            </Text>
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

        {list.map((d) => (
          <Card key={d.flat} padding="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Avatar name={d.resident} color={Palette.primary} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {d.resident}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Flat {d.flat}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]}>₹{d.amount.toLocaleString('en-IN')}</Text>
                <Pill
                  label={d.status}
                  bg={
                    d.status === 'paid'
                      ? Palette.statusApprovedBg
                      : d.status === 'pending'
                      ? Palette.warningContainer
                      : Palette.statusDeniedBg
                  }
                  color={
                    d.status === 'paid'
                      ? Palette.statusApprovedText
                      : d.status === 'pending'
                      ? Palette.warning
                      : Palette.statusDeniedText
                  }
                />
              </View>
            </View>
          </Card>
        ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingBottom: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: Radius.lg, alignItems: 'center', gap: 2 },
  filterRow: { gap: Spacing.sm, paddingVertical: Spacing.sm },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.tertiary },
});
