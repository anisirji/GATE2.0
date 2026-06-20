import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { Palette, Type } from '@/constants/theme';

export default function GuardTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.onSurface,
        tabBarInactiveTintColor: Palette.onSurfaceMuted,
        tabBarLabelStyle: { ...Type.labelSm, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: Palette.surfaceContainerLowest,
          borderTopColor: Palette.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.select({ ios: 86, android: 66 }),
          paddingBottom: Platform.select({ ios: 28, android: 10 }),
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Feather name="grid" size={20} color={color} /> }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: ({ color }) => <Feather name="maximize" size={20} color={color} /> }} />
      <Tabs.Screen name="entries" options={{ title: 'Entries', tabBarIcon: ({ color }) => <Feather name="list" size={20} color={color} /> }} />
      <Tabs.Screen name="notices" options={{ title: 'Notices', tabBarIcon: ({ color }) => <Feather name="bell" size={20} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} /> }} />
    </Tabs>
  );
}
