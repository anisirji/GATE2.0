import { StyleSheet, Text, View } from 'react-native';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import type { VisitorStatus } from '@/data/mockData';

const STATUS_MAP: Record<VisitorStatus, { label: string; bg: string; text: string }> = {
  expected: { label: 'Expected', bg: Palette.statusExpectedBg, text: Palette.statusExpectedText },
  'checked-in': { label: 'Checked in', bg: Palette.statusApprovedBg, text: Palette.statusApprovedText },
  'checked-out': { label: 'Checked out', bg: Palette.surfaceContainerHigh, text: Palette.onSurfaceVariant },
  denied: { label: 'Denied', bg: Palette.statusDeniedBg, text: Palette.statusDeniedText },
};

export function StatusBadge({ status }: { status: VisitorStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
});
