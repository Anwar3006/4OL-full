import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function LogoutCard() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6">
      {/* Dimmed Background Backdrop */}
      <Animated.View
        entering={FadeIn.duration(300)}
        className="absolute inset-0 bg-black/60"
      >
        <Pressable className="flex-1" onPress={() => router.back()} />
      </Animated.View>

      {/* The Logout Card */}
      <Animated.View
        entering={ZoomIn.duration(300).springify().damping(60)}
        className="w-full max-w-[340px] bg-white rounded-[40px] p-8 items-center shadow-2xl"
      >
        {/* Warning Icon */}
        <View className="bg-red-50 p-5 rounded-full mb-6">
          <Ionicons name="log-out" size={32} color="#ef4444" />
        </View>

        <Text className="text-2xl font-black text-slate-900 mb-2">
          Logging Out?
        </Text>

        <Text className="text-gray-500 text-center text-base leading-5 mb-8">
          You'll need to enter your credentials to access your medical records
          again.
        </Text>

        <View className="flex-col gap-y-3 w-full">
          <TouchableOpacity
            onPress={() => {
              // Trigger your logout logic
              console.log("User logged out");
            }}
            activeOpacity={0.8}
            className="w-full h-14 items-center justify-center rounded-2xl bg-red-500"
          >
            <Text className="font-bold text-white text-lg">
              Yes, Log Me Out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-full h-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100"
          >
            <Text className="font-bold text-slate-600">Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
