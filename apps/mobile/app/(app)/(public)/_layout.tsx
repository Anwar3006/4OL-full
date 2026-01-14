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
    </Stack>
  );
}
