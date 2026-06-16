import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_NOTICES, type Notice } from '@/data/mockData';

const CAT_STYLES: Record<Notice['category'], { bg: string; fg: string; label: string }> = {
  general: { bg: Palette.surfaceContainer, fg: Palette.onSurfaceVariant, label: 'General' },
  urgent: { bg: Palette.statusDeniedBg, fg: Palette.statusDeniedText, label: 'Urgent' },
  event: { bg: Palette.secondaryContainer, fg: Palette.onSecondaryContainer, label: 'Event' },
  maintenance: { bg: Palette.warningContainer, fg: Palette.warning, label: 'Maintenance' },
};

export default function Notices() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Notices</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>From management, events, and your neighbors.</Text>
        </View>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="search" size={20} color={Palette.onSurface} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {MOCK_NOTICES.map((n) => {
          const c = CAT_STYLES[n.category];
          return (
            <Card key={n.id} padding="lg" accentColor={c.fg}>
              <View style={styles.metaRow}>
                <Pill label={c.label} bg={c.bg} color={c.fg} />
                {n.pinned ? (
                  <View style={styles.pinned}>
                    <Feather name="bookmark" size={12} color={Palette.primary} />
                    <Text style={[Type.labelSm, { color: Palette.primary }]}>Pinned</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.sm }]}>{n.title}</Text>
              <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>{n.body}</Text>
              <Text style={[Type.labelSm, { color: Palette.outline, marginTop: Spacing.md }]}>
                {n.postedBy} · {n.postedAt}
              </Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: Spacing.md },
  iconBtn: { width: 44, height: 44, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pinned: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
});
