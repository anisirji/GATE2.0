import { Feather } from '@expo/vector-icons';
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

const FRAME_SIZE = 240;

export default function Scan() {
  const router = useRouter();
  const lineY = useRef(new Animated.Value(0)).current;
  const [passId, setPassId] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineY, {
          toValue: FRAME_SIZE - 4,
          duration: 1600,
          useNativeDriver: true,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        }),
        Animated.timing(lineY, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        }),
      ])
    ).start();
  }, [lineY]);

  const onSimulate = () => router.push('/(guard)/checkin-confirm');

  const onSearch = () => {
    if (passId.trim().length < 4) return;
    router.push({ pathname: '/(guard)/checkin-confirm', params: { passId: passId.trim().toUpperCase() } });
  };

  const onBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    router.push({ pathname: '/(guard)/checkin-confirm', params: { passData: data } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="chevron-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={[Type.titleMd, { color: '#FFFFFF' }]}>Scan QR code</Text>
          <Pressable hitSlop={12} style={styles.iconBtn}>
            <Feather name="zap-off" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Viewfinder */}
        <View style={styles.viewfinder}>
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
            />
          ) : null}
          <View style={styles.vignette} pointerEvents="none" />
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: lineY }] }]} />
          </View>

          {permission?.granted ? (
            <>
              <Text style={[Type.titleSm, styles.viewfinderTitle]}>Align the QR within the frame</Text>
              <Text style={[Type.bodySm, styles.viewfinderHint]} numberOfLines={2}>
                We'll validate the pass against the resident's record.
              </Text>
            </>
          ) : (
            <View style={styles.permissionCard}>
              <Feather name="camera" size={24} color={Palette.onSurface} />
              <Text style={[Type.titleSm, { color: Palette.onSurface, textAlign: 'center' }]}>Camera permission needed</Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, textAlign: 'center' }]}>
                Allow camera access to scan DoorWy visitor passes.
              </Text>
              <Button label="Allow camera" icon="camera" fullWidth={false} onPress={requestPermission} />
            </View>
          )}

          {/* Demo simulate button — small, dismissable in prod */}
          <Pressable
            onPress={() => {
              setScanned(false);
              onSimulate();
            }}
            style={styles.demoBtn}>
            <Feather name="zap" size={12} color="#FFFFFF" />
            <Text style={[Type.labelSm, { color: '#FFFFFF' }]}>Demo: simulate a valid scan</Text>
          </Pressable>
        </View>

        {/* Manual entry sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={[Type.titleSm, { color: Palette.onSurface }]}>Or enter Pass ID manually</Text>
            <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
              Ask the visitor for the unique ID printed below their QR.
            </Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputWrap}>
              <Feather name="credit-card" size={16} color={Palette.onSurfaceVariant} />
              <TextInput
                value={passId}
                onChangeText={(t) => setPassId(t.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16))}
                placeholder="MSP-XXXXXX"
                placeholderTextColor={Palette.outline}
                autoCapitalize="characters"
                style={[Type.bodyMd, styles.input]}
                onSubmitEditing={onSearch}
              />
            </View>
            <Button
              label="Search"
              icon="search"
              size="md"
              fullWidth={false}
              disabled={passId.trim().length < 4}
              onPress={onSearch}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0C13' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Viewfinder
  viewfinder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, overflow: 'hidden' },
  vignette: {
    position: 'absolute',
    top: '15%',
    width: FRAME_SIZE + 48,
    height: FRAME_SIZE + 48,
    borderRadius: Radius.xl + 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: Radius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: Palette.primaryContainer },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: Radius.md },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: Radius.md },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: Radius.md },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: Radius.md },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 1.5,
    backgroundColor: Palette.primaryContainer,
    shadowColor: Palette.primary,
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  viewfinderTitle: { color: '#FFFFFF', textAlign: 'center', marginTop: Spacing.xxl },
  viewfinderHint: { color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginTop: 6, paddingHorizontal: Spacing.lg },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: Spacing.xl,
  },
  permissionCard: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
    top: '26%',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLowest,
  },

  // Manual entry sheet
  sheet: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderStrong,
    marginBottom: Spacing.sm,
  },
  sheetHeader: { gap: 2 },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'stretch' },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.borderStrong,
  },
  input: {
    flex: 1,
    color: Palette.onSurface,
    paddingVertical: Spacing.md,
    letterSpacing: 1,
  },
});
