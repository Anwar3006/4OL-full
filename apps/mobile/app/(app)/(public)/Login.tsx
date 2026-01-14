import {
  View,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoginForm from "@/components/auth/LoginForm";

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  //Logic for Foldables
  const isLargeScreen = width > 600;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView
        className={`flex-1 items-center justify-center ${isLargeScreen ? "px-20" : "px-4"}`}
      >
        <Text className="text-3xl font-bold text-center">Hello there!</Text>
        {/* Your Form */}
        <LoginForm />

        {/* or use biometric */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
