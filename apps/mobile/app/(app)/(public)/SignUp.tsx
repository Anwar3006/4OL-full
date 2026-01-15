import {
  View,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignUpForm from "@/components/auth/SignUpForm";
import { Ionicons } from "@expo/vector-icons";

//include Tiktok OAuth through Better Auth. After the flow, redirect them to the User Profile form to complete the needed data
const SignUpScreen = () => {
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
        <View className="mb-3 items-center md:items-start">
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
            Hello there!<Text className="text-green-500">.</Text>
          </Text>
          <Text className="text-gray-400 mt-2 text-lg text-center">
            Since this is our first meeting. You need to create an account.
          </Text>
        </View>

        {/* Form Card */}
        <View className="flex-1 border border-white/10 p-8 rounded-[40px] backdrop-blur-3xl shadow-2xl">
          <SignUpForm />
        </View>

        {/* Biometric Placeholder */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
