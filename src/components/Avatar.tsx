import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Palette } from '@/constants/theme';

export function Avatar({
  name,
  color,
  size = 40,
  ring,
}: {
  name: string;
  color?: string;
  size?: number;
  ring?: boolean;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  // Derive a soft tinted background from the name hash if no color override is given.
  // Keeps the avatar grid quiet (no rainbow), tinted toward the brand neutrals.
  const bg = color ?? tintFromName(name);
  const fg = pickInk(bg);

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        ring && { borderWidth: 2, borderColor: Palette.surfaceContainerLowest },
      ]}>
      <Text style={[styles.txt, { color: fg, fontSize: Math.round(size * 0.38) }]}>{initials}</Text>
    </View>
  );
}

const TINTS = [
  '#E8EBFF', // primary container
  '#D7F4F0', // secondary container
  '#FFE8C7', // tertiary container
  '#FCE4E2', // error container
  '#DCF5E5', // success container
  '#ECEDF2', // neutral container
];

function tintFromName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}

function pickInk(bg: string) {
  // Saturated brand colors → white ink. Soft tints → onSurface ink.
  if (bg.startsWith('#') && bg.length === 7) {
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 200 ? Palette.onSurface : '#FFFFFF';
  }
  return Palette.onSurface;
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  txt: { fontFamily: Fonts.bodyBold, letterSpacing: 0.2 },
});
