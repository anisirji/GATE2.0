import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_NOTICES, type Notice } from '@/data/mockData';

const CAT_STYLES: Record<Notice['category'], { bg: string; fg: string; label: string }> = {
  general: { bg: Palette.surfaceContainer, fg: Palette.onSurfaceVariant, label: 'General' },
  urgent: { bg: Palette.errorContainer, fg: Palette.onErrorContainer, label: 'Urgent' },
  event: { bg: Palette.secondaryContainer, fg: Palette.onSecondaryContainer, label: 'Event' },
  maintenance: { bg: Palette.warningContainer, fg: Palette.onTertiaryContainer, label: 'Maintenance' },
};

export default function Notices() {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Notices</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 4 }]}>
            From management, events, neighbors.
          </Text>
        </View>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="search" size={18} color={Palette.onSurface} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {MOCK_NOTICES.map((n) => {
          const c = CAT_STYLES[n.category];
          return (
            <Card key={n.id} variant="outlined" padding="lg">
              <View style={styles.metaRow}>
                <Pill label={c.label} bg={c.bg} color={c.fg} />
                {n.pinned ? (
                  <View style={styles.pinned}>
                    <Feather name="bookmark" size={11} color={Palette.primary} />
                    <Text style={[Type.labelSm, { color: Palette.primary }]}>Pinned</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.md }]}>
                {n.title}
              </Text>
              <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>
                {n.body}
              </Text>
              <View style={styles.foot}>
                <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>
                  {n.postedBy} · {n.postedAt}
                </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: Layout.pageGutter, gap: Spacing.md, paddingBottom: Layout.scrollBottom },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pinned: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  foot: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
});
