import { useFonts as useJakarta, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts as useInter, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/lib/auth';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [jakartaLoaded] = useJakarta({ PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold });
  const [interLoaded] = useInter({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold });

  useEffect(() => {
    if (jakartaLoaded && interLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [jakartaLoaded, interLoaded]);

  if (!jakartaLoaded || !interLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f9f9ff' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>
  );
}
