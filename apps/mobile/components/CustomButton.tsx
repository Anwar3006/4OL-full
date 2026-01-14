import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Href, Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type CustomButtonProps = {
  title: string;
  href: Href;
  containerClassName?: string;
  textClassName?: string;
  icon: keyof typeof Ionicons.glyphMap;
};

//
const CustomButton = ({
  title,
  href,
  containerClassName,
  textClassName,
  icon,
}: CustomButtonProps) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        activeOpacity={0.8}
        className={`flex-row gap-2 flex-1 h-16 rounded-3xl items-center justify-center  ${containerClassName}`}
      >
        <Text className={`text-lg ${textClassName}`}>{title}</Text>
        <Ionicons name={icon} size={24} color="white" />
      </TouchableOpacity>
    </Link>
  );
};

export default CustomButton;
