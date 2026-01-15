import {
  View,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginForm from "@/components/auth/LoginForm";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  //Logic for Foldables
  const isLargeScreen = width > 600;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: isLargeScreen ? width * 0.2 : 10,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Branding Header */}
        <View className="mb-8 items-center md:items-start">
          <View className="bg-white w-16 h-16 rounded-2xl items-center justify-center mb-4 shadow-sm">
            <Image
              source={require("@/assets/icons/splash-icon-light.png")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover", // or 'cover', 'stretch', 'repeat', 'center'
              }}
            />
          </View>
          <Text className="text-4xl font-black text-black tracking-tighter">
            Welcome Back<Text className="text-green-500">.</Text>
          </Text>
          <Text className="text-gray-400 mt-2 text-lg">
            Sign in to continue to your health dashboard.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl shadow-2xl">
          <LoginForm />
        </View>

        {/* Biometric Placeholder */}
        <TouchableOpacity className="mt-8 items-center flex-row justify-center gap-x-2">
          <Ionicons name="finger-print" size={24} color="#16a34a" />
          <Text className="text-gray-400 font-medium">Use Biometric Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
