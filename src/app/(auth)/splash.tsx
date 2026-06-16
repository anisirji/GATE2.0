import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { useRef } from 'react';

import { Palette, Spacing, Type } from '@/constants/theme';

export default function Splash() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true, easing: Easing.out(Easing.back(1.4)) }),
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => router.replace('/(auth)/onboarding'), 1600);
    return () => clearTimeout(t);
  }, [router, scale, fade]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.badge, { transform: [{ scale }], opacity: fade }]}>
        <Feather name="shield" size={56} color="#fff" />
      </Animated.View>
      <Animated.View style={{ opacity: fade, alignItems: 'center', gap: Spacing.xs }}>
        <Text style={[Type.headlineLg, { color: Palette.onSurface }]}>MySociety</Text>
        <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant }]}>Civic Shield · Smart community</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  badge: {
    width: 112,
    height: 112,
    borderRadius: 28,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primaryDeep,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
});
