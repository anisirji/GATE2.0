import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { Palette, Type } from '@/constants/theme';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Palette.tertiary,
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
      <Tabs.Screen name="index" options={{ title: 'Overview', tabBarIcon: ({ color, size }) => <Feather name="grid" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="visitors" options={{ title: 'Visitors', tabBarIcon: ({ color, size }) => <Feather name="users" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="residents" options={{ title: 'Residents', tabBarIcon: ({ color, size }) => <Feather name="book" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="notices" options={{ title: 'Notices', tabBarIcon: ({ color, size }) => <Feather name="bell" size={size - 2} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="settings" size={size - 2} color={color} /> }} />
    </Tabs>
  );
}
