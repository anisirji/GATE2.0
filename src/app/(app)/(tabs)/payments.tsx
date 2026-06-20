import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Eyebrow, SectionHeader } from '@/components/Section';
import { Layout, Palette, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { MOCK_PAYMENTS, type Payment } from '@/data/mockData';

export default function Payments() {
  const pending = MOCK_PAYMENTS.filter((p) => p.status === 'pending');
  const history = MOCK_PAYMENTS.filter((p) => p.status === 'paid');
  const dueTotal = pending.reduce((sum, p) => sum + p.amount, 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Payments</Text>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted, marginTop: 4 }]}>
            Dues, receipts, and history.
          </Text>
        </View>

        {/* Outstanding hero. Single committed primary surface. */}
        <View style={[styles.summary, Shadow.hero]}>
          <Eyebrow color="rgba(255,255,255,0.7)">Total outstanding</Eyebrow>
          <Text style={[Type.numXl, { color: Palette.onPrimary, marginTop: Spacing.sm }]}>
            ₹{dueTotal.toLocaleString('en-IN')}
          </Text>
          <Text style={[Type.bodySm, { color: 'rgba(255,255,255,0.78)', marginTop: 4 }]}>
            {pending.length} bill{pending.length === 1 ? '' : 's'} due
          </Text>
          <View style={{ marginTop: Spacing.lg }}>
            <Button label="Pay all" icon="zap" variant="secondary" size="md" fullWidth={false} />
          </View>
        </View>

        <SectionHeader title="Pending" />
        <View style={{ gap: Spacing.sm }}>
          {pending.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="check-circle" size={22} color={Palette.success} />
              <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>You're all caught up.</Text>
            </View>
          ) : (
            pending.map((p) => <PaymentItem key={p.id} payment={p} />)
          )}
        </View>

        <SectionHeader title="History" />
        <View style={{ gap: Spacing.sm }}>
          {history.map((p) => (
            <PaymentItem key={p.id} payment={p} />
          ))}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PaymentItem({ payment }: { payment: Payment }) {
  const isPaid = payment.status === 'paid';
  return (
    <Card variant="outlined" padding="md">
      <View style={styles.row}>
        <View
          style={[
            styles.itemIcon,
            { backgroundColor: isPaid ? Palette.successContainer : Palette.warningContainer },
          ]}>
          <Feather
            name={isPaid ? 'check' : 'clock'}
            size={17}
            color={isPaid ? Palette.success : Palette.warning}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
            {payment.label}
          </Text>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>
            {isPaid ? 'Paid' : `Due ${formatDate(payment.dueDate)}`}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>
            ₹{payment.amount.toLocaleString('en-IN')}
          </Text>
          {isPaid ? (
            <Text style={[Type.labelSm, { color: Palette.statusApprovedText }]}>Receipt</Text>
          ) : (
            <View style={styles.payChip}>
              <Text style={[Type.labelSm, { color: Palette.onPrimary }]}>Pay</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
  },
  header: { marginBottom: Spacing.xl },

  summary: {
    backgroundColor: Palette.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primary,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.lg,
  },
});
