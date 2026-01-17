import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Route, useRouter } from "expo-router";

interface MenuItemProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Route;
  isLogout?: boolean;
}

const ProfileMenuItem = ({ label, icon, href, isLogout }: MenuItemProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(href as any)}
      activeOpacity={0.6}
      className="flex-row items-center justify-between py-5 border-b border-gray-100"
    >
      <View className="flex-row items-center gap-x-4">
        <View
          className={`p-2 rounded-xl ${isLogout ? "bg-red-50" : "bg-transparent"}`}
        >
          <Ionicons
            name={icon}
            size={24}
            color={isLogout ? "#ef4444" : "#10b981"}
          />
        </View>
        <Text
          className={`text-base font-semibold ${isLogout ? "text-red-500" : "text-slate-700"}`}
        >
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );
};

export default ProfileMenuItem;
