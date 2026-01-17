import React from "react";
import { Stack } from "expo-router";

const AuthScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

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
