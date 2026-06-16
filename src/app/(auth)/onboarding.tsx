import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Palette, Radius, Spacing, Type } from '@/constants/theme';

const SLIDES = [
  {
    icon: 'qr-code' as const,
    title: 'Visitors, sorted.',
    body: 'Pre-approve guests, generate one-tap QR passes, and let your community guard verify entries in seconds.',
    tone: Palette.primary,
  },
  {
    icon: 'credit-card' as const,
    title: 'Society dues, finally simple.',
    body: 'See pending maintenance and utility bills in one place. Pay UPI or card without leaving the app.',
    tone: Palette.secondary,
  },
  {
    icon: 'bell' as const,
    title: 'Stay in the loop.',
    body: 'Society notices, maintenance windows, and event RSVPs — pinned and instantly searchable.',
    tone: Palette.tertiary,
  },
];

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onViewableChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) setIndex(viewableItems[0].index);
  }).current;

  const goNext = () => {
    if (index < SLIDES.length - 1) listRef.current?.scrollToIndex({ index: index + 1 });
    else router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.replace('/(auth)/login')} hitSlop={12}>
          <Text style={[Type.labelMd, { color: Palette.onSurfaceVariant }]}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconHero, { backgroundColor: item.tone + '15' }]}>
              <Feather name={item.icon} size={64} color={item.tone} />
            </View>
            <Text style={[Type.headlineLg, styles.title]}>{item.title}</Text>
            <Text style={[Type.bodyLg, styles.body]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.cta}>
        <Button label={index < SLIDES.length - 1 ? 'Next' : 'Get started'} onPress={goNext} icon="arrow-right" iconPosition="right" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topRow: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, alignItems: 'flex-end' },
  slide: { paddingHorizontal: Spacing.xl, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl },
  iconHero: { width: 160, height: 160, borderRadius: Radius.xxl, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center', color: Palette.onSurface },
  body: { textAlign: 'center', color: Palette.onSurfaceVariant },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.surfaceContainerHighest },
  dotActive: { width: 24, backgroundColor: Palette.primary },
  cta: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
});
