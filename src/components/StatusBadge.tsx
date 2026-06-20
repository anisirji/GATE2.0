import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import type { VisitorStatus } from '@/data/mockData';

const STATUS_MAP: Record<VisitorStatus, { label: string; bg: string; text: string; dot: string }> = {
  expected: { label: 'Expected', bg: Palette.statusExpectedBg, text: Palette.statusExpectedText, dot: Palette.statusExpectedText },
  'checked-in': { label: 'Inside', bg: Palette.statusApprovedBg, text: Palette.statusApprovedText, dot: Palette.statusApprovedText },
  'checked-out': { label: 'Departed', bg: Palette.surfaceContainer, text: Palette.onSurfaceVariant, dot: Palette.outline },
  denied: { label: 'Denied', bg: Palette.statusDeniedBg, text: Palette.statusDeniedText, dot: Palette.statusDeniedText },
};

export function StatusBadge({ status }: { status: VisitorStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[Type.labelSm, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

export function Pill({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[Type.labelSm, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
