import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

const LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const { pendingPhone, verifyOtp } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const onChange = (val: string, idx: number) => {
    const v = val.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (error) setError(null);
    if (v && idx < LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const onKeyPress = (e: { nativeEvent: { key: string } }, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const onVerify = () => {
    const otp = digits.join('');
    if (otp.length < 4) {
      setError('Enter the 6-digit code.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ok = verifyOtp(otp);
      setSubmitting(false);
      if (!ok) {
        setError('Invalid code. Try again.');
        return;
      }
      router.replace('/(auth)/role-select');
    }, 600);
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', padding: Spacing.sm }}>
            <Text style={[Type.labelMd, { color: Palette.primary }]}>← Change number</Text>
          </Pressable>

          <View style={styles.hero}>
            <Text style={[Type.headlineLg, { color: Palette.onSurface }]}>Enter the code</Text>
            <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
              We sent a 6-digit verification code to{'\n'}
              <Text style={{ color: Palette.onSurface, fontFamily: Type.labelMd.fontFamily }}>
                {pendingPhone ?? 'your phone'}
              </Text>
            </Text>
          </View>

          <View style={styles.row}>
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                value={d}
                onChangeText={(v) => onChange(v, i)}
                onKeyPress={(e) => onKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  styles.cell,
                  Type.headlineMd,
                  d ? { borderColor: Palette.primary, color: Palette.onSurface } : { color: Palette.onSurface },
                  error ? { borderColor: Palette.error } : null,
                ]}
              />
            ))}
          </View>

          {error ? <Text style={[Type.labelSm, { color: Palette.error, textAlign: 'center' }]}>{error}</Text> : null}

          <Button label="Verify & continue" onPress={onVerify} disabled={!isComplete || submitting} loading={submitting} />

          <View style={styles.resend}>
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>Didn't get the code?</Text>
            {resendIn > 0 ? (
              <Text style={[Type.labelMd, { color: Palette.outline }]}>Resend in {resendIn}s</Text>
            ) : (
              <Pressable onPress={() => setResendIn(30)}>
                <Text style={[Type.labelMd, { color: Palette.primary }]}>Resend code</Text>
              </Pressable>
            )}
          </View>

          <Text style={[Type.labelSm, { color: Palette.outline, textAlign: 'center', marginTop: Spacing.xxl }]}>
            Demo build · any 6-digit code works
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.xl, flexGrow: 1 },
  hero: { alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.outlineVariant,
    backgroundColor: Palette.surfaceContainerLowest,
    textAlign: 'center',
  },
  resend: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, alignItems: 'center' },
});
