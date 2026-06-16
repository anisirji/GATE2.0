import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill, StatusBadge } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
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
        <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Manage who's coming and who's been by.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Button label="Pre-approve" icon="user-plus" onPress={() => router.push('/(app)/guest-pass')} />
          <Button label="Generate QR" icon="maximize" variant="outline" onPress={() => router.push('/(app)/qr-pass')} />
        </View>

        {filtered.map((v) => (
          <Card key={v.id} padding="md" accentColor={accentColorFor(v.status)}>
            <View style={styles.row}>
              <Avatar name={v.name} color={avatarColorFor(v.status)} size={44} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
                  {v.name}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]} numberOfLines={1}>
                  {v.purpose}
                </Text>
                <Text style={[Type.labelSm, { color: Palette.outline }]}>{v.arrivalTime}</Text>
              </View>
              <StatusBadge status={v.status} />
            </View>
            {v.vehicleNo ? (
              <View style={styles.metaRow}>
                <Feather name="truck" size={14} color={Palette.onSurfaceVariant} />
                <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{v.vehicleNo}</Text>
              </View>
            ) : null}
          </Card>
        ))}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={28} color={Palette.outline} />
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>No visitors here yet.</Text>
            <Pill label="Tap pre-approve to invite one" bg={Palette.surfaceContainerLow} color={Palette.onSurfaceVariant} />
          </View>
        ) : null}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function accentColorFor(status: VisitorStatus) {
  switch (status) {
    case 'expected':
      return Palette.statusExpectedText;
    case 'checked-in':
      return Palette.statusApprovedText;
    case 'denied':
      return Palette.statusDeniedText;
    default:
      return Palette.outline;
  }
}

function avatarColorFor(status: VisitorStatus) {
  switch (status) {
    case 'checked-in':
      return Palette.success;
    case 'denied':
      return Palette.error;
    case 'expected':
      return Palette.warning;
    default:
      return Palette.outline;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: 4 },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.primary },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.lg },
});
