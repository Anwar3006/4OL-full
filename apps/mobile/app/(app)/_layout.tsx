import "@/global.css";
import { useBiometricAuth } from "@/hooks/use-biometric-auth";
import { useUserProfile } from "@/hooks/use-userProfile";
import { authClient } from "@/lib/auth-Client";
import useUserStore from "@/store/use-userstore";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Animated, { FadeIn } from "react-native-reanimated";

// Set splash screen options
SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export default function AppLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(public)" />
      </Stack>
    </AuthProvider>
  );
}

/**
 * Auth Provider - Single source of truth for authentication
 *
 * Key principles:
 * 1. Lives at root level (never unmounts)
 * 2. Uses ONLY session.isPending (no custom flags)
 * 3. Shows loader BEFORE any route renders
 * 4. Let BetterAuth manage loading state
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { setUser, logoutUser } = useUserStore();
  const {
    isAvailable: isBiometricAvailable,
    isEnrolled: isBiometricEnrolled,

    isBiometricEnabled,
  } = useBiometricAuth();

  // Single source of truth: BetterAuth session
  const { data: sessionData, isPending: isSessionLoading } =
    authClient.useSession();

  const { data: userProfile } = useUserProfile(sessionData?.user?.id ?? "");

  // Sync user profile to store
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }

    // Clear user data when session is gone (and not loading)
    if (!sessionData && !isSessionLoading) {
      logoutUser();
    }
  }, [userProfile, sessionData, isSessionLoading]);

  // Navigation guard
  useEffect(() => {
    // Don't navigate while loading session
    if (isSessionLoading) return;

    const pathString = segments.join("/");
    const inAuthGroup = pathString.includes("(auth)");
    const legalPages = pathString.includes("(legal)");
    const isAuthenticated = !!sessionData?.user;

    // Redirect logic
    if (!isAuthenticated && inAuthGroup) {
      // Not logged in but trying to access auth routes → Login
      router.replace("/(app)/(public)/Login");
    } else if (isAuthenticated && !inAuthGroup && !legalPages) {
      // Logged in but on public routes → Home
      // router.replace("/(app)/(auth)/(tabs)/Home");
      if (isBiometricAvailable && isBiometricEnrolled && !isBiometricEnabled) {
        return;
      } else {
        router.replace("/(app)/(auth)/(tabs)/Home");
      }
    }
  }, [sessionData, segments, isSessionLoading]);

  return (
    <Animated.View entering={FadeIn.duration(400)} className="flex-1">
      {children}
    </Animated.View>
  );
}
