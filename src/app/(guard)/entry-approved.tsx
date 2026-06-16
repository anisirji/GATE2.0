import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { DEMO_SCANNED_PASS } from '@/data/mockData';

export default function EntryApproved() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.5)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1400, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [scale, ring]);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.center}>
        <View style={styles.badgeWrap}>
          <Animated.View
            style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
          />
          <Animated.View style={[styles.badge, { transform: [{ scale }] }]}>
            <Feather name="check" size={56} color="#fff" />
          </Animated.View>
        </View>

        <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>Entry approved</Text>
        <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
          {DEMO_SCANNED_PASS.visitorName} can proceed to {DEMO_SCANNED_PASS.flat}.
        </Text>

        <Card padding="lg" style={{ width: '100%' }} accentColor={Palette.success}>
          <View style={styles.summaryRow}>
            <Feather name="check-circle" size={18} color={Palette.success} />
            <Text style={[Type.labelMd, { color: Palette.onSurface }]}>Logged at {currentTime()}</Text>
          </View>
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: 2 }]}>
            Resident has been notified. Pass marked single-use.
          </Text>
        </Card>

        <View style={{ width: '100%', gap: Spacing.sm }}>
          <Button label="Scan next visitor" icon="maximize" variant="secondary" onPress={() => router.replace('/(guard)/(tabs)/scan')} />
          <Button label="Done" variant="outline" onPress={() => router.replace('/(guard)/(tabs)')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function currentTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  center: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  badgeWrap: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 112, height: 112, borderRadius: 56, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.success, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  ring: { position: 'absolute', width: 112, height: 112, borderRadius: 56, borderWidth: 3, borderColor: Palette.success },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
});
// Radius is imported for consistency though unused here
const _r = Radius;
