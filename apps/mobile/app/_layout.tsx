import "../global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

export default function RootLayout() {
  return <Stack />;
}
