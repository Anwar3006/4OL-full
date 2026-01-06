import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      {/* Screen for a file named index.tsx */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      />

      {/* Screen for a file named other-options.tsx */}
      <Stack.Screen
        name="other-options"
        options={{
          headerShown: false,
          presentation: "formSheet",
          title: "",
          headerShadowVisible: false,
          sheetAllowedDetents: [0.6], // 60% of the screen height
          sheetCornerRadius: 16, // Rounded corners
        }}
      />
    </Stack>
  );
};
