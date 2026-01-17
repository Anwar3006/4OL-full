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

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_900Black,
  });

  if (!fontsLoaded) return null;

  // Reanimated logger, disable logger
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* <AuthProvider> */}
        <Slot />
        {/* </AuthProvider> */}
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

// Auth protection logic
function AuthProvider({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();

  // TODO: Replace with your actual auth check
  const isAuthenticated = false; // Check your auth state here (e.g., from BetterAuth/Supabase)

  useEffect(() => {
    const protectedRoutes = ["(auth)"];
    const inProtectedRoute = protectedRoutes.includes(segments[0] || "");

    if (!isAuthenticated && inProtectedRoute) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace("/Login");
    } else if (isAuthenticated && !inProtectedRoute && segments[0]) {
      // Redirect to app if authenticated and on public routes
      // router.replace("/(app)/(auth)");
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default RootLayout;
