import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#EBF9E6" } }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
          headerLargeTitleEnabled: true,
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
