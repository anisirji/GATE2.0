import { Stack } from 'expo-router';

export default function GuardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f9f9ff' } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="checkin-confirm" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="entry-approved" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="visitor-details" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
