import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { Palette, Spacing, Type } from '@/constants/theme';

/**
 * Decorative outlined society scene used as a footer on dashboards.
 * Pure outline strokes, with one cloud drifting slowly across the sky.
 */
export function SocietyFooter({ width = 360 }: { width?: number }) {
  const stroke = Palette.outlineVariant;
  const inkLight = Palette.surfaceContainerHigh;
  const heroOpacity = 0.4;

  // Only animation: cloud drifts very slowly. Calm, ambient, not attention-grabbing.
  const cloudX = useSharedValue(0);

  useEffect(() => {
    cloudX.value = withRepeat(
      withTiming(14, { duration: 12000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    return () => cancelAnimation(cloudX);
  }, [cloudX]);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudX.value }],
  }));

  const H = 220;
  const gateX = width / 2;
  const groundY = H - 28;

  return (
    <View style={[styles.wrap, { width }]}>
      {/* Watermark text */}
      <Text style={[Type.displayMd, styles.watermark]} numberOfLines={1}>
        #CivicShield
      </Text>

      {/* Cloud — animated drift */}
      <Animated.View style={[styles.cloudLayer, cloudStyle]}>
        <Svg width={70} height={20} viewBox="0 0 70 20">
          <Path
            d="M 6 14 Q 8 6 16 8 Q 18 2 28 4 Q 36 2 40 8 Q 50 6 54 12 Q 62 12 60 18 L 8 18 Q 4 18 6 14 Z"
            stroke={stroke}
            strokeWidth={1.2}
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Society scene */}
      <Svg width={width} height={H} viewBox={`0 0 ${width} ${H}`}>
        <G stroke={stroke} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={heroOpacity}>
          {/* Distant towers */}
          <Rect x={24} y={groundY - 100} width={36} height={100} rx={2} />
          <Rect x={66} y={groundY - 130} width={42} height={130} rx={2} />
          <Rect x={114} y={groundY - 90} width={32} height={90} rx={2} />

          {/* Tower windows — small grids */}
          <G>
            {[28, 70, 118].map((bx, i) => {
              const baseY = i === 1 ? groundY - 120 : groundY - 80;
              return Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 2 }).map((__, c) => (
                  <Rect
                    key={`${bx}-${r}-${c}`}
                    x={bx + c * 12}
                    y={baseY + r * 18}
                    width={6}
                    height={8}
                    rx={1}
                  />
                ))
              );
            })}
          </G>

          {/* Society gate — arch + posts + shield emblem */}
          <Line x1={gateX - 56} y1={groundY} x2={gateX - 56} y2={groundY - 56} />
          <Line x1={gateX + 56} y1={groundY} x2={gateX + 56} y2={groundY - 56} />
          <Path d={`M ${gateX - 56} ${groundY - 56} Q ${gateX} ${groundY - 88} ${gateX + 56} ${groundY - 56}`} />
          {/* Shield on the arch */}
          <Path d={`M ${gateX - 8} ${groundY - 80} L ${gateX + 8} ${groundY - 80} L ${gateX + 8} ${groundY - 72} Q ${gateX} ${groundY - 64} ${gateX - 8} ${groundY - 72} Z`} />

          {/* Right side: more towers */}
          <Rect x={width - 150} y={groundY - 110} width={36} height={110} rx={2} />
          <Rect x={width - 110} y={groundY - 90} width={32} height={90} rx={2} />
          <Rect x={width - 74} y={groundY - 124} width={42} height={124} rx={2} />

          {/* Right tower windows */}
          <G>
            {[width - 146, width - 106, width - 70].map((bx) => {
              const baseY = groundY - 82;
              return Array.from({ length: 3 }).map((_, r) =>
                Array.from({ length: 2 }).map((__, c) => (
                  <Rect
                    key={`r-${bx}-${r}-${c}`}
                    x={bx + c * 12}
                    y={baseY + r * 18}
                    width={6}
                    height={8}
                    rx={1}
                  />
                ))
              );
            })}
          </G>

          {/* Ground line */}
          <Line x1={0} y1={groundY} x2={width} y2={groundY} />

          {/* Guard figure — left of gate */}
          <G transform={`translate(${gateX - 92} ${groundY - 44})`}>
            <Circle cx={6} cy={6} r={5} />
            <Line x1={1} y1={3} x2={11} y2={3} />
            <Path d="M 2 12 Q 6 24 10 12 L 10 26 L 2 26 Z" />
            <Line x1={4} y1={26} x2={4} y2={36} />
            <Line x1={8} y1={26} x2={8} y2={36} />
          </G>

          {/* Auto-rickshaw — right of gate */}
          <G transform={`translate(${gateX + 80} ${groundY - 28})`}>
            <Path d="M 0 18 L 4 6 Q 12 2 22 6 L 30 6 Q 36 6 38 12 L 38 18 Z" />
            <Circle cx={8} cy={18} r={4} />
            <Circle cx={30} cy={18} r={4} />
            <Line x1={14} y1={6} x2={14} y2={18} />
          </G>

          {/* Family */}
          <G transform={`translate(${gateX + 26} ${groundY - 38})`}>
            <Circle cx={4} cy={4} r={3} />
            <Path d="M 1 8 L 7 8 L 7 18 L 1 18 Z" />
            <Line x1={2} y1={18} x2={2} y2={26} />
            <Line x1={6} y1={18} x2={6} y2={26} />
            <Circle cx={14} cy={10} r={2.5} />
            <Path d="M 11 13 L 17 13 L 17 20 L 11 20 Z" />
            <Line x1={12} y1={20} x2={12} y2={26} />
            <Line x1={16} y1={20} x2={16} y2={26} />
          </G>

          {/* Drone — top right */}
          <G transform={`translate(${width - 64} 18)`}>
            <Rect x={6} y={4} width={14} height={8} rx={2} />
            <Line x1={2} y1={4} x2={10} y2={4} />
            <Line x1={16} y1={4} x2={24} y2={4} />
            <Circle cx={4} cy={4} r={1.6} />
            <Circle cx={22} cy={4} r={1.6} />
          </G>

          {/* QR pass icon — floating mid */}
          <G transform={`translate(36 26)`}>
            <Rect x={0} y={0} width={22} height={28} rx={3} />
            <Rect x={4} y={4} width={6} height={6} rx={1} />
            <Rect x={12} y={4} width={6} height={6} rx={1} />
            <Rect x={4} y={12} width={6} height={6} rx={1} />
            <Rect x={12} y={12} width={3} height={3} rx={0.5} />
            <Rect x={17} y={15} width={1.5} height={1.5} />
            <Line x1={3} y1={22} x2={19} y2={22} />
            <Line x1={3} y1={25} x2={14} y2={25} />
          </G>

          {/* Trees */}
          <G transform={`translate(8 ${groundY - 32})`}>
            <Path d="M 0 30 Q -4 18 0 6 Q 4 -2 10 6 Q 14 18 10 30 Z" />
            <Line x1={5} y1={30} x2={5} y2={36} />
          </G>
          <G transform={`translate(${width - 18} ${groundY - 28})`}>
            <Circle cx={6} cy={10} r={9} />
            <Line x1={6} y1={20} x2={6} y2={32} />
          </G>
        </G>

        {/* Static dot at the gate — same outline tone, not animated, blends in. */}
        <Circle cx={gateX} cy={groundY - 80} r={1.6} fill={stroke} opacity={0.6} />
      </Svg>

      {/* Tagline */}
      <View style={styles.tagline}>
        <Text style={[Type.labelSm, { color: inkLight }]}>🇮🇳 Made for Indian societies</Text>
        <Text style={[Type.labelSm, { color: inkLight }]}>❤️ Crafted in India</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: Spacing.lg,
    color: Palette.surfaceContainerHigh,
    opacity: 0.6,
    letterSpacing: -1,
  },
  cloudLayer: {
    position: 'absolute',
    top: 56,
    left: 30,
  },
  tagline: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
