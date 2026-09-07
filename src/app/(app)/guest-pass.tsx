import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

const VISITOR_TYPES = [
  { label: 'Guest', icon: 'user' },
  { label: 'Cab', icon: 'truck' },
  { label: 'Delivery', icon: 'package' },
  { label: 'Help', icon: 'tool' },
] as const;

const QUICK_TIMES = [
  { label: 'Now', date: 'Today', time: 'Now' },
  { label: 'Today 6 PM', date: 'Today', time: '6:00 PM' },
  { label: 'Tomorrow 10 AM', date: 'Tomorrow', time: '10:00 AM' },
] as const;

const PHONEBOOK = [
  { id: 'c1', name: 'Priya Mehta', phone: '9876543210' },
  { id: 'c2', name: 'Rohan Kapoor', phone: '9822011334' },
  { id: 'c3', name: 'Aarav Shah', phone: '9811122233' },
  { id: 'c4', name: 'Neha Iyer', phone: '9900011122' },
  { id: 'c5', name: 'Kunal Rao', phone: '9988776655' },
  { id: 'c6', name: 'Sneha Pillai', phone: '9765432109' },
] as const;

const SOCIETY_ADDRESS = 'Lakeview Heights, Gate 1, Whitefield Main Road, Bengaluru';
type VisitorType = (typeof VISITOR_TYPES)[number]['label'];
type Mode = 'preapprove' | 'invite';

export default function GuestPass() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('preapprove');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitorType, setVisitorType] = useState<VisitorType>('Guest');
  const [expectedDate, setExpectedDate] = useState('Tomorrow');
  const [expectedTime, setExpectedTime] = useState('10:00 AM');
  const [vehicle, setVehicle] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [visitCode, setVisitCode] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const selectedGuests = useMemo(
    () => PHONEBOOK.filter((contact) => selectedContacts.includes(contact.id)),
    [selectedContacts]
  );
  const hostName = user?.name ?? 'Your host';
  const flat = user?.flat ?? 'A-1204';
  const society = user?.society ?? 'Lakeview Heights';

  const validPreApproval =
    name.trim().length > 1 &&
    expectedDate.trim().length > 1 &&
    expectedTime.trim().length > 1 &&
    (phone.length === 0 || phone.length === 10);
  const validInvitation = selectedContacts.length > 0 && expectedDate.trim().length > 1 && expectedTime.trim().length > 1;
  const canSubmit = mode === 'invite' ? validInvitation : validPreApproval;

  const createEntry = () => {
    if (!canSubmit) return;
    setVisitCode(generateVisitCode());
    setStep('success');
  };

  const shareInvite = (channel: 'sms' | 'whatsapp' | 'share') => {
    const guestLine =
      mode === 'invite'
        ? `${selectedGuests.length} guest${selectedGuests.length === 1 ? '' : 's'}`
        : name;
    const message = buildInviteMessage({
      code: visitCode,
      guestLine,
      hostName,
      flat,
      society,
      address: SOCIETY_ADDRESS,
      when: `${expectedDate} at ${expectedTime}`,
    });
    if (channel === 'sms') {
      const firstPhone = mode === 'invite' ? selectedGuests[0]?.phone : phone;
      const separator = Platform.OS === 'ios' ? '&' : '?';
      Linking.openURL(`sms:${firstPhone ?? ''}${separator}body=${encodeURIComponent(message)}`).catch(() => {});
      return;
    }
    if (channel === 'whatsapp') {
      Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`).catch(() => Share.share({ message }));
      return;
    }
    Share.share({ message });
  };

  if (step === 'success') {
    const guestCount = mode === 'invite' ? selectedGuests.length : 1;
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.successScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.successBadge}>
            <Feather name="check" size={44} color="#FFFFFF" />
          </View>
          <Text style={[Type.headlineLg, styles.centerTitle]}>
            {mode === 'invite' ? 'Invitations ready' : 'Visitor pre-approved'}
          </Text>
          <Text style={[Type.bodyLg, styles.centerBody]}>
            {guestCount} digital entry card{guestCount === 1 ? '' : 's'} created with a gate code, society address, and map.
          </Text>

          <View style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View>
                <Text style={[Type.eyebrow, { color: Palette.primary }]}>Digital entry card</Text>
                <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: 4 }]}>{society}</Text>
              </View>
              <Pill label="Single entry" bg={Palette.statusApprovedBg} color={Palette.statusApprovedText} />
            </View>
            <View style={styles.codeCard}>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>Gate code</Text>
              <Text style={styles.codeText}>{visitCode}</Text>
            </View>
            <Detail icon="map-pin" label="Address" value={SOCIETY_ADDRESS} />
            <Detail icon="calendar" label="When" value={`${expectedDate} at ${expectedTime}`} />
            <Detail icon="home" label="Host" value={`${hostName} · Flat ${flat}`} />
            <MiniMap />
          </View>

          <Card padding="lg" style={{ width: '100%' }} accentColor={Palette.secondary}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>
              {mode === 'invite' ? 'Selected guests' : 'Pre-approval'}
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[Type.titleMd, { color: Palette.onSurface }]}>
                {mode === 'invite' ? `${selectedGuests.length} invitees` : name}
              </Text>
              <Pill label={visitorType} bg={Palette.secondaryContainer} color={Palette.onSecondaryContainer} />
            </View>
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]}>
              Expected {expectedDate} at {expectedTime}
              {vehicle ? ` · ${vehicle}` : ''}
            </Text>
          </Card>

          <View style={{ width: '100%', gap: Spacing.sm }}>
            <View style={styles.shareRow}>
              <Button label="SMS" icon="message-square" fullWidth={false} style={{ flex: 1 }} onPress={() => shareInvite('sms')} />
              <Button label="WhatsApp" icon="send" variant="secondary" fullWidth={false} style={{ flex: 1 }} onPress={() => shareInvite('whatsapp')} />
            </View>
            <Button label="Share entry card" icon="share-2" variant="outline" onPress={() => shareInvite('share')} />
            <Button label="Done" variant="ghost" onPress={() => router.back()} />
          </View>
        </ScrollView>
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
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Pre-approve</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.modeSwitch}>
            <ModeTab label="Pre-approval" active={mode === 'preapprove'} onPress={() => setMode('preapprove')} />
            <ModeTab label="Invitations" active={mode === 'invite'} onPress={() => setMode('invite')} />
          </View>

          <Card padding="lg" style={{ backgroundColor: Palette.primaryContainer }}>
            <View style={styles.headerCardRow}>
              <View style={[styles.headIcon, { backgroundColor: Palette.primary }]}>
                <Feather name={mode === 'invite' ? 'users' : 'user-plus'} size={20} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Type.titleMd, { color: Palette.onPrimaryContainer }]}>
                  {mode === 'invite' ? 'Invite many guests fast.' : 'Pre-approve in 20 seconds.'}
                </Text>
                <Text style={[Type.bodySm, { color: Palette.onPrimaryContainer, opacity: 0.85 }]}>
                  {mode === 'invite'
                    ? 'Pick contacts and send digital entry cards by SMS or WhatsApp.'
                    : 'Generate a visit code for guests, cabs, deliveries, and home help.'}
                </Text>
              </View>
            </View>
          </Card>

          {mode === 'invite' ? (
            <View>
              <Text style={[Type.labelMd, styles.fieldLabel]}>Phonebook contacts</Text>
              <View style={styles.contactList}>
                {PHONEBOOK.map((contact) => {
                  const active = selectedContacts.includes(contact.id);
                  return (
                    <Pressable
                      key={contact.id}
                      onPress={() => {
                        setSelectedContacts((current) =>
                          active ? current.filter((id) => id !== contact.id) : [...current, contact.id]
                        );
                      }}
                      style={[styles.contactRow, active && styles.contactRowActive]}>
                      <View style={styles.contactAvatar}>
                        <Text style={[Type.labelMd, { color: Palette.onSurface }]}>{contact.name.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[Type.titleSm, { color: Palette.onSurface }]}>{contact.name}</Text>
                        <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted }]}>+91 {contact.phone}</Text>
                      </View>
                      <Feather name={active ? 'check-circle' : 'circle'} size={20} color={active ? Palette.primary : Palette.outline} />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : (
            <>
              <View>
                <Text style={[Type.labelMd, styles.fieldLabel]}>Visitor type</Text>
                <View style={styles.typeGrid}>
                  {VISITOR_TYPES.map((type) => {
                    const active = type.label === visitorType;
                    return (
                      <Pressable key={type.label} onPress={() => setVisitorType(type.label)} style={[styles.typeChip, active && styles.typeChipActive]}>
                        <Feather name={type.icon} size={17} color={active ? Palette.onPrimary : Palette.onSurfaceVariant} />
                        <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{type.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Input label="Visitor name" placeholder="e.g. Ramesh Plumber" value={name} onChangeText={setName} leftIcon="user" autoFocus />
              <Input
                label="Phone (optional)"
                placeholder="9876543210"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
                leftIcon="phone"
                hint="Optional, useful if the guard needs to call them."
              />
            </>
          )}

          <View>
            <Text style={[Type.labelMd, styles.fieldLabel]}>Expected arrival</Text>
            <View style={styles.chipRow}>
              {QUICK_TIMES.map((option) => {
                const active = expectedDate === option.date && expectedTime === option.time;
                return (
                  <Pressable
                    key={option.label}
                    onPress={() => {
                      setExpectedDate(option.date);
                      setExpectedTime(option.time);
                    }}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurface }]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.dateTimeRow}>
            <Input label="Date" placeholder="Tuesday" value={expectedDate} onChangeText={setExpectedDate} leftIcon="calendar" containerStyle={{ flex: 1 }} />
            <Input label="Time" placeholder="10:00 AM" value={expectedTime} onChangeText={setExpectedTime} leftIcon="clock" containerStyle={{ flex: 1 }} />
          </View>

          <Input
            label="Vehicle number (optional)"
            placeholder="KA 05 AB 1234"
            value={vehicle}
            onChangeText={(text) => setVehicle(text.toUpperCase())}
            leftIcon="truck"
          />

          <Button
            label={mode === 'invite' ? `Create ${selectedContacts.length || ''} invitation${selectedContacts.length === 1 ? '' : 's'}` : 'Generate visit code'}
            icon={mode === 'invite' ? 'send' : 'key'}
            onPress={createEntry}
            disabled={!canSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeTab, active && styles.modeTabActive]}>
      <Text style={[Type.labelMd, { color: active ? Palette.onPrimary : Palette.onSurfaceVariant }]}>{label}</Text>
    </Pressable>
  );
}

function Detail({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={15} color={Palette.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>{label}</Text>
        <Text style={[Type.bodyMd, { color: Palette.onSurface }]}>{value}</Text>
      </View>
    </View>
  );
}

function MiniMap() {
  return (
    <View style={styles.map}>
      <View style={styles.mapRoadH} />
      <View style={styles.mapRoadV} />
      <View style={styles.mapBlockA} />
      <View style={styles.mapBlockB} />
      <View style={styles.mapPin}>
        <Feather name="map-pin" size={18} color="#FFFFFF" />
      </View>
    </View>
  );
}

function buildInviteMessage({
  code,
  guestLine,
  hostName,
  flat,
  society,
  address,
  when,
}: {
  code: string;
  guestLine: string;
  hostName: string;
  flat: string;
  society: string;
  address: string;
  when: string;
}) {
  return `DoorWy entry invite\nCode: ${code}\nGuest: ${guestLine}\nHost: ${hostName}, Flat ${flat}\nSociety: ${society}\nAddress: ${address}\nWhen: ${when}\nMap: https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

function generateVisitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingBottom: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  successScroll: { padding: Spacing.lg, alignItems: 'center', gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  modeSwitch: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceContainerLow,
  },
  modeTab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md },
  modeTabActive: { backgroundColor: Palette.primary },
  headerCardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { color: Palette.onSurfaceVariant, marginBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: {
    width: '48%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
  },
  typeChipActive: { backgroundColor: Palette.primary },
  contactList: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceContainerLowest,
    overflow: 'hidden',
  },
  contactRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  contactRowActive: { backgroundColor: Palette.primaryContainer },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  chipActive: { backgroundColor: Palette.primary },
  dateTimeRow: { flexDirection: 'row', gap: Spacing.sm },
  successBadge: { width: 88, height: 88, borderRadius: 44, backgroundColor: Palette.success, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.success, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  centerTitle: { color: Palette.onSurface, textAlign: 'center' },
  centerBody: { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg },
  entryCard: {
    width: '100%',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Palette.surfaceContainerLowest,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  entryHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.md },
  codeCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Palette.primaryContainer,
  },
  codeText: {
    ...Type.headlineLg,
    color: Palette.primary,
    letterSpacing: 6,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  detailIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: Palette.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  map: {
    height: 150,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E7EEEA',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  mapRoadH: { position: 'absolute', left: 0, right: 0, top: 68, height: 18, backgroundColor: '#FFFFFF' },
  mapRoadV: { position: 'absolute', top: 0, bottom: 0, left: 148, width: 18, backgroundColor: '#FFFFFF' },
  mapBlockA: { position: 'absolute', left: 18, top: 18, width: 94, height: 38, borderRadius: 8, backgroundColor: '#C7E8DB' },
  mapBlockB: { position: 'absolute', right: 22, bottom: 20, width: 120, height: 44, borderRadius: 8, backgroundColor: '#C9D1F2' },
  mapPin: { position: 'absolute', left: '50%', top: 48, width: 40, height: 40, marginLeft: -20, borderRadius: 20, backgroundColor: Palette.primary, alignItems: 'center', justifyContent: 'center' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs },
  shareRow: { flexDirection: 'row', gap: Spacing.sm },
});
