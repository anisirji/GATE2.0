import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_PAYMENTS } from '@/data/mockData';

type Method = 'upi' | 'card' | 'netbanking';
const METHODS: { key: Method; label: string; icon: keyof typeof Feather.glyphMap; hint: string }[] = [
  { key: 'upi', label: 'UPI', icon: 'smartphone', hint: 'GPay · PhonePe · Paytm' },
  { key: 'card', label: 'Card', icon: 'credit-card', hint: 'Debit or credit' },
  { key: 'netbanking', label: 'Netbanking', icon: 'globe', hint: 'All major banks' },
];

export default function Maintenance() {
  const router = useRouter();
  const pending = useMemo(() => MOCK_PAYMENTS.filter((p) => p.status === 'pending'), []);
  const [selected, setSelected] = useState(() => new Set(pending.map((p) => p.id)));
  const [method, setMethod] = useState<Method>('upi');
  const [stage, setStage] = useState<'review' | 'paying' | 'done'>('review');

  const total = pending.filter((p) => selected.has(p.id)).reduce((sum, p) => sum + p.amount, 0);
  const convenience = method === 'card' ? Math.round(total * 0.012) : 0;
  const grand = total + convenience;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (stage === 'done') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <Feather name="check" size={48} color="#fff" />
          </View>
          <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>Payment successful</Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
            ₹{grand.toLocaleString('en-IN')} paid via {method.toUpperCase()}.
          </Text>
          <Card padding="lg" accentColor={Palette.success} style={{ width: '100%' }}>
            <Detail label="Transaction ID" value={'MSP-PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase()} />
            <Detail label="Method" value={method.toUpperCase()} />
            <Detail label="Receipt" value="Mailed to your registered email" />
          </Card>
          <View style={{ width: '100%', gap: Spacing.sm }}>
            <Button label="Download receipt" icon="download" variant="outline" />
            <Button label="Done" onPress={() => router.replace('/(app)/(tabs)/payments')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Pay maintenance</Text>
          <View style={{ width: 40 }} />
        </View>

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Select bills</Text>
          {pending.map((p) => {
            const checked = selected.has(p.id);
            return (
              <Pressable key={p.id} onPress={() => toggle(p.id)} style={styles.billRow}>
                <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                  {checked ? <Feather name="check" size={14} color="#fff" /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]}>{p.label}</Text>
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>Due {p.dueDate}</Text>
                </View>
                <Text style={[Type.titleMd, { color: Palette.onSurface }]}>₹{p.amount.toLocaleString('en-IN')}</Text>
              </Pressable>
            );
          })}
        </Card>

        <Card padding="lg" style={{ gap: Spacing.md }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Pay with</Text>
          <View style={{ gap: Spacing.sm }}>
            {METHODS.map((m) => {
              const active = m.key === method;
              return (
                <Pressable key={m.key} onPress={() => setMethod(m.key)} style={[styles.methodRow, active && styles.methodActive]}>
                  <View style={[styles.methodIcon, active && { backgroundColor: Palette.primary }]}>
                    <Feather name={m.icon} size={18} color={active ? '#fff' : Palette.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]}>{m.label}</Text>
                    <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{m.hint}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioOn]}>{active ? <View style={styles.radioDot} /> : null}</View>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card padding="lg" style={{ gap: Spacing.sm }}>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Summary</Text>
          <SummaryRow label="Bills total" value={`₹${total.toLocaleString('en-IN')}`} />
          {convenience > 0 ? <SummaryRow label="Convenience fee" value={`₹${convenience}`} /> : null}
          <View style={styles.divider} />
          <SummaryRow label="Grand total" value={`₹${grand.toLocaleString('en-IN')}`} bold />
        </Card>

        <Button
          label={`Pay ₹${grand.toLocaleString('en-IN')}`}
          icon="lock"
          loading={stage === 'paying'}
          disabled={selected.size === 0}
          onPress={() => {
            setStage('paying');
            setTimeout(() => setStage('done'), 900);
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, justifyContent: 'center' }}>
          <Feather name="shield" size={14} color={Palette.outline} />
          <Text style={[Type.labelSm, { color: Palette.outline }]}>Encrypted via Razorpay (demo)</Text>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[bold ? Type.titleMd : Type.bodyMd, { color: bold ? Palette.onSurface : Palette.onSurfaceVariant }]}>{label}</Text>
      <Text style={[bold ? Type.titleMd : Type.bodyMd, { color: Palette.onSurface }]}>{value}</Text>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs }}>
      <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{label}</Text>
      <Text style={[Type.labelMd, { color: Palette.onSurface }]}>{value}</Text>
    </View>
  );
}

// Pill is imported for parity but unused here
const _u = Pill;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  billRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: Palette.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1, borderColor: Palette.surfaceContainerHigh },
  methodActive: { borderColor: Palette.primary, backgroundColor: Palette.surfaceContainerLow },
  methodIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: Palette.outlineVariant, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: Palette.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Palette.primary },
  divider: { height: 1, backgroundColor: Palette.surfaceContainerHigh, marginVertical: Spacing.xs },
  successWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  successBadge: { width: 96, height: 96, borderRadius: 48, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.success, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
});
