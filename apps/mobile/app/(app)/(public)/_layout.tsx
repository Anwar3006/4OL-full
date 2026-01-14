import { Stack } from "expo-router";

export default function PublicScreensLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />

      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />

      <Stack.Screen
        name="SignUp"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />

      {/* Modals */}
      <Stack.Screen
        name="(legal)/Terms"
        options={{
          presentation: "modal",
          headerTitle: "Terms of Service",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(legal)/Privacy"
        options={{
          presentation: "modal",
          headerTitle: "Privacy Policy",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
