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

const ENTRY_CODE = '482913';
const SOCIETY = 'Lakeview Heights';
const ADDRESS = 'Lakeview Heights, Gate 1, Whitefield Main Road, Bengaluru';

export default function InviteReceived() {
  const router = useRouter();
  const [accepted, setAccepted] = useState<null | boolean>(null);

  if (accepted === true) {
    return (
      <Result
        icon="check"
        bg={Palette.success}
        title="Entry card saved"
        body="Show this code at the gate. The guard can verify it without calling the host."
        onClose={() => router.back()}
      />
    );
  }
  if (accepted === false) {
    return (
      <Result
        icon="x"
        bg={Palette.error}
        title="Declined"
        body="No worries. The host will see that you cannot make it."
        onClose={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Entry card</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.hero}>
          <View style={styles.hostStack}>
            <Avatar name="Anika Sharma" color={Palette.primary} size={72} />
            <View style={[styles.linkDot, { backgroundColor: Palette.secondary }]}>
              <Feather name="send" size={14} color="#FFFFFF" />
            </View>
            <Avatar name="Priya" color={Palette.surfaceContainerHigh} size={72} />
          </View>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, textAlign: 'center' }]}>
            Anika invited you to visit{'\n'}{SOCIETY}
          </Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
            Keep this card handy and show the code at Gate 1.
          </Text>
        </View>

        <View style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <View>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>Digital entry card</Text>
              <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: 4 }]}>{SOCIETY}</Text>
            </View>
            <Pill label="Single entry" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
          </View>

          <View style={styles.codePanel}>
            <Text style={[Type.eyebrow, { color: Palette.primary }]}>Gate code</Text>
            <Text style={styles.codeText}>{ENTRY_CODE}</Text>
          </View>

          <Card padding="md" style={{ backgroundColor: Palette.surfaceContainerLow, gap: Spacing.md }}>
            <Detail icon="map-pin" label="Address" value={ADDRESS} />
            <Detail icon="calendar" label="When" value="Today, 4:30 PM - 6:00 PM" />
            <Detail icon="user" label="Host" value="Anika Sharma · Flat A-1204" />
            <Detail icon="info" label="Purpose" value="Birthday party" />
          </Card>

          <MiniMap />
        </View>

        <View style={{ gap: Spacing.sm }}>
          <Button label="Open map" icon="map-pin" variant="secondary" onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`).catch(() => {})} />
          <Button label="Save entry card" icon="check" onPress={() => setAccepted(true)} />
          <Button label="Cannot make it" variant="outline" onPress={() => setAccepted(false)} />
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
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{label}</Text>
        <Text style={[Type.bodyMd, { color: Palette.onSurface }]}>{value}</Text>
      </View>
    </View>
  );
}

function MiniMap() {
  return (
    <View style={styles.map}>
      <View style={styles.mapRoadH} />
      <View style={styles.mapRoadV} />
      <View style={styles.mapBlockA} />
      <View style={styles.mapBlockB} />
      <View style={styles.mapPin}>
        <Feather name="map-pin" size={18} color="#FFFFFF" />
      </View>
    </View>
  );
}

function Result({ icon, bg, title, body, onClose }: { icon: keyof typeof Feather.glyphMap; bg: string; title: string; body: string; onClose: () => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.resultWrap}>
        <View style={[styles.resultBadge, { backgroundColor: bg }]}>
          <Feather name={icon} size={48} color="#FFFFFF" />
        </View>
        <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>{title}</Text>
        <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>{body}</Text>
        <Button label="Done" onPress={onClose} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  hero: { alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.lg },
  hostStack: { flexDirection: 'row', alignItems: 'center', gap: -8 },
  linkDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: -8, zIndex: 2, borderWidth: 3, borderColor: Palette.surface },
  entryCard: {
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  entryHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.md },
  codePanel: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Palette.primaryContainer,
  },
  codeText: {
    ...Type.headlineLg,
    color: Palette.primary,
    letterSpacing: 6,
  },
  detailRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  detailIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  map: {
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E7EEEA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  mapRoadH: { position: 'absolute', left: 0, right: 0, top: 74, height: 18, backgroundColor: '#FFFFFF' },
  mapRoadV: { position: 'absolute', top: 0, bottom: 0, left: 150, width: 18, backgroundColor: '#FFFFFF' },
  mapBlockA: { position: 'absolute', left: 18, top: 18, width: 96, height: 42, borderRadius: 8, backgroundColor: '#C7E8DB' },
  mapBlockB: { position: 'absolute', right: 22, bottom: 22, width: 122, height: 48, borderRadius: 8, backgroundColor: '#C9D1F2' },
  mapPin: { position: 'absolute', left: '50%', top: 54, width: 42, height: 42, marginLeft: -21, borderRadius: 21, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  resultWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  resultBadge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
});
