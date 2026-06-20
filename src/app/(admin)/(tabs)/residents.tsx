import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_RESIDENTS } from '@/data/mockData';

export default function Residents() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'owner' | 'tenant' | 'family'>('all');

  const grouped = useMemo(() => {
    const list = MOCK_RESIDENTS.filter((r) => {
      const matchQ = q.length === 0 || r.name.toLowerCase().includes(q.toLowerCase()) || r.flat.toLowerCase().includes(q.toLowerCase());
      const matchFilter = filter === 'all' || r.role === filter;
      return matchQ && matchFilter;
    });
    return list.reduce<Record<string, typeof list>>((acc, r) => {
      const k = r.flat.split('-')[0];
      acc[k] ??= [];
      acc[k].push(r);
      return acc;
    }, {});
  }, [q, filter]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Residents</Text>
        <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Directory by tower & flat.</Text>
      </View>

      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={Palette.onSurfaceVariant} />
        <TextInput
          placeholder="Search name or flat"
          placeholderTextColor={Palette.outline}
          value={q}
          onChangeText={setQ}
          style={[Type.bodyMd, { flex: 1, color: Palette.onSurface }]}
        />
        {q.length > 0 ? (
          <Pressable onPress={() => setQ('')} hitSlop={8}>
            <Feather name="x-circle" size={16} color={Palette.outline} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {(['all', 'owner', 'tenant', 'family'] as const).map((f) => {
          const active = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[Type.labelMd, { color: active ? '#fff' : Palette.onSurface, textTransform: 'capitalize' }]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {Object.keys(grouped).length === 0 ? (
          <View style={styles.empty}>
            <Feather name="users" size={28} color={Palette.outline} />
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>No residents match.</Text>
          </View>
        ) : null}

        {Object.entries(grouped).map(([tower, list]) => (
          <View key={tower} style={{ gap: Spacing.sm }}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.md }]}>
              Tower {tower} · {list.length} {list.length === 1 ? 'resident' : 'residents'}
            </Text>
            {list.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push({ pathname: '/(admin)/resident-detail', params: { id: r.id } })}>
                <Card padding="md">
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                    <Avatar name={r.name} color={r.avatarColor} size={42} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[Type.titleMd, { color: Palette.onSurface }]}>{r.name}</Text>
                      <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Flat {r.flat}</Text>
                    </View>
                    <Pill
                      label={r.role}
                      bg={r.role === 'owner' ? Palette.primaryContainer : r.role === 'tenant' ? Palette.warningContainer : Palette.secondaryContainer}
                      color={r.role === 'owner' ? Palette.primaryDeep : r.role === 'tenant' ? Palette.warning : Palette.onSecondaryContainer}
                    />
                    <Feather name="chevron-right" size={18} color={Palette.outline} />
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  header: { paddingHorizontal: Layout.pageGutter, paddingTop: Layout.pageTop, paddingBottom: Spacing.lg, gap: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginHorizontal: Layout.pageGutter, paddingHorizontal: Spacing.lg, height: 48, borderRadius: Radius.md, backgroundColor: Palette.surfaceContainerLowest, borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.border, marginBottom: Spacing.md },
  filterScroll: { flexGrow: 0, flexShrink: 0 },
  filterRow: { paddingHorizontal: Layout.pageGutter, gap: Spacing.sm, paddingBottom: Spacing.lg },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: 8, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLowest, borderWidth: StyleSheet.hairlineWidth, borderColor: Palette.border },
  chipActive: { backgroundColor: Palette.onSurface, borderColor: Palette.onSurface },
  scroll: { paddingHorizontal: Layout.pageGutter, gap: Spacing.sm, paddingBottom: Layout.scrollBottom },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.lg },
});
