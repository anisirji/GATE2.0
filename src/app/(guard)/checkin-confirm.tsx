import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DEMO_SCANNED_PASS } from '@/data/mockData';

export default function CheckInConfirm() {
  const router = useRouter();
  const pass = DEMO_SCANNED_PASS;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Confirm entry</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.validBanner}>
          <Feather name="check-circle" size={20} color={Palette.statusApprovedText} />
          <Text style={[Type.labelMd, { color: Palette.statusApprovedText }]}>Valid pass · ID {pass.passId}</Text>
        </View>

        <Card padding="xl" elevated style={{ gap: Spacing.lg }}>
          <View style={styles.hostBlock}>
            <Avatar name={pass.visitorName ?? '?'} color={Palette.secondary} size={72} />
            <Text style={[Type.headlineMd, { color: Palette.onSurface }]} numberOfLines={1}>
              {pass.visitorName}
            </Text>
            <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
              <Pill label={pass.flat ?? '—'} bg={Palette.primaryContainer} color={Palette.primaryDeep} />
              <Pill label={pass.purpose ?? 'Visit'} bg={Palette.surfaceContainerHigh} color={Palette.onSurface} />
            </View>
          </View>

          <View style={styles.divider} />

          <Detail label="Host" value={pass.hostName ?? '—'} icon="user" />
          <Detail label="Flat" value={pass.flat ?? '—'} icon="home" />
          <Detail label="Valid until" value={pass.validUntil ?? '—'} icon="clock" />
        </Card>

        <View style={styles.checklist}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Before entry</Text>
          <ChecklistRow label="ID matches the name above" />
          <ChecklistRow label="Vehicle plate logged (if any)" />
          <ChecklistRow label="Visitor is alone or with expected party" />
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Button label="Allow entry" icon="check" onPress={() => router.replace('/(guard)/entry-approved')} />
          <Button label="Call resident first" icon="phone" variant="outline" />
          <Button label="Deny entry" variant="danger" icon="x" onPress={() => router.back()} />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={16} color={Palette.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{label}</Text>
        <Text style={[Type.bodyMd, { color: Palette.onSurface }]}>{value}</Text>
      </View>
    </View>
  );
}

function ChecklistRow({ label }: { label: string }) {
  return (
    <View style={styles.checkRow}>
      <Feather name="check-square" size={18} color={Palette.secondary} />
      <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  validBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Palette.statusApprovedBg },
  hostBlock: { alignItems: 'center', gap: Spacing.sm },
  divider: { height: 1, backgroundColor: Palette.surfaceContainerHigh },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  detailIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  checklist: { gap: Spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
