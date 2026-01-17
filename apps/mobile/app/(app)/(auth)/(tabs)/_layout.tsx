import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 700,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              // color={"#008000"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          headerShown: false,
          title: "Map",
          tabBarIcon: ({ size, focused, color }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="My Account"
        options={{
          headerShown: false,
          title: "My Account",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
