import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { Pill } from '@/components/StatusBadge';
import { Layout, Palette, Radius, Spacing, Type } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function GuardProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Type.headlineLgMobile, { color: Palette.onSurface }]}>Profile</Text>

        <Card variant="outlined" padding="lg">
          <View style={styles.idRow}>
            <Avatar name={user?.name ?? 'Guard'} color={user?.avatarColor} size={56} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[Type.titleLg, { color: Palette.onSurface }]} numberOfLines={1}>
                {user?.name}
              </Text>
              <Text style={[Type.bodySm, { color: Palette.onSurfaceMuted }]}>{user?.phone}</Text>
              <View style={styles.pillRow}>
                <Pill label="Guard" bg={Palette.secondaryContainer} color={Palette.onSecondaryContainer} />
                <Pill
                  label={user?.designation ?? 'Day shift'}
                  bg={Palette.surfaceContainerLow}
                  color={Palette.onSurface}
                />
              </View>
            </View>
          </View>
        </Card>

        <Card variant="outlined" padding="lg">
          <Text style={[Type.titleMd, { color: Palette.onSurface }]}>Shift status</Text>
          <View style={styles.shiftRow}>
            <View style={styles.shiftBubble}>
              <Feather name="check" size={16} color={Palette.statusApprovedText} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Type.titleSm, { color: Palette.onSurface }]}>On duty</Text>
              <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, marginTop: 2 }]}>
                Since 7:00 AM · Gate 1
              </Text>
            </View>
            <Pressable style={styles.shiftBtn}>
              <Text style={[Type.labelMd, { color: Palette.primary }]}>End shift</Text>
            </Pressable>
          </View>
        </Card>

        <Pressable
          onPress={() => {
            signOut();
            router.replace('/(auth)/login');
          }}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.6 }]}>
          <Feather name="log-out" size={16} color={Palette.error} />
          <Text style={[Type.labelMd, { color: Palette.error }]}>Sign out</Text>
        </Pressable>

        <Text style={[Type.labelSm, { color: Palette.onSurfaceMuted, textAlign: 'center', marginTop: Spacing.md }]}>
          Civic Shield · v1.0.0
        </Text>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  scroll: {
    paddingHorizontal: Layout.pageGutter,
    paddingTop: Layout.pageTop,
    paddingBottom: Layout.scrollBottom,
    gap: Spacing.lg,
  },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  pillRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  shiftBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.statusApprovedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceContainerLow,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
