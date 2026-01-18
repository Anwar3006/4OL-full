import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Slot, useSegments, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { authClient } from "@/lib/auth-Client";
import { Alert } from "react-native";
import { useUserProfile } from "@/hooks/use-userProfile";
import useUserStore from "@/store/use-userstore";
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_900Black,
  });

  // Reanimated logger, disable logger
  useEffect(() => {
    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false,
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

// Auth protection logic
function AuthProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { setUser } = useUserStore();

  const { data: sessionData, isPending: isSessionLoading } =
    authClient.useSession();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(
    sessionData?.user?.id!
  );

  // Sync Supabase data to Zustand Store
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile, setUser]);

  // Handle Redirection Logic
  useEffect(() => {
    if (isSessionLoading) return; // Wait until session is determined

    // segments will look like: ["(app)", "(auth)", "(tabs)", "Home"]
    // We need to check if ANY segment in the current path is protected
    const inAuthGroup = (segments as string[]).some(
      (segment) => segment === "(auth)"
    );
    const isAuthenticated = !!sessionData?.user;

    // Only redirect to Home if we are actually on a landing/login page
    const isLoginPage =
      (segments as string[]).includes("Login") ||
      (segments as string[]).includes("Welcome");

    if (!isAuthenticated && inAuthGroup) {
      // Force immediate jump to Login if session dies while inside protected area
      router.replace("/Login");
    } else if (isAuthenticated && isLoginPage) {
      // Only redirect to Home if the user is explicitly on a Public Page
      router.replace("/(app)/(auth)/(tabs)/Home");
    }
  }, [sessionData, segments, isSessionLoading]);

  if (isSessionLoading || isProfileLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

export default RootLayout;
