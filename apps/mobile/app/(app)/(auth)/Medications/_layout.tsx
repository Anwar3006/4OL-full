import { Stack } from "expo-router";

export default function MedicationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Medications",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: "Medication History",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
