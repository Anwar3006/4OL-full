import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";

interface CategorySmallProps {
  title: string;
  icon: React.ReactNode;
  screen: string;
  containerClassName?: string;
}

export const CategorySmall = ({
  title,
  icon,
  screen,
  containerClassName,
}: CategorySmallProps) => {
  return (
    // We map 'screen' to your route path
    <Link href={`/${screen}` as any} asChild>
      <TouchableOpacity
        activeOpacity={0.7}
        className={cn(
          "w-[105px] h-[105px] bg-white rounded-[2.4rem] items-center justify-center p-2 shadow-sm border border-gray-100",
          containerClassName
        )}
      >
        <View className="h-12 w-12 items-center justify-center mb-1">
          {icon}
        </View>

        <Text
          numberOfLines={2}
          className="text-xs font-bold text-gray-700 text-center leading-3 px-1"
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

interface CategoryLargeProps extends CategorySmallProps {
  isLargeScreen: boolean;
}
export const CategoryLarge = ({
  title,
  icon,
  screen,
  containerClassName,
  isLargeScreen,
}: CategoryLargeProps) => {
  return (
    <Link href={`/${screen}` as any} asChild>
      <TouchableOpacity
        activeOpacity={0.7}
        className={cn(
          "h-24 flex-1 flex-row bg-white rounded-3xl items-center justify-between px-4 shadow-sm border border-gray-100",
          isLargeScreen ? "flex-1" : "w-full",
          containerClassName
        )}
      >
        <View className="flex-row items-center flex-1">
          <View className="h-14 w-14 items-center justify-center bg-gray-100 rounded-2xl">
            {icon}
          </View>

          <Text
            numberOfLines={2}
            className="text-base font-bold text-gray-800 ml-4 flex-1"
          >
            {title}
          </Text>
        </View>

        <View className="bg-green-50 p-2 rounded-full">
          <Ionicons name="chevron-forward" size={18} color="#16a34a" />
        </View>
      </TouchableOpacity>
    </Link>
  );
};
