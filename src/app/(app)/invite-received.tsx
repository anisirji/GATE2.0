import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

export default function InviteReceived() {
  const router = useRouter();
  const [accepted, setAccepted] = useState<null | boolean>(null);

  if (accepted === true) {
    return (
      <Result
        icon="check"
        bg={Palette.success}
        title="You're on the list"
        body="The host has been notified. The guard will let you in on arrival."
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
        body="No worries — we'll let the host know you can't make it."
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
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>You're invited</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.hero}>
          <View style={styles.hostStack}>
            <Avatar name="Anika Sharma" color={Palette.primary} size={72} />
            <View style={[styles.linkDot, { backgroundColor: Palette.secondary }]}>
              <Feather name="plus" size={14} color="#fff" />
            </View>
            <Avatar name="You" color={Palette.surfaceContainerHigh} size={72} />
          </View>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, textAlign: 'center' }]}>
            Anika invited you to visit{'\n'}Lakeview Heights
          </Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
            Tap accept and the gate will be expecting you.
          </Text>
        </View>

        <Card padding="lg" accentColor={Palette.primary} style={{ gap: Spacing.md }}>
          <Detail icon="map-pin" label="Where" value="Lakeview Heights, Tower A · Flat 1204" />
          <Detail icon="calendar" label="When" value="Today, 4:30 PM – 6:00 PM" />
          <Detail icon="user" label="Host" value="Anika Sharma · +91 98765 43210" />
          <Detail icon="info" label="Purpose" value="Family visit" />
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs }}>
            <Pill label="Single entry" bg={Palette.surfaceContainerHigh} color={Palette.onSurface} />
            <Pill label="Verified" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
          </View>
        </Card>

        <Card padding="md" style={{ backgroundColor: Palette.surfaceContainerLow }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Feather name="shield" size={16} color={Palette.secondary} />
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, flex: 1 }]}>
              The pass auto-expires at 6:00 PM. Show this screen at the gate or just share your name.
            </Text>
          </View>
        </Card>

        <View style={{ gap: Spacing.sm }}>
          <Button label="Accept invitation" icon="check" onPress={() => setAccepted(true)} />
          <Button label="Can't make it" variant="outline" onPress={() => setAccepted(false)} />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' }}>
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

function Result({ icon, bg, title, body, onClose }: { icon: keyof typeof Feather.glyphMap; bg: string; title: string; body: string; onClose: () => void }) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.resultWrap}>
        <View style={[styles.resultBadge, { backgroundColor: bg }]}>
          <Feather name={icon} size={48} color="#fff" />
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
  detailIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  resultWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  resultBadge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
});
