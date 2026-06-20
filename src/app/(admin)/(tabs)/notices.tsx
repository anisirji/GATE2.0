import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_NOTICES, type Notice } from '@/data/mockData';

const CAT_STYLES: Record<Notice['category'], { bg: string; fg: string; label: string }> = {
  general: { bg: Palette.surfaceContainer, fg: Palette.onSurfaceVariant, label: 'General' },
  urgent: { bg: Palette.statusDeniedBg, fg: Palette.statusDeniedText, label: 'Urgent' },
  event: { bg: Palette.secondaryContainer, fg: Palette.onSecondaryContainer, label: 'Event' },
  maintenance: { bg: Palette.warningContainer, fg: Palette.warning, label: 'Maintenance' },
};

export default function AdminNotices() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Notices</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Broadcast, schedule, and archive.</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
        <Button label="Broadcast new notice" icon="plus" onPress={() => router.push('/(admin)/notice-broadcast')} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {MOCK_NOTICES.map((n) => {
          const c = CAT_STYLES[n.category];
          return (
            <Card key={n.id} padding="lg" accentColor={c.fg}>
              <View style={styles.metaRow}>
                <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
                  <Pill label={c.label} bg={c.bg} color={c.fg} />
                  {n.pinned ? <Pill label="Pinned" bg={Palette.primaryContainer} color={Palette.primaryDeep} /> : null}
                </View>
                <Pressable hitSlop={8} style={styles.menu}>
                  <Feather name="more-vertical" size={18} color={Palette.outline} />
                </Pressable>
              </View>
              <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.sm }]}>{n.title}</Text>
              <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>{n.body}</Text>
              <View style={styles.footRow}>
                <Text style={[Type.labelSm, { color: Palette.outline }]}>
                  {n.postedBy} · {n.postedAt}
                </Text>
                <View style={{ flexDirection: 'row', gap: Spacing.lg }}>
                  <View style={styles.stat}>
                    <Feather name="eye" size={12} color={Palette.outline} />
                    <Text style={[Type.labelSm, { color: Palette.outline }]}>234</Text>
                  </View>
                  <View style={styles.stat}>
                    <Feather name="check" size={12} color={Palette.outline} />
                    <Text style={[Type.labelSm, { color: Palette.outline }]}>89% read</Text>
                  </View>
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
  header: { paddingHorizontal: Layout.pageGutter, paddingTop: Layout.pageTop, paddingBottom: Spacing.xl, gap: 4 },
  scroll: { paddingHorizontal: Layout.pageGutter, gap: Spacing.md, paddingBottom: Layout.scrollBottom },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menu: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill },
  footRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
});
