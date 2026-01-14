import {
  View,
  Text,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OTP = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName={`flex-1 ${isLargeScreen ? "px-20" : "px-4"}`}
      >
        <Text className="text-3xl font-bold">Enter OTP</Text>
        {/* OTP form */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTP;
