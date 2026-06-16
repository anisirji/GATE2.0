import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f9f9ff' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="qr-pass" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="guest-pass" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="invite-received" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
