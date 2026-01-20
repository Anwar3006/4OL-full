import React from "react";
import { Stack } from "expo-router";

const AuthScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Full-Screen Routes */}
      <Stack.Screen
        name="Facility/[id]"
        options={{
          headerShown: false,
          presentation: "card", // Standard push navigation
          animation: "slide_from_right",
        }}
      />

      {/* Modal Routes */}
      <Stack.Screen
        name="(modal)"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthScreensLayout;
