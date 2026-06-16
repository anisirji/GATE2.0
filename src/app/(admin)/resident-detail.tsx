import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import { MOCK_DUES, MOCK_ENTRY_LOG, MOCK_RESIDENTS } from '@/data/mockData';

export default function ResidentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const resident = useMemo(() => MOCK_RESIDENTS.find((r) => r.id === id) ?? MOCK_RESIDENTS[0], [id]);
  const dues = MOCK_DUES.find((d) => d.flat === resident.flat);
  const recentVisits = MOCK_ENTRY_LOG.filter((e) => e.flat === resident.flat).slice(0, 3);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Feather name="x" size={22} color={Palette.onSurface} />
          </Pressable>
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>Resident</Text>
          <Pressable hitSlop={12} style={styles.iconBtn}>
            <Feather name="more-vertical" size={20} color={Palette.onSurface} />
          </Pressable>
        </View>

        <Card padding="xl" elevated style={{ alignItems: 'center', gap: Spacing.sm }}>
          <Avatar name={resident.name} color={resident.avatarColor} size={88} />
          <Text style={[Type.headlineMd, { color: Palette.onSurface }]}>{resident.name}</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            <Pill label={resident.role} bg={Palette.primaryContainer} color={Palette.primaryDeep} />
            <Pill label={`Flat ${resident.flat}`} bg={Palette.surfaceContainerHigh} color={Palette.onSurface} />
          </View>

          <View style={styles.contactRow}>
            <Pressable style={styles.contactBtn}>
              <Feather name="phone" size={16} color={Palette.secondary} />
              <Text style={[Type.labelMd, { color: Palette.secondary }]}>Call</Text>
            </Pressable>
            <Pressable style={styles.contactBtn}>
              <Feather name="message-square" size={16} color={Palette.secondary} />
              <Text style={[Type.labelMd, { color: Palette.secondary }]}>Message</Text>
            </Pressable>
            <Pressable style={styles.contactBtn}>
              <Feather name="mail" size={16} color={Palette.secondary} />
              <Text style={[Type.labelMd, { color: Palette.secondary }]}>Email</Text>
            </Pressable>
          </View>
        </Card>

        <Section title="Dues">
          {dues ? (
            <Card padding="md" accentColor={dues.status === 'overdue' ? Palette.error : dues.status === 'pending' ? Palette.warning : Palette.success}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View style={[styles.iconBubble, { backgroundColor: Palette.surfaceContainerLow }]}>
                  <Feather name="credit-card" size={20} color={Palette.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]}>Maintenance</Text>
                  <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>This cycle</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
                  <Text style={[Type.titleMd, { color: Palette.onSurface }]}>₹{dues.amount.toLocaleString('en-IN')}</Text>
                  <Pill
                    label={dues.status}
                    bg={
                      dues.status === 'paid'
                        ? Palette.statusApprovedBg
                        : dues.status === 'pending'
                        ? Palette.warningContainer
                        : Palette.statusDeniedBg
                    }
                    color={
                      dues.status === 'paid'
                        ? Palette.statusApprovedText
                        : dues.status === 'pending'
                        ? Palette.warning
                        : Palette.statusDeniedText
                    }
                  />
                </View>
              </View>
            </Card>
          ) : (
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>No dues on record.</Text>
          )}
        </Section>

        <Section title="Recent visitor activity">
          {recentVisits.length === 0 ? (
            <Text style={[Type.bodySm, { color: Palette.onSurfaceVariant }]}>No recent visitors.</Text>
          ) : (
            recentVisits.map((e) => (
              <Card key={e.id} padding="md">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                  <Avatar name={e.visitorName} color={Palette.outline} size={36} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[Type.titleMd, { color: Palette.onSurface, fontSize: 15 }]} numberOfLines={1}>
                      {e.visitorName}
                    </Text>
                    <Text style={[Type.labelSm, { color: Palette.onSurfaceVariant }]}>
                      {e.purpose} · {e.inAt}
                    </Text>
                  </View>
                  <Pill
                    label={e.status === 'inside' ? 'Inside' : e.status === 'denied' ? 'Denied' : 'Departed'}
                    bg={e.status === 'inside' ? Palette.statusApprovedBg : e.status === 'denied' ? Palette.statusDeniedBg : Palette.surfaceContainerHigh}
                    color={e.status === 'inside' ? Palette.statusApprovedText : e.status === 'denied' ? Palette.statusDeniedText : Palette.onSurfaceVariant}
                  />
                </View>
              </Card>
            ))
          )}
        </Section>

        <View style={{ gap: Spacing.sm }}>
          <Button label="Send notice to flat" icon="send" variant="outline" />
          <Button label="Mark as off-society" icon="archive" variant="ghost" />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: Spacing.sm }}>
      <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.md }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  contactRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.secondaryContainer },
  iconBubble: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
