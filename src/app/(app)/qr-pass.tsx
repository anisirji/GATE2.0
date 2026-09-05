import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Shadow, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

const DURATIONS = [
  { label: '1 hour', minutes: 60 },
  { label: '4 hours', minutes: 240 },
  { label: '1 day', minutes: 60 * 24 },
];

const CUSTOM_UNITS = [
  { label: 'Min', value: 'minutes', multiplier: 1 },
  { label: 'Hrs', value: 'hours', multiplier: 60 },
  { label: 'Days', value: 'days', multiplier: 60 * 24 },
] as const;

type CustomUnit = (typeof CUSTOM_UNITS)[number]['value'];
const MAX_VALIDITY_MINUTES = 30 * 24 * 60;

export default function QRPass() {
  const router = useRouter();
  const { user } = useAuth();
  const qrRef = useRef<{ toDataURL: (callback: (data: string) => void) => void } | null>(null);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [customValue, setCustomValue] = useState('');
  const [customUnit, setCustomUnit] = useState<CustomUnit>('hours');
  const [issuedAt] = useState(() => new Date());
  const [passId] = useState(() => 'MSP-' + Math.random().toString(36).slice(2, 8).toUpperCase());
  const [sharing, setSharing] = useState(false);

  const expiry = useMemo(
    () => buildExpiry(issuedAt, duration.minutes),
    [duration.minutes, issuedAt]
  );

  const payload = useMemo(() => {
    return JSON.stringify({
      passId,
      flatName: user?.flat,
      flat: user?.flat,
      host: user?.name,
      hostName: user?.name,
      society: user?.society,
      issuedAt: issuedAt.toISOString(),
      issued: `${formatTime(issuedAt)}, ${formatDate(issuedAt)}`,
      expiresAt: expiry.toISOString(),
      validUntil: `${formatTime(expiry)}, ${formatDate(expiry)}`,
      validity: duration.label,
    });
  }, [duration.label, expiry, issuedAt, passId, user]);

  const onShare = async () => {
    try {
      setSharing(true);
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing unavailable', 'Image sharing is not available on this device.');
        return;
      }

      const base64 = await qrToBase64(qrRef.current);
      const fileUri = `${FileSystem.cacheDirectory}${passId}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'image/png',
        dialogTitle: 'Share visitor QR pass',
        UTI: 'public.png',
      });
    } catch {
      Alert.alert('Could not share QR', 'Please try again after the QR code finishes loading.');
    } finally {
      setSharing(false);
    }
  };

  const updateCustomDuration = (value: string, unit: CustomUnit) => {
    const minutes = customMinutes(value, unit);
    if (!minutes) return;
    setDuration({
      label: formatDurationLabel(minutes),
      minutes,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
        style={styles.keyboard}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={20} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Visitor pass</Text>
          <Pressable onPress={onShare} hitSlop={12} style={styles.iconBtn}>
            <Feather name="share" size={18} color={Palette.onSurface} />
          </Pressable>
        </View>

        {/* Hero pass ticket */}
        <View style={[styles.ticket, Shadow.hero]}>
          <View style={styles.ticketTop}>
            <View style={styles.statusRow}>
              <View style={styles.liveDot} />
              <Text style={[Type.labelMd, { color: Palette.statusApprovedText }]}>Active</Text>
            </View>
            <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>One‑time entry</Text>
          </View>

          <View style={styles.qrWrap}>
            <QRCode
              getRef={(ref) => {
                qrRef.current = ref;
              }}
              value={payload}
              size={220}
              color={Palette.onSurface}
              backgroundColor="#FFFFFF"
              quietZone={18}
              ecl="H"
              logo={require('../../../assets/images/icon.png')}
              logoSize={42}
              logoBackgroundColor="#FFFFFF"
              logoBorderRadius={10}
              logoMargin={6}
            />
          </View>

          <Text style={[Type.headlineMd, { color: Palette.onSurface, textAlign: 'center' }]}>
            {user?.flat}
          </Text>
          <Text
            style={[Type.bodySm, { color: Palette.onSurfaceMuted, textAlign: 'center', marginTop: 2 }]}>
            {user?.society}
          </Text>
          <View style={styles.passIdPill}>
            <Text style={[Type.eyebrow, { color: Palette.primary }]}>ID {passId}</Text>
          </View>

          {/* Perforated divider */}
          <View style={styles.perfRow}>
            <View style={styles.perfNotchL} />
            <View style={styles.perfLine} />
            <View style={styles.perfNotchR} />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Issued</Text>
              <Text style={[Type.titleMd, { color: Palette.onSurface, marginTop: 4 }]}>
                {formatTime(issuedAt)}
              </Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
                {formatDate(issuedAt)}
              </Text>
            </View>
            <View style={styles.timeDivider} />
            <View style={styles.timeItem}>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>Valid until</Text>
              <Text style={[Type.titleMd, { color: Palette.primary, marginTop: 4 }]}>
                {formatTime(expiry)}
              </Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
                {formatDate(expiry)}
              </Text>
            </View>
          </View>
        </View>

        {/* Duration */}
        <View style={{ gap: Spacing.md, marginTop: Spacing.xl }}>
          <Text style={[Type.eyebrow, { color: Palette.onSurfaceMuted }]}>Valid for</Text>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => {
              const active = d.label === duration.label;
              return (
                <Pressable
                  key={d.label}
                  onPress={() => {
                    setDuration(d);
                    setCustomValue('');
                  }}
                  style={[styles.durationChip, active && styles.durationChipActive]}>
                  <Text
                    style={[
                      Type.labelMd,
                      { color: active ? Palette.onPrimary : Palette.onSurface },
                    ]}>
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.customDuration}>
            <View style={{ flex: 1 }}>
              <Text style={[Type.labelMd, { color: Palette.onSurface }]}>Custom validity</Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
                Enter a custom time, max 30 days
              </Text>
            </View>
            <TextInput
              value={customValue}
              onChangeText={(text) => {
                const clean = text.replace(/[^\d.]/g, '');
                const parts = clean.split('.');
                const normalized = (parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : clean).slice(0, 6);
                setCustomValue(normalized);
                updateCustomDuration(normalized, customUnit);
              }}
              keyboardType="decimal-pad"
              placeholder="2"
              placeholderTextColor={Palette.onSurfaceMuted}
              style={[Type.titleMd, styles.customInput]}
            />
            <View style={styles.unitGroup}>
              {CUSTOM_UNITS.map((unit) => {
                const active = unit.value === customUnit;
                return (
                  <Pressable
                    key={unit.value}
                    onPress={() => {
                      setCustomUnit(unit.value);
                      updateCustomDuration(customValue, unit.value);
                    }}
                    style={[styles.unitChip, active && styles.unitChipActive]}>
                    <Text style={[Type.labelSm, { color: active ? Palette.onPrimary : Palette.onSurfaceVariant }]}>
                      {unit.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tip}>
          <Feather name="shield" size={15} color={Palette.onSurfaceVariant} />
          <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, flex: 1 }]}>
            Show this QR at the gate. Your guard's scan automatically logs the visit.
          </Text>
        </View>

        <Button
          label="Share QR with guest"
          icon="send"
          loading={sharing}
          onPress={onShare}
          style={{ marginTop: Spacing.xl }}
        />

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function customMinutes(value: string, unit: CustomUnit) {
  const amount = Number(value);
  const cfg = CUSTOM_UNITS.find((u) => u.value === unit);
  if (!cfg || !Number.isFinite(amount) || amount <= 0) return 0;
  return Math.min(MAX_VALIDITY_MINUTES, Math.max(1, Math.round(amount * cfg.multiplier)));
}

function buildExpiry(issuedAt: Date, minutes: number) {
  const safeMinutes = Math.min(MAX_VALIDITY_MINUTES, Math.max(1, minutes));
  const expiry = new Date(issuedAt.getTime() + safeMinutes * 60 * 1000);
  if (Number.isNaN(expiry.getTime())) {
    return new Date(issuedAt.getTime() + DURATIONS[1].minutes * 60 * 1000);
  }
  return expiry;
}

function qrToBase64(ref: { toDataURL: (callback: (data: string) => void) => void } | null) {
  return new Promise<string>((resolve, reject) => {
    if (!ref) {
      reject(new Error('QR ref unavailable'));
      return;
    }
    ref.toDataURL(resolve);
  });
}

function formatDurationLabel(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr${hours === 1 ? '' : 's'}`;
  const days = hours / 24;
  return `${Number.isInteger(days) ? days : days.toFixed(1)} day${days === 1 ? '' : 's'}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  keyboard: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 180 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ticket
  ticket: {
    backgroundColor: Palette.surfaceContainerLowest,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.statusApprovedText,
  },

  qrWrap: {
    alignSelf: 'center',
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    marginBottom: Spacing.lg,
  },
  passIdPill: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryContainer,
  },

  // Perforated edge
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.xl,
  },
  perfNotchL: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.surface,
    marginLeft: -8,
  },
  perfNotchR: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.surface,
    marginRight: -8,
  },
  perfLine: {
    flex: 1,
    height: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.borderStrong,
    borderStyle: 'dashed',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  timeItem: { flex: 1, alignItems: 'center', gap: 0 },
  timeDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', backgroundColor: Palette.border, marginVertical: 4 },

  durationRow: { flexDirection: 'row', gap: Spacing.sm },
  durationChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  durationChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  customDuration: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  customInput: {
    width: 60,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 0,
    textAlign: 'center',
    color: Palette.primary,
    borderRadius: Radius.sm,
    backgroundColor: Palette.primaryContainer,
  },
  unitGroup: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
  },
  unitChip: {
    minHeight: 34,
    minWidth: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  unitChipActive: {
    backgroundColor: Palette.primary,
  },

  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Palette.surfaceContainerLow,
    borderRadius: Radius.md,
    marginTop: Spacing.xl,
  },
});
