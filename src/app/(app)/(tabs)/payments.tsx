import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
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
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>Dues, receipts, and history in one place.</Text>
        </View>

        <Card padding="xl" style={styles.summary} elevated>
          <View>
            <Text style={[Type.labelMd, { color: Palette.onPrimary, opacity: 0.85 }]}>Total outstanding</Text>
            <Text style={[Type.displayLg, { color: Palette.onPrimary, fontSize: 40, lineHeight: 48 }]}>₹{dueTotal.toLocaleString('en-IN')}</Text>
            <Text style={[Type.bodySm, { color: Palette.onPrimary, opacity: 0.8, marginTop: Spacing.xs }]}>
              {pending.length} bill{pending.length === 1 ? '' : 's'} due
            </Text>
          </View>
          <Button label="Pay all" icon="zap" variant="secondary" size="sm" fullWidth={false} style={{ alignSelf: 'flex-start' }} />
        </Card>

        <SectionTitle text="Pending" />
        {pending.map((p) => (
          <PaymentItem key={p.id} payment={p} />
        ))}
        {pending.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="check-circle" size={28} color={Palette.success} />
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>You're all caught up.</Text>
          </View>
        ) : null}

        <SectionTitle text="History" />
        {history.map((p) => (
          <PaymentItem key={p.id} payment={p} />
        ))}

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.md, marginBottom: Spacing.xs }]}>{text}</Text>
  );
}

function PaymentItem({ payment }: { payment: Payment }) {
  const isPaid = payment.status === 'paid';
  return (
    <Card padding="md" style={styles.itemCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <View style={[styles.itemIcon, { backgroundColor: isPaid ? Palette.successContainer : Palette.warningContainer }]}>
          <Feather
            name={isPaid ? 'check' : 'clock'}
            size={20}
            color={isPaid ? Palette.success : Palette.warning}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]} numberOfLines={1}>
            {payment.label}
          </Text>
          <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>
            {isPaid ? 'Paid' : `Due ${formatDate(payment.dueDate)}`}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>₹{payment.amount.toLocaleString('en-IN')}</Text>
          {isPaid ? (
            <Pill label="Paid" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
          ) : (
            <Pill label="Pay" bg={Palette.primary} color={Palette.onPrimary} />
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
  scroll: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxxl },
  header: { gap: 4, marginBottom: Spacing.sm },
  summary: {
    backgroundColor: Palette.primary,
    gap: Spacing.lg,
  },
  itemCard: {},
  itemIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm, backgroundColor: Palette.surfaceContainerLow, borderRadius: Radius.lg },
});
