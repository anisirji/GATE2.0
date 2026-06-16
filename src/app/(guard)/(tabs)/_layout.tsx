import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Palette, Type } from '@/constants/theme';

export default function GuardTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.secondary,
        tabBarInactiveTintColor: Palette.onSurfaceVariant,
        tabBarLabelStyle: { ...Type.labelSm, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: Palette.surfaceContainerLowest,
          borderTopColor: Palette.surfaceContainerHigh,
          borderTopWidth: 1,
          height: Platform.select({ ios: 88, android: 68 }),
          paddingBottom: Platform.select({ ios: 28, android: 10 }),
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Feather name="grid" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <Feather name="maximize" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="entries" options={{ title: 'Entries', tabBarIcon: ({ color, size }) => <Feather name="list" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="notices" options={{ title: 'Notices', tabBarIcon: ({ color, size }) => <Feather name="bell" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
