import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VerifyPhoneNumber = () => {
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
        <Text className="text-3xl font-bold">Verify Phone Number</Text>
        {/* phone number form */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPhoneNumber;
