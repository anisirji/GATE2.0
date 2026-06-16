import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_VISITORS } from '@/data/mockData';

export default function VisitorDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const visitor = useMemo(() => MOCK_VISITORS.find((v) => v.id === id), [id]);
  const isManual = id === 'manual' || !visitor;

  const [name, setName] = useState(visitor?.name ?? '');
  const [flat, setFlat] = useState(visitor?.hostFlat ?? '');
  const [vehicle, setVehicle] = useState(visitor?.vehicleNo ?? '');

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>{isManual ? 'Manual entry' : 'Visitor'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {visitor ? (
          <Card padding="xl" style={{ alignItems: 'center', gap: Spacing.sm }}>
            <Avatar name={visitor.name} color={Palette.warning} size={72} />
            <Text style={[Type.headlineMd, { color: Palette.onSurface }]} numberOfLines={1}>
              {visitor.name}
            </Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>
              {visitor.purpose} · {visitor.arrivalTime}
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
              <Pill label={visitor.hostFlat ?? '—'} bg={Palette.primaryContainer} color={Palette.primaryDeep} />
              <Pill label="Pre-approved" bg={Palette.statusExpectedBg} color={Palette.statusExpectedText} />
            </View>
          </Card>
        ) : null}

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Confirm details</Text>
          <Input label="Visitor name" value={name} onChangeText={setName} leftIcon="user" placeholder="e.g. Rohan Kapoor" />
          <Input label="Visiting flat" value={flat} onChangeText={setFlat} leftIcon="home" placeholder="A-1204" />
          <Input label="Vehicle number" value={vehicle} onChangeText={setVehicle} leftIcon="truck" placeholder="KA 01 AB 1234" />
        </Card>

        <Card padding="md">
          <Text style={[Type.titleMd, { color: Palette.onSurface, marginBottom: Spacing.sm }]}>Resident notification</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Pressable style={[styles.notifyChip, styles.notifyActive]}>
              <Feather name="bell" size={14} color="#fff" />
              <Text style={[Type.labelMd, { color: '#fff' }]}>Ping</Text>
            </Pressable>
            <Pressable style={styles.notifyChip}>
              <Feather name="phone" size={14} color={Palette.onSurface} />
              <Text style={[Type.labelMd, { color: Palette.onSurface }]}>Call</Text>
            </Pressable>
            <Pressable style={styles.notifyChip}>
              <Feather name="message-square" size={14} color={Palette.onSurface} />
              <Text style={[Type.labelMd, { color: Palette.onSurface }]}>SMS</Text>
            </Pressable>
          </View>
        </Card>

        <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
          <Button label="Allow entry" icon="check" onPress={() => router.replace('/(guard)/entry-approved')} />
          <Button label="Deny entry" variant="danger" icon="x" onPress={() => router.back()} />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep TextInput import alive (referenced through Input internally)
const _u = TextInput;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  notifyChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  notifyActive: { backgroundColor: Palette.secondary },
});
