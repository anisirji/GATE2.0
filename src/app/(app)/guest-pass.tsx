import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

const PURPOSES = ['Family', 'Friend', 'Delivery', 'Service', 'Other'];
const ARRIVAL = ['Now', '1 hour', '4 hours', 'Today', 'Tomorrow'];

export default function GuestPass() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('Friend');
  const [arrival, setArrival] = useState('1 hour');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const valid = name.trim().length > 1 && (phone.length === 0 || phone.length === 10);

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <Feather name="check" size={48} color="#fff" />
          </View>
          <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>Guest pre-approved</Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
            We'll let the guard know to expect {name}. They can show their phone or just say your flat number.
          </Text>
          <Card padding="lg" style={{ width: '100%' }} accentColor={Palette.secondary}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>Pre-approval</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs }}>
              <Text style={[Type.titleMd, { color: Palette.onSurface }]}>{name}</Text>
              <Pill label={arrival} bg={Palette.secondaryContainer} color={Palette.onSecondaryContainer} />
            </View>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>
              {purpose}{phone ? ` · +91 ${phone.slice(0, 5)} ${phone.slice(5)}` : ''}
            </Text>
          </Card>
          <View style={{ width: '100%', gap: Spacing.sm }}>
            <Button label="Send invite link to guest" icon="send" variant="secondary" onPress={() => {}} />
            <Button label="Done" variant="outline" onPress={() => router.back()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Pre-approve guest</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Card padding="lg" style={{ backgroundColor: Palette.primaryContainer }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View style={[styles.headIcon, { backgroundColor: Palette.primary }]}>
                <Feather name="user-plus" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleMd, { color: Palette.onPrimaryContainer }]}>Add a guest in 20 seconds.</Text>
                <Text style={[Type.bodySm, { color: Palette.onPrimaryContainer, opacity: 0.85 }]}>
                  The guard sees them in their expected list — no calls needed.
                </Text>
              </View>
            </View>
          </Card>

          <Input label="Guest name" placeholder="e.g. Rohan Kapoor" value={name} onChangeText={setName} leftIcon="user" autoFocus />

          <Input
            label="Phone (optional)"
            placeholder="9876543210"
            keyboardType="number-pad"
            maxLength={10}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
            leftIcon="phone"
            hint="We'll send them an SMS with the pass."
          />

          <View>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginBottom: Spacing.sm }]}>Purpose</Text>
            <View style={styles.chipRow}>
              {PURPOSES.map((p) => {
                const active = p === purpose;
                return (
                  <Pressable key={p} onPress={() => setPurpose(p)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{p}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginBottom: Spacing.sm }]}>Arriving in</Text>
            <View style={styles.chipRow}>
              {ARRIVAL.map((a) => {
                const active = a === arrival;
                return (
                  <Pressable key={a} onPress={() => setArrival(a)} style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Button label="Pre-approve guest" icon="check" onPress={() => setStep('success')} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingBottom: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  headIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.primary },
  successWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  successBadge: { width: 96, height: 96, borderRadius: 48, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.success, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
});
