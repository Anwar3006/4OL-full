import React from "react";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const ModalsLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f8fafc" },
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="SearchResultModal"
        options={{
          presentation: "modal", // This triggers the slide-up effect
          headerShown: true,
          headerTitle: "Search Results",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-green-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="DiseasesModal"
        options={{
          presentation: "modal", // This triggers the slide-up effect
          headerShown: false,
          headerTitle: "Diseases",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-green-600 font-semibold">Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default ModalsLayout;
