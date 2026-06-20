import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Radius, Spacing, Type } from '@/constants/theme';

type SceneKind = 'gate' | 'bills' | 'notices';

type Slide = {
  scene: SceneKind;
  eyebrow: string;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    scene: 'gate',
    eyebrow: 'Faster gate',
    title: 'Visitors, sorted.',
    body: 'Pre-approve guests, generate one-tap QR passes, let your guard verify entries in seconds.',
  },
  {
    scene: 'bills',
    eyebrow: 'Painless dues',
    title: 'Society dues, finally simple.',
    body: 'See pending maintenance bills in one place. Pay UPI or card without leaving the app.',
  },
  {
    scene: 'notices',
    eyebrow: 'Stay in the loop',
    title: 'No notice missed.',
    body: 'Society announcements, maintenance windows and event RSVPs, pinned and searchable.',
  },
];

const SCREEN_W = Dimensions.get('window').width;
const SCENE_W = Math.min(SCREEN_W - Spacing.lg * 2, 360);
const SCENE_H = 360;
const ROAD_HEIGHT = 60;
const SKY_H = SCENE_H - ROAD_HEIGHT;

// Car loop range — extends past frame so the car drives in/out smoothly.
const CAR_START = -100;
const CAR_END = SCENE_W + 20;
// Slow ambient drive.
const IDLE_LOOP_MS = 12000;
// Fast zoom when user presses Next.
const SWEEP_MS = 550;
// Cross-fade duration for the scene swap; aligns with the sweep.
const FADE_MS = 380;

export default function Onboarding() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const last = SLIDES.length - 1;

  // Slide content animation (fades when slide changes)
  const currentOpacity = useSharedValue(1);
  const nextOpacity = useSharedValue(0);

  // Car position — runs continuously, never reset on slide change.
  const carX = useSharedValue(CAR_START);

  // Start the slow ambient loop on mount.
  useEffect(() => {
    carX.value = CAR_START;
    carX.value = withRepeat(
      withTiming(CAR_END, { duration: IDLE_LOOP_MS, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(carX);
  }, [carX]);

  const goNext = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (current >= last) {
      router.replace('/(auth)/login');
      return;
    }
    if (next !== null) return; // ignore taps mid-transition
    const target = current + 1;

    // 1) Cancel the slow loop and SPEED UP — car races off to the right.
    cancelAnimation(carX);
    carX.value = withTiming(
      CAR_END,
      { duration: SWEEP_MS, easing: Easing.bezier(0.36, 0, 0.34, 1) },
      (finished) => {
        'worklet';
        if (finished) {
          // 4) Once off-screen right, restart the slow loop from the left.
          carX.value = CAR_START;
          carX.value = withRepeat(
            withTiming(CAR_END, { duration: IDLE_LOOP_MS, easing: Easing.linear }),
            -1,
            false
          );
        }
      }
    );

    // 2) Cross-fade the sky/buildings as the car races across.
    setNext(target);
    currentOpacity.value = withTiming(0, { duration: FADE_MS, easing: Easing.out(Easing.exp) });
    nextOpacity.value = withTiming(1, { duration: FADE_MS, easing: Easing.out(Easing.exp) });

    // 3) Commit the new slide a touch before the car exits — so the dots and
    // copy update while the car is still sweeping right.
    setTimeout(() => {
      setCurrent(target);
      setNext(null);
      currentOpacity.value = 1;
      nextOpacity.value = 0;
    }, FADE_MS);
  }, [carX, current, currentOpacity, last, next, nextOpacity, router]);

  const skip = () => router.replace('/(auth)/login');

  const currentStyle = useAnimatedStyle(() => ({ opacity: currentOpacity.value }));
  const nextStyle = useAnimatedStyle(() => ({ opacity: nextOpacity.value }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateX: carX.value }] }));

  const currentSlide = SLIDES[current];
  const nextSlide = next !== null ? SLIDES[next] : null;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topRow}>
        <Pressable onPress={skip} hitSlop={12}>
          <Text style={[Type.labelMd, { color: Palette.onSurfaceMuted }]}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.middle}>
        {/* Scene frame */}
        <View style={styles.sceneFrame}>
          {/* Layer A: current slide sky + buildings */}
          <Animated.View style={[StyleSheet.absoluteFill, currentStyle]}>
            <Svg width={SCENE_W} height={SKY_H} viewBox={`0 0 ${SCENE_W} ${SKY_H}`}>
              <Sky kind={currentSlide.scene} width={SCENE_W} height={SKY_H} />
              <Scene kind={currentSlide.scene} width={SCENE_W} height={SKY_H} />
            </Svg>
          </Animated.View>

          {/* Layer B: incoming slide sky + buildings */}
          {nextSlide ? (
            <Animated.View style={[StyleSheet.absoluteFill, nextStyle]}>
              <Svg width={SCENE_W} height={SKY_H} viewBox={`0 0 ${SCENE_W} ${SKY_H}`}>
                <Sky kind={nextSlide.scene} width={SCENE_W} height={SKY_H} />
                <Scene kind={nextSlide.scene} width={SCENE_W} height={SKY_H} />
              </Svg>
            </Animated.View>
          ) : null}

          {/* Persistent road — same across all slides */}
          <View style={styles.roadLayer}>
            <Svg width={SCENE_W} height={ROAD_HEIGHT} viewBox={`0 0 ${SCENE_W} ${ROAD_HEIGHT}`}>
              <Road width={SCENE_W} height={ROAD_HEIGHT} />
            </Svg>
          </View>

          {/* Persistent car driving on the road */}
          <Animated.View style={[styles.carWrap, carStyle]}>
            <Car />
          </Animated.View>
        </View>

        {/* Copy */}
        <View style={styles.copyOuter}>
          <Animated.View style={[styles.copyWrap, currentStyle]}>
            <Text style={[Type.eyebrow, { color: Palette.primary }]}>{currentSlide.eyebrow}</Text>
            <Text style={[Type.headlineLg, styles.title]}>{currentSlide.title}</Text>
            <Text style={[Type.bodyMd, styles.body]}>{currentSlide.body}</Text>
          </Animated.View>
          {nextSlide ? (
            <Animated.View style={[StyleSheet.absoluteFill, styles.copyWrap, nextStyle]}>
              <Text style={[Type.eyebrow, { color: Palette.primary }]}>{nextSlide.eyebrow}</Text>
              <Text style={[Type.headlineLg, styles.title]}>{nextSlide.title}</Text>
              <Text style={[Type.bodyMd, styles.body]}>{nextSlide.body}</Text>
            </Animated.View>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
          ))}
        </View>

        <NextButton label={current < last ? 'Next' : "Let's go"} onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Animated Next button

function NextButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const arrowX = useSharedValue(0);

  const onPressIn = () => {
    scale.value = withTiming(0.97, { duration: 80, easing: Easing.out(Easing.quad) });
    arrowX.value = withTiming(4, { duration: 120 });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.exp) });
    arrowX.value = withTiming(0, { duration: 160 });
  };

  const wrapStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const arrowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: arrowX.value }] }));

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.nextBtn, wrapStyle]}>
        <Text style={styles.nextLabel}>{label}</Text>
        <Animated.View style={[styles.nextArrow, arrowStyle]}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="#FFFFFF"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sky + per-scene content. Sky tint shifts per slide for variety.

function Sky({ kind, width, height }: { kind: SceneKind; width: number; height: number }) {
  const top = kind === 'gate' ? '#EEF1FF' : kind === 'bills' ? '#EAFBF5' : '#FFF1E6';
  const mid = kind === 'gate' ? '#F6F8FF' : kind === 'bills' ? '#F4FCF8' : '#FFF8EE';
  return (
    <G>
      <Defs>
        <LinearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={mid} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#sky-${kind})`} />
      {/* Grass strip just above the road */}
      <Rect x={0} y={height - 24} width={width} height={24} fill="#E7EEEA" />
    </G>
  );
}

function Road({ width, height }: { width: number; height: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E4E5EC" />
          <Stop offset="1" stopColor="#D7DAE2" />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#road)" />
      {/* Lane markings */}
      <G>
        {Array.from({ length: 10 }).map((_, i) => (
          <Rect
            key={i}
            x={i * 40 + 8}
            y={height / 2 - 1.5}
            width={20}
            height={3}
            rx={1.5}
            fill="#FFFFFF"
            opacity={0.85}
          />
        ))}
      </G>
    </G>
  );
}

function Scene({ kind, width, height }: { kind: SceneKind; width: number; height: number }) {
  if (kind === 'gate') return <GateScene width={width} height={height} />;
  if (kind === 'bills') return <BillsScene width={width} height={height} />;
  return <NoticesScene width={width} height={height} />;
}

function GateScene({ width, height }: { width: number; height: number }) {
  const ground = height; // grass band already starts at height - 24
  return (
    <G>
      <Circle cx={width - 64} cy={56} r={26} fill="#FFE2C8" opacity={0.9} />
      <Circle cx={width - 64} cy={56} r={14} fill="#FFCBA1" />

      <Rect x={28} y={ground - 200} width={48} height={170} rx={6} fill="#C9D1F2" />
      <Rect x={86} y={ground - 240} width={64} height={210} rx={6} fill="#B7C0E8" />
      <Rect x={160} y={ground - 180} width={42} height={150} rx={6} fill="#C9D1F2" />
      <Rect x={210} y={ground - 220} width={56} height={190} rx={6} fill="#B7C0E8" />
      <Rect x={274} y={ground - 160} width={40} height={130} rx={6} fill="#C9D1F2" />

      {[40, 100, 170, 220, 286].map((x, i) => (
        <G key={i}>
          {Array.from({ length: 5 }).map((__, r) =>
            Array.from({ length: 2 }).map((___, c) => (
              <Rect
                key={`${r}-${c}`}
                x={x + c * 14}
                y={ground - 150 + r * 22}
                width={6}
                height={10}
                rx={1}
                fill="#FFFFFF"
                opacity={0.75}
              />
            ))
          )}
        </G>
      ))}

      {/* Gate */}
      <Rect x={width / 2 - 92} y={ground - 80} width={14} height={80} rx={3} fill="#3D4EFF" />
      <Rect x={width / 2 + 78} y={ground - 80} width={14} height={80} rx={3} fill="#3D4EFF" />
      <Path
        d={`M ${width / 2 - 92} ${ground - 80} Q ${width / 2} ${ground - 120} ${width / 2 + 92} ${ground - 80}`}
        stroke="#3D4EFF"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <G transform={`translate(${width / 2 - 9} ${ground - 110})`}>
        <Path d="M0 0 L18 0 L18 10 Q9 20 0 10 Z" fill="#FFFFFF" />
        <Path d="M5 4 L13 4 L13 9 Q9 14 5 9 Z" fill="#3D4EFF" />
      </G>

      {/* Floating pass card */}
      <G transform={`translate(28 ${ground - 220})`}>
        <Rect x={0} y={0} width={120} height={80} rx={12} fill="#FFFFFF" />
        <Rect x={0} y={0} width={120} height={80} rx={12} fill="none" stroke="#E7E8EE" strokeWidth={1} />
        <Rect x={12} y={14} width={36} height={36} rx={4} fill="#0B0D14" />
        <Rect x={16} y={18} width={4} height={4} fill="#FFFFFF" />
        <Rect x={28} y={18} width={4} height={4} fill="#FFFFFF" />
        <Rect x={40} y={18} width={4} height={4} fill="#FFFFFF" />
        <Rect x={16} y={30} width={4} height={4} fill="#FFFFFF" />
        <Rect x={28} y={30} width={4} height={4} fill="#FFFFFF" />
        <Rect x={40} y={30} width={4} height={4} fill="#FFFFFF" />
        <Rect x={22} y={42} width={4} height={4} fill="#FFFFFF" />
        <Rect x={34} y={42} width={4} height={4} fill="#FFFFFF" />
        <Rect x={58} y={18} width={50} height={6} rx={3} fill="#0B0D14" />
        <Rect x={58} y={30} width={36} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={58} y={40} width={42} height={4} rx={2} fill="#D7DAE2" />
        <Circle cx={108} cy={64} r={6} fill="#0E8B4F" />
      </G>
    </G>
  );
}

function BillsScene({ width, height }: { width: number; height: number }) {
  const ground = height;
  return (
    <G>
      <Circle cx={60} cy={60} r={18} fill="#FFFFFF" opacity={0.9} />
      <Circle cx={84} cy={60} r={22} fill="#FFFFFF" opacity={0.9} />
      <Circle cx={108} cy={62} r={16} fill="#FFFFFF" opacity={0.9} />

      <Rect x={60} y={ground - 240} width={width - 120} height={210} rx={10} fill="#C7E8DB" />
      <Rect x={56} y={ground - 244} width={width - 112} height={10} rx={3} fill="#A8DAC6" />
      <G>
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <Rect
              key={`${r}-${c}`}
              x={80 + c * 50}
              y={ground - 220 + r * 32}
              width={28}
              height={20}
              rx={3}
              fill="#FFFFFF"
              opacity={0.9}
            />
          ))
        )}
      </G>

      <G transform={`translate(40 ${ground - 150}) rotate(-4)`}>
        <Rect x={0} y={0} width={200} height={120} rx={16} fill="#3D4EFF" />
        <Rect x={16} y={18} width={70} height={6} rx={3} fill="#FFFFFF" opacity={0.7} />
        <Rect x={16} y={34} width={140} height={18} rx={4} fill="#FFFFFF" />
        <Rect x={16} y={62} width={48} height={6} rx={3} fill="#FFFFFF" opacity={0.6} />
        <Rect x={16} y={86} width={26} height={20} rx={4} fill="#FFE8C7" />
        <Rect x={56} y={92} width={120} height={6} rx={3} fill="#FFFFFF" opacity={0.8} />
      </G>

      <G transform={`translate(${width - 160} ${ground - 180}) rotate(6)`}>
        <Rect x={0} y={0} width={130} height={150} rx={10} fill="#FFFFFF" />
        <Rect x={0} y={0} width={130} height={150} rx={10} fill="none" stroke="#E7E8EE" strokeWidth={1} />
        <Rect x={14} y={18} width={70} height={8} rx={3} fill="#0B0D14" />
        <Rect x={14} y={36} width={100} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={14} y={48} width={80} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={14} y={68} width={60} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={14} y={80} width={80} height={4} rx={2} fill="#D7DAE2" />
        <Circle cx={65} cy={120} r={18} fill="#DCF5E5" />
        <Path
          d="M 56 121 L 63 128 L 76 114"
          stroke="#0E6B3C"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>

      <Circle cx={width - 56} cy={ground - 220} r={10} fill="#FFCBA1" />
      <Circle cx={width - 56} cy={ground - 220} r={6} fill="#B8740A" opacity={0.4} />
      <Circle cx={width - 32} cy={ground - 198} r={7} fill="#FFCBA1" />
    </G>
  );
}

function NoticesScene({ width, height }: { width: number; height: number }) {
  const ground = height;
  return (
    <G>
      <Circle cx={40} cy={ground - 50} r={20} fill="#A8DAC6" />
      <Rect x={36} y={ground - 40} width={8} height={20} fill="#7C6F5A" />
      <Circle cx={width - 40} cy={ground - 48} r={18} fill="#A8DAC6" />
      <Rect x={width - 44} y={ground - 40} width={8} height={20} fill="#7C6F5A" />

      <Circle cx={width - 70} cy={60} r={28} fill="#FFE2C8" opacity={0.9} />
      <Circle cx={width - 70} cy={60} r={16} fill="#FFCBA1" />

      <Rect x={60} y={ground - 220} width={width - 120} height={190} rx={10} fill="#E2C9A3" />
      <Rect x={56} y={ground - 224} width={width - 112} height={10} rx={3} fill="#CBAE82" />
      <G>
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((__, c) => (
            <Rect
              key={`${r}-${c}`}
              x={80 + c * 50}
              y={ground - 200 + r * 36}
              width={28}
              height={22}
              rx={3}
              fill="#FFFFFF"
              opacity={0.95}
            />
          ))
        )}
      </G>

      <G transform={`translate(64 ${ground - 170}) rotate(-12)`}>
        <Path d="M 0 28 L 70 0 L 70 56 L 0 28 Z" fill="#3D4EFF" />
        <Rect x={70} y={10} width={20} height={36} rx={4} fill="#1F2BB8" />
        <Rect x={88} y={18} width={6} height={20} rx={2} fill="#1F2BB8" />
        <Rect x={56} y={20} width={10} height={16} rx={3} fill="#FFFFFF" opacity={0.6} />
      </G>
      <G stroke="#3D4EFF" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.65}>
        <Path d={`M 150 ${ground - 200} l 24 -10`} />
        <Path d={`M 150 ${ground - 150} l 28 0`} />
        <Path d={`M 150 ${ground - 100} l 24 12`} />
      </G>

      <G transform={`translate(${width - 156} ${ground - 220})`}>
        <Rect x={0} y={0} width={120} height={70} rx={10} fill="#FFFFFF" />
        <Rect x={0} y={0} width={120} height={70} rx={10} fill="none" stroke="#E7E8EE" />
        <Rect x={12} y={14} width={36} height={10} rx={4} fill="#FCE4E2" />
        <Rect x={12} y={32} width={90} height={5} rx={2} fill="#0B0D14" />
        <Rect x={12} y={44} width={70} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={12} y={54} width={80} height={4} rx={2} fill="#D7DAE2" />
      </G>
      <G transform={`translate(${width - 140} ${ground - 144}) rotate(8)`}>
        <Rect x={0} y={0} width={110} height={56} rx={10} fill="#FFFFFF" />
        <Rect x={0} y={0} width={110} height={56} rx={10} fill="none" stroke="#E7E8EE" />
        <Rect x={10} y={10} width={30} height={8} rx={3} fill="#D7F4F0" />
        <Rect x={10} y={26} width={84} height={4} rx={2} fill="#D7DAE2" />
        <Rect x={10} y={36} width={70} height={4} rx={2} fill="#D7DAE2" />
      </G>
    </G>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Car (side view)

function Car() {
  return (
    <Svg width={84} height={42} viewBox="0 0 84 42">
      <Path
        d="M4 28 L8 18 Q18 8 30 8 L52 8 Q60 8 66 14 L72 18 L78 18 Q82 18 82 22 L82 30 Q82 32 80 32 L70 32 Q68 36 64 36 Q60 36 58 32 L26 32 Q24 36 20 36 Q16 36 14 32 L6 32 Q4 32 4 30 Z"
        fill="#3D4EFF"
      />
      <Path d="M20 18 Q26 12 32 12 L48 12 Q56 12 62 18 L20 18 Z" fill="#E8EBFF" />
      <Path d="M40 12 L40 18" stroke="#3D4EFF" strokeWidth={1.5} />
      <Circle cx={78} cy={22} r={2.4} fill="#FFE2C8" />
      <Rect x={44} y={22} width={8} height={2} rx={1} fill="#1F2BB8" />
      <Circle cx={20} cy={34} r={6} fill="#0B0D14" />
      <Circle cx={20} cy={34} r={2.5} fill="#5C6070" />
      <Circle cx={64} cy={34} r={6} fill="#0B0D14" />
      <Circle cx={64} cy={34} r={2.5} fill="#5C6070" />
    </Svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.surface },
  topRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },

  sceneFrame: {
    width: SCENE_W,
    height: SCENE_H,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Palette.surfaceContainerLowest,
  },
  roadLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: ROAD_HEIGHT,
  },
  carWrap: {
    position: 'absolute',
    left: 0,
    bottom: ROAD_HEIGHT - 30,
  },

  copyOuter: { width: '100%', alignItems: 'center', marginTop: Spacing.xxl, minHeight: 132 },
  copyWrap: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  title: { textAlign: 'center', color: Palette.onSurface, marginTop: Spacing.xs },
  body: {
    textAlign: 'center',
    color: Palette.onSurfaceVariant,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },

  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.borderStrong },
  dotActive: { width: 20, backgroundColor: Palette.primary },

  nextBtn: {
    minHeight: 56,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    backgroundColor: Palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  nextLabel: {
    ...Type.titleMd,
    color: '#FFFFFF',
  },
  nextArrow: { marginLeft: 4 },
});
