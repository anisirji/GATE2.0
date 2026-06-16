import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

const FRAME_SIZE = 260;

export default function Scan() {
  const router = useRouter();
  const lineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineY, { toValue: FRAME_SIZE - 4, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.cubic) }),
        Animated.timing(lineY, { toValue: 0, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.cubic) }),
      ])
    ).start();
  }, [lineY]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
          <Feather name="chevron-left" size={22} color="#fff" />
        </Pressable>
        <Text style={[Type.titleLg, { color: '#fff' }]}>Scan pass</Text>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Feather name="zap-off" size={20} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.viewfinder}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: lineY }] }]} />
        </View>

        <Text style={[Type.titleMd, { color: '#fff', textAlign: 'center', marginTop: Spacing.xl }]}>
          Align the QR within the frame
        </Text>
        <Text style={[Type.bodySm, { color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: Spacing.xs }]}>
          We'll validate the pass against the resident's record.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.tipRow}>
          <Feather name="info" size={16} color={Palette.tertiary} />
          <Text style={[Type.labelMd, { color: 'rgba(255,255,255,0.85)' }]}>Demo mode — tap below to simulate.</Text>
        </View>
        <View style={{ gap: Spacing.sm }}>
          <Button label="Simulate valid scan" icon="check" variant="secondary" onPress={() => router.push('/(guard)/checkin-confirm')} />
          <Button label="Manual entry" icon="edit" variant="outline" onPress={() => router.push({ pathname: '/(guard)/visitor-details', params: { id: 'manual' } })} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1220' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  viewfinder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg },
  frame: { width: FRAME_SIZE, height: FRAME_SIZE, borderRadius: Radius.lg, position: 'relative', overflow: 'hidden' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: Palette.secondaryContainer },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: Radius.md },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: Radius.md },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: Radius.md },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: Radius.md },
  scanLine: { position: 'absolute', left: 8, right: 8, height: 2, backgroundColor: Palette.secondaryContainer, shadowColor: Palette.secondaryContainer, shadowOpacity: 0.8, shadowRadius: 8 },
  footer: { padding: Spacing.lg, gap: Spacing.md, backgroundColor: 'rgba(255,255,255,0.05)', borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, justifyContent: 'center' },
});
