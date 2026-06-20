import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_STAFF, type Staff } from '@/data/mockData';

type Filter = 'all' | Staff['status'];
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'on-duty', label: 'On duty' },
  { key: 'off-duty', label: 'Off duty' },
  { key: 'on-leave', label: 'On leave' },
];

const STATUS_STYLES: Record<Staff['status'], { label: string; bg: string; fg: string }> = {
  'on-duty': { label: 'On duty', bg: Palette.statusApprovedBg, fg: Palette.statusApprovedText },
  'off-duty': { label: 'Off duty', bg: Palette.surfaceContainerHigh, fg: Palette.onSurfaceVariant },
  'on-leave': { label: 'On leave', bg: Palette.warningContainer, fg: Palette.warning },
};

export default function StaffTracking() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(
    () => (filter === 'all' ? MOCK_STAFF : MOCK_STAFF.filter((s) => s.status === filter)),
    [filter]
  );

  const onDuty = MOCK_STAFF.filter((s) => s.status === 'on-duty').length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="x" size={22} color={Palette.onSurface} />
        </Pressable>
        <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Staff tracking</Text>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="plus" size={22} color={Palette.onSurface} />
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.sumCard, { backgroundColor: Palette.statusApprovedBg }]}>
          <Text style={[Type.headlineMd, { color: Palette.statusApprovedText }]}>{onDuty}</Text>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>On duty</Text>
        </View>
        <View style={[styles.sumCard, { backgroundColor: Palette.surfaceContainerHigh }]}>
          <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>{MOCK_STAFF.length}</Text>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Total staff</Text>
        </View>
        <View style={[styles.sumCard, { backgroundColor: Palette.warningContainer }]}>
          <Text style={[Type.headlineMd, { color: Palette.warning }]}>{MOCK_STAFF.filter((s) => s.status === 'on-leave').length}</Text>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>On leave</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
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
        {list.map((s) => {
          const st = STATUS_STYLES[s.status];
          return (
            <Card key={s.id} padding="md" accentColor={st.fg}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <Avatar name={s.name} color={s.avatarColor} size={48} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                    {s.name}
                  </Text>
                  <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>
                    {s.role} · {s.shift} shift
                  </Text>
                  <Text style={[Type.labelSm, { color: Palette.outline }]}>{s.phone}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
                  <Pill label={st.label} bg={st.bg} color={st.fg} />
                  <Pressable hitSlop={6} style={styles.callBtn}>
                    <Feather name="phone" size={16} color={Palette.secondary} />
                  </Pressable>
                </View>
              </View>
            </Card>
          );
        })}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingBottom: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  sumCard: { flex: 1, padding: Spacing.md, borderRadius: Radius.lg, alignItems: 'center', gap: 2 },
  filterScroll: { flexGrow: 0, flexShrink: 0 },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.tertiary },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  callBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.secondaryContainer, alignItems: 'center', justifyContent: 'center' },
});
