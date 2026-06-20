import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const { setPendingPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const valid = /^\d{10}$/.test(phone);

  const onContinue = () => {
    if (!valid) {
      setError('Enter a 10‑digit mobile number.');
      return;
    }
    setError(null);
    setPendingPhone(`+91 ${phone.slice(0, 5)} ${phone.slice(5)}`);
    router.push('/(auth)/otp');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.mark}>
              <View style={styles.markInner} />
            </View>
            <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted, marginTop: Spacing.xl }]}>
              Civic Shield
            </Text>
            <Text style={[Type.headlineLg, styles.title]}>Welcome back</Text>
            <Text style={[Type.bodyMd, styles.subtitle]}>
              Sign in with your registered mobile number. We'll send a one‑time code.
            </Text>
          </View>

          {/* Demo helper — visible up front so testers know which number to use */}
          <View style={styles.demoBlock}>
            <View style={styles.demoHeader}>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>Demo · tap to autofill</Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>
                Each number signs in to a different role.
              </Text>
            </View>
            <View style={styles.demoRow}>
              <DemoCode
                label="Resident"
                code="9876543210"
                active={phone === '9876543210'}
                onPress={() => {
                  setPhone('9876543210');
                  if (error) setError(null);
                }}
              />
              <DemoCode
                label="Guard"
                code="9123456789"
                active={phone === '9123456789'}
                onPress={() => {
                  setPhone('9123456789');
                  if (error) setError(null);
                }}
              />
              <DemoCode
                label="Admin"
                code="9000011122"
                active={phone === '9000011122'}
                onPress={() => {
                  setPhone('9000011122');
                  if (error) setError(null);
                }}
              />
            </View>
          </View>

          <View style={styles.form}>
            <Input
              label="Mobile number"
              placeholder="98765 43210"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={(t) => {
                setPhone(t.replace(/\D/g, ''));
                if (error) setError(null);
              }}
              leftIcon="phone"
              error={error ?? undefined}
              hint="+91 · India"
              autoFocus
            />

            <Button label="Send OTP" onPress={onContinue} disabled={!valid} icon="arrow-right" iconPosition="right" />
          </View>

          <Pressable onPress={() => {}} style={styles.footerLink}>
            <Text style={[Type.labelMd, { color: Palette.primary }]}>New here? Request flat onboarding</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.xl, flexGrow: 1 },
  hero: { alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xxl },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  title: { color: Palette.onSurface, textAlign: 'center', marginTop: 4 },
  subtitle: { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg, marginTop: 4 },
  form: { gap: Spacing.lg, marginTop: Spacing.xl },
  footerLink: { marginTop: Spacing.xl, alignSelf: 'center' },
  demoBlock: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLow,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    gap: Spacing.md,
  },
  demoHeader: { gap: 2 },
  demoRow: { flexDirection: 'row', gap: Spacing.sm },
  demoCode: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    alignItems: 'center',
    gap: 4,
  },
  demoCodeActive: {
    backgroundColor: Palette.primaryContainer,
    borderColor: Palette.primary,
  },
});

function DemoCode({ label, code, active, onPress }: { label: string; code: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.demoCode, active && styles.demoCodeActive, pressed && { opacity: 0.9 }]}>
      <Text
        style={[
          Type.eyebrow,
          { color: active ? Palette.onPrimaryContainer : Palette.onSurfaceMuted },
        ]}>
        {label}
      </Text>
      <Text
        style={[
          Type.titleSm,
          { color: active ? Palette.onPrimaryContainer : Palette.onSurface, fontVariant: ['tabular-nums'] },
        ]}>
        {code}
      </Text>
    </Pressable>
  );
}
