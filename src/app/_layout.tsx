import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    useFonts as useInter,
} from "@expo-google-fonts/inter";
import {
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    useFonts as useJakarta,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider } from "@/lib/auth";
import { VisitorProvider } from "@/lib/visitor-store";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [jakartaLoaded] = useJakarta({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (jakartaLoaded && interLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [jakartaLoaded, interLoaded]);

  if (!jakartaLoaded || !interLoaded) return null;

  return (
    <AuthProvider>
      <VisitorProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f9f9ff" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(guard)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </VisitorProvider>
    </AuthProvider>
  );
}
