import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Palette, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const { setPendingPhone } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const valid = /^\d{10}$/.test(phone);

  const onContinue = () => {
    if (!valid) {
      setError('Enter a 10-digit mobile number.');
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
          <View style={styles.hero}>
            <View style={styles.bigDot}>
              <Text style={[Type.displayLg, { color: Palette.onPrimary }]}>👋</Text>
            </View>
            <Text style={[Type.headlineLg, styles.title]}>Welcome back</Text>
            <Text style={[Type.bodyLg, styles.subtitle]}>
              Sign in with your registered mobile number. We'll send a one-time code.
            </Text>
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
              autoFocus
            />

            <View style={styles.cciiTip}>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>🇮🇳 +91 · India</Text>
            </View>

            <Button label="Send OTP" onPress={onContinue} disabled={!valid} icon="arrow-right" iconPosition="right" />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button label="I'm a guard" variant="outline" icon="shield" onPress={() => router.push('/(auth)/otp')} />
          </View>

          <Pressable onPress={() => {}} style={{ marginTop: Spacing.xl, alignSelf: 'center' }}>
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
  hero: { alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xxl },
  bigDot: { width: 88, height: 88, borderRadius: 28, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  title: { color: Palette.onSurface, textAlign: 'center' },
  subtitle: { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.md },
  form: { gap: Spacing.lg },
  cciiTip: { paddingHorizontal: Spacing.sm },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginVertical: Spacing.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: Palette.outlineVariant },
});
