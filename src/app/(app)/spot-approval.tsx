import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

const MOCK_SPOT_REQUEST = {
  visitorName: 'Ramesh Plumber',
  purpose: 'Plumbing repair',
  flat: 'A-1204',
  guardName: 'Vinod Kumar',
  phone: '+919876543210',
  requestedAt: 'Just now',
  photoAttached: true,
};

export default function SpotApproval() {
  const router = useRouter();
  const { user } = useAuth();
  const [decision, setDecision] = useState<'allow' | 'deny' | null>(null);

  if (decision) {
    const allowed = decision === 'allow';
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.resultWrap}>
          <View style={[styles.resultBadge, { backgroundColor: allowed ? Palette.success : Palette.error }]}>
            <Feather name={allowed ? 'check' : 'x'} size={48} color="#FFFFFF" />
          </View>
          <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>
            {allowed ? 'Entry allowed' : 'Entry denied'}
          </Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
            The guard screen has been updated for {MOCK_SPOT_REQUEST.visitorName}.
          </Text>
          <Button label="Done" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Spot approval</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.hero}>
          <View style={styles.photo}>
            {MOCK_SPOT_REQUEST.photoAttached ? (
              <Avatar name={MOCK_SPOT_REQUEST.visitorName} color={Palette.primary} size={96} />
            ) : (
              <Feather name="user" size={42} color={Palette.onSurfaceVariant} />
            )}
          </View>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, textAlign: 'center' }]}>
            {MOCK_SPOT_REQUEST.visitorName} is at the gate
          </Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
            {MOCK_SPOT_REQUEST.guardName} is requesting approval for Flat {user?.flat ?? MOCK_SPOT_REQUEST.flat}.
          </Text>
          <View style={styles.pillRow}>
            <Pill label={MOCK_SPOT_REQUEST.requestedAt} bg={Palette.warningContainer} color={Palette.warning} />
            <Pill label="Photo attached" bg={Palette.primaryContainer} color={Palette.onPrimaryContainer} />
          </View>
        </View>

        <Card padding="lg" accentColor={Palette.primary} style={{ gap: Spacing.md }}>
          <Detail icon="home" label="Flat" value={user?.flat ?? MOCK_SPOT_REQUEST.flat} />
          <Detail icon="info" label="Purpose" value={MOCK_SPOT_REQUEST.purpose} />
          <Detail icon="shield" label="Guard" value={MOCK_SPOT_REQUEST.guardName} />
        </Card>

        <View style={styles.actionGrid}>
          <Button label="Allow" icon="check" onPress={() => setDecision('allow')} />
          <Button label="Deny" icon="x" variant="danger" onPress={() => setDecision('deny')} />
        </View>
        <Button
          label="Call visitor"
          icon="phone"
          variant="outline"
          onPress={() => Linking.openURL(`tel:${MOCK_SPOT_REQUEST.phone}`).catch(() => {})}
        />

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
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{label}</Text>
        <Text style={[Type.bodyMd, { color: Palette.onSurface }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  photo: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: 4,
    borderColor: Palette.surfaceContainerLowest,
  },
  pillRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  detailRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  detailIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  actionGrid: { flexDirection: 'row', gap: Spacing.sm },
  resultWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  resultBadge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
});
