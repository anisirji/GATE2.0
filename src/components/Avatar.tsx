import { StyleSheet, Text, View } from 'react-native';
import { Type } from '@/constants/theme';

export function Avatar({ name, color = '#1e40af', size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[Type.labelMd, { color: '#fff', fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
