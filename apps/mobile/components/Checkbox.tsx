import React from "react";
import { Pressable, View, Text } from "react-native";
import { cn } from "@/lib/utils";
import Ionicons from "@expo/vector-icons/Ionicons";

interface CheckboxProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = ({
  value,
  onValueChange,
  label,
  error,
}: CheckboxProps) => {
  return (
    <View className="flex-col gap-1 w-full">
      <Pressable
        onPress={() => onValueChange(!value)}
        className="flex-row items-center gap-3 active:opacity-70 py-1"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: value }}
      >
        <View
          className={cn(
            "h-6 w-6 rounded-md border-2 items-center justify-center transition-colors",
            value
              ? "bg-green-600 border-green-600"
              : "border-gray-400 bg-white/5"
          )}
        >
          {value && (
            <Ionicons
              name="checkmark"
              size={16}
              color="white"
              strokeWidth={3}
            />
          )}
        </View>

        {label && <View className="flex-1 max-w-[450px]">{label}</View>}
      </Pressable>
      {error && <Text className="text-xs text-red-500 ml-9">{error}</Text>}
    </View>
  );
};
