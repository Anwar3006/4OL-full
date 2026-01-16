import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

const CampaignBox = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  const title = "Instant Help\n Near You";
  const content = `Access 24/7 emergency support services with one tap.`;

  return (
    <View className="my-4 w-full items-center">
      <LinearGradient
        colors={["#10b981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // FIX: Rounded corners must be here
        style={{
          borderRadius: 32,
          width: isLargeScreen ? 550 : "100%", // Prevent stretching on Foldable
          overflow: "hidden",
        }}
      >
        <View className="flex-row items-center px-6 py-6">
          {/* Left Content */}
          <View className="flex-[1.4] gap-y-2">
            <View className="bg-black/20 self-start px-3 py-1 rounded-full mb-1">
              <Text className="text-white text-[10px] font-black uppercase tracking-[2px]">
                Campaign
              </Text>
            </View>

            <Text className="text-2xl font-black text-white leading-7 tracking-tight">
              {title}
            </Text>

            <Text className="text-emerald-50/80 max-w-[14rem] text-sm font-medium leading-5 mb-2">
              {content.length > 50 ? content.slice(0, 50) + "..." : content}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-white h-12 px-6 rounded-2xl flex-row items-center justify-center self-start shadow-sm"
            >
              <Text className="text-emerald-700 font-bold mr-2">Get Help</Text>
              <Ionicons name="call" size={18} color="#047857" />
            </TouchableOpacity>
          </View>

          {/* Right Content: Pop-out Image/Icon */}
          <View className="flex-1 items-end">
            <View className="relative">
              {/* Soft glow behind the asset */}
              <View
                className="absolute inset-0 bg-white/20 rounded-full"
                style={{ transform: [{ scale: 1.5 }] }}
              />

              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png",
                }}
                className="w-28 h-28"
                style={{
                  transform: [{ rotate: "-10deg" }, { translateY: 5 }],
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CampaignBox;
