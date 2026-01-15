import {
  View,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OTPForm from "@/components/auth/OTPForm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const OTP = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isLargeScreen = width > 600;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 10,
          paddingHorizontal: isLargeScreen ? width * 0.2 : 10,
          marginTop: insets.top + 50,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-10 left-6 h-12 w-12 rounded-full border border-black items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Header Branding */}
        <View className="mb-12 items-center">
          <View className="bg-green-600/20 p-4 rounded-3xl mb-6">
            <Ionicons name="shield-checkmark" size={40} color="#10b981" />
          </View>
          <Text className="text-4xl font-black text-black tracking-tighter text-center">
            Enter Security Code
          </Text>
          <Text className="text-gray-400 mt-3 text-lg text-center leading-6">
            We just sent a 6-digit verification code to your phone number.
          </Text>
        </View>

        {/* OTP Input Section */}
        <View className="bg-white/5 border border-white/10 p-8 rounded-[40px] shadow-2xl">
          <OTPForm />
        </View>

        <View className="mt-10 items-center">
          <Text className="text-white/30 text-xs font-medium uppercase tracking-[3px]">
            4 Our Life Security
          </Text>
        </View>

        {/* Remove - Go to OTP - For Development only */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/(public)/SignUp")}
          className="absolute bottom-12 right-6 h-12 w-12 rounded-full bg-red-400 border border-white/10 items-center justify-center"
        >
          <Ionicons name="arrow-forward-circle" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTP;
