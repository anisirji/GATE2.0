import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f9f9ff' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="notice-broadcast" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="staff-tracking" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="payments-report" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="resident-detail" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
