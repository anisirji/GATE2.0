import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';
import type { Notice } from '@/data/mockData';

const CATEGORIES: { key: Notice['category']; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'general', label: 'General', icon: 'message-circle' },
  { key: 'urgent', label: 'Urgent', icon: 'alert-triangle' },
  { key: 'event', label: 'Event', icon: 'calendar' },
  { key: 'maintenance', label: 'Maintenance', icon: 'tool' },
];

const AUDIENCES = ['All residents', 'Tower A only', 'Tower B only', 'Committee', 'Staff'];

export default function NoticeBroadcast() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Notice['category']>('general');
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [pinned, setPinned] = useState(false);
  const [pushNotify, setPushNotify] = useState(true);
  const [sent, setSent] = useState(false);

  const valid = title.trim().length > 2 && body.trim().length > 8;

  if (sent) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <Feather name="send" size={44} color="#fff" />
          </View>
          <Text style={[Type.headlineLg, { color: Palette.onSurface, textAlign: 'center' }]}>Notice sent</Text>
          <Text style={[Type.bodyLg, { color: Palette.onSurfaceVariant, textAlign: 'center', paddingHorizontal: Spacing.lg }]}>
            Delivered to {audience.toLowerCase()}. Push notifications {pushNotify ? 'queued' : 'skipped'}.
          </Text>
          <Card padding="lg" accentColor={Palette.tertiary} style={{ width: '100%' }}>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>{category.toUpperCase()}</Text>
            <Text style={[Type.titleLg, { color: Palette.onSurface, marginTop: Spacing.xs }]}>{title}</Text>
            <Text style={[Type.bodyMd, { color: Palette.onSurfaceVariant, marginTop: Spacing.xs }]} numberOfLines={3}>
              {body}
            </Text>
          </Card>
          <View style={{ width: '100%', gap: Spacing.sm }}>
            <Button label="Send another" icon="plus" onPress={() => setSent(false)} />
            <Button label="Done" variant="outline" onPress={() => router.back()} />
          </View>
        </View>
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
          <Text style={[Type.titleLg, { color: Palette.onSurface }]}>New notice</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginBottom: Spacing.sm }]}>Category</Text>
            <View style={styles.catRow}>
              {CATEGORIES.map((c) => {
                const active = c.key === category;
                return (
                  <Pressable
                    key={c.key}
                    onPress={() => setCategory(c.key)}
                    style={[styles.catChip, active && { backgroundColor: Palette.tertiary, borderColor: Palette.tertiary }]}>
                    <Feather name={c.icon} size={14} color={active ? '#fff' : Palette.onSurface} />
                    <Text style={[Type.labelMd, { color: active ? '#fff' : Palette.onSurface }]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Input label="Title" placeholder="Short, scannable" value={title} onChangeText={setTitle} autoFocus />

          <View>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginBottom: Spacing.xs }]}>Body</Text>
            <TextInput
              placeholder="What residents need to know…"
              placeholderTextColor={Palette.outline}
              value={body}
              onChangeText={setBody}
              multiline
              style={[Type.bodyMd, styles.bodyInput]}
            />
          </View>

          <View>
            <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant, marginBottom: Spacing.sm }]}>Audience</Text>
            <View style={styles.audRow}>
              {AUDIENCES.map((a) => {
                const active = a === audience;
                return (
                  <Pressable
                    key={a}
                    onPress={() => setAudience(a)}
                    style={[styles.audChip, active && styles.audChipActive]}>
                    <Text style={[Type.labelMd, { color: active ? '#fff' : Palette.onSurface }]}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Card padding="lg" style={{ gap: Spacing.md }}>
            <ToggleRow icon="bookmark" label="Pin to top" value={pinned} onChange={setPinned} />
            <ToggleRow icon="bell" label="Send push notification" value={pushNotify} onChange={setPushNotify} />
          </Card>

          <Button label="Send notice" icon="send" onPress={() => setSent(true)} disabled={!valid} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ToggleRow({ icon, label, value, onChange }: { icon: keyof typeof Feather.glyphMap; label: string; value: boolean; onChange: (b: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIcon}>
        <Feather name={icon} size={16} color={Palette.tertiary} />
      </View>
      <Text style={[Type.bodyMd, { color: Palette.onSurface, flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Palette.surfaceContainerHigh, true: Palette.tertiary }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, paddingBottom: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxxl },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow, borderWidth: 1, borderColor: Palette.surfaceContainerLow },
  bodyInput: {
    minHeight: 140,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: Palette.surfaceContainerLowest,
    color: Palette.onSurface,
    textAlignVertical: 'top',
  },
  audRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  audChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.pill, backgroundColor: Palette.surfaceContainerLow },
  audChipActive: { backgroundColor: Palette.primary },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Palette.warningContainer, alignItems: 'center', justifyContent: 'center' },
  successWrap: { flex: 1, padding: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  successBadge: { width: 96, height: 96, borderRadius: 48, backgroundColor: Palette.tertiary, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.tertiary, shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
});
