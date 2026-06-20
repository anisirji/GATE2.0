import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { SocietyFooter } from '@/components/SocietyFooter';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_ENTRY_LOG } from '@/data/mockData';
import { useAuth } from '@/lib/auth';

type Action = {
  key: string;
  label: string;
  hint: string;
  icon: keyof typeof Feather.glyphMap;
  route: any;
  primary?: boolean;
  danger?: boolean;
};

const ACTIONS: Action[] = [
  { key: 'scan', label: 'Scan QR', hint: 'Camera', icon: 'maximize', route: '/(guard)/(tabs)/scan', primary: true },
  { key: 'manual', label: 'Manual entry', hint: 'No pass', icon: 'edit-3', route: { pathname: '/(guard)/visitor-details', params: { id: 'manual' } } },
  { key: 'log', label: 'Visitor log', hint: 'Today', icon: 'list', route: '/(guard)/(tabs)/entries' },
  { key: 'sos', label: 'Emergency', hint: 'SOS', icon: 'alert-triangle', route: '/(guard)/(tabs)/notices', danger: true },
];

export default function GuardDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const insideNow = MOCK_ENTRY_LOG.filter((e) => e.status === 'inside');
  const previewAvatars = insideNow.slice(0, 4);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header — guard ID + shift */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <View style={styles.onShift}>
              <View style={styles.liveDot} />
              <Text style={[Type.labelSm, { color: Palette.statusApprovedText }]}>On shift</Text>
            </View>
            <Text style={[Type.headlineLgMobile, { color: Palette.onSurface, marginTop: 6 }]} numberOfLines={1}>
              {user?.name.split(' ')[0] ?? 'Guard'}
            </Text>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 2 }]} numberOfLines={1}>
              {user?.designation ?? 'Day shift'} · 08:00 to 20:00
            </Text>
          </View>
          <Avatar name={user?.name ?? 'Guard'} color={user?.avatarColor} size={44} ring />
        </View>

        {/* Four big action tiles */}
        <View style={styles.grid}>
          {ACTIONS.map((a) => (
            <ActionTile key={a.key} action={a} onPress={() => router.push(a.route)} />
          ))}
        </View>

        {/* Currently inside society — one situational-awareness card */}
        <Pressable
          onPress={() => router.push('/(guard)/(tabs)/entries')}
          style={({ pressed }) => [styles.insideCard, pressed && { transform: [{ scale: 0.995 }] }]}>
          <View style={{ flex: 1 }}>
            <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Inside society now</Text>
            <View style={styles.insideRow}>
              <Text style={[Type.numLg, { color: Palette.onSurface }]}>
                {String(insideNow.length).padStart(2, '0')}
              </Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>
                visitor{insideNow.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>

          <View style={styles.avatarStack}>
            {previewAvatars.map((e, i) => (
              <View
                key={e.id}
                style={[
                  styles.stackedAvatar,
                  { marginLeft: i === 0 ? 0 : -10, zIndex: previewAvatars.length - i },
                ]}>
                <Avatar name={e.visitorName} size={32} ring />
              </View>
            ))}
            {insideNow.length > previewAvatars.length ? (
              <View style={[styles.stackedAvatar, styles.moreBubble, { marginLeft: -10 }]}>
                <Text style={[Type.labelSm, { color: Palette.onSurface }]}>
                  +{insideNow.length - previewAvatars.length}
                </Text>
              </View>
            ) : null}
            <Feather name="chevron-right" size={18} color={Palette.outline} style={{ marginLeft: Spacing.sm }} />
          </View>
        </Pressable>

        {/* Decorative society scene footer */}
        <SocietyFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionTile({ action, onPress }: { action: Action; onPress: () => void }) {
  const primary = action.primary;
  const danger = action.danger;
  const bg = primary ? Palette.onSurface : Palette.surfaceContainerLowest;
  const ink = primary ? '#FFFFFF' : Palette.onSurface;
  const hint = primary ? 'rgba(255,255,255,0.65)' : Palette.onSurfaceMuted;
  const iconColor = danger ? Palette.error : primary ? '#FFFFFF' : Palette.onSurface;
  const iconBg = primary
    ? 'rgba(255,255,255,0.12)'
    : danger
      ? Palette.errorContainer
      : Palette.surfaceContainerLow;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: bg },
        !primary && styles.tileBorder,
        pressed && { transform: [{ scale: 0.99 }] },
      ]}>
      <View style={[styles.tileIcon, { backgroundColor: iconBg }]}>
        <Feather name={action.icon} size={26} color={iconColor} />
      </View>
      <View style={styles.tileText}>
        <Text style={[Type.titleMd, { color: danger ? Palette.error : ink }]} numberOfLines={1}>
          {action.label}
        </Text>
        <Text style={[Type.labelSm, { color: danger ? Palette.error : hint, marginTop: 2 }]} numberOfLines={1}>
          {action.hint}
        </Text>
      </View>
    </Pressable>
  );
}

const TILE_SIZE = '48%';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xxl },
  onShift: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.statusApprovedText },

  // 2x2 grid of big action tiles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  tile: {
    width: TILE_SIZE,
    flexGrow: 1,
    aspectRatio: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  tileBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  tileIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { gap: 0 },

  // "Inside society now" card
  insideCard: {
    marginTop: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  insideRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 6 },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  stackedAvatar: {
    borderWidth: 2,
    borderColor: Palette.surfaceContainerLowest,
    borderRadius: 18,
  },
  moreBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
