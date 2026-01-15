import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;

export default function OTPForm() {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  const handleTextChange = (text: string) => {
    setCode(text);
    if (text.length === CODE_LENGTH) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleVerify(text);
    }
  };

  const handleVerify = async (otp: string) => {
    setIsVerifying(true);
    // Add your BetterAuth / Supabase verification logic here
    console.log("Verifying OTP:", otp);
    setTimeout(() => setIsVerifying(false), 2000);
  };

  return (
    <View className="w-full items-center gap-y-8">
      {/* Hidden input to handle keyboard and focus */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleTextChange}
        maxLength={CODE_LENGTH}
        keyboardType="number-pad"
        textContentType="oneTimeCode" // Enables iOS "From Messages" autofill
        autoFocus
        style={{ opacity: 0, position: "absolute", width: 1 }}
      />

      {/* Visual Boxes */}
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-between w-full gap-x-2"
      >
        {Array.from({ length: CODE_LENGTH }).map((_, index) => {
          const char = code[index];
          const isFocused = code.length === index;

          return (
            <View
              key={index}
              className={cn(
                "h-16 flex-1 rounded-2xl border bg-white/5 items-center justify-center transition-all",
                isFocused
                  ? "border-green-500 bg-white/10 scale-105 shadow-lg shadow-green-500/20"
                  : "border-gray-400",
                char ? "border-green-500/50" : ""
              )}
            >
              <Text className="text-2xl font-black text-black">
                {char || (isFocused ? "" : "•")}
              </Text>
            </View>
          );
        })}
      </Pressable>

      <View className="items-center gap-y-4 w-full">
        <TouchableOpacity
          disabled={isVerifying || code.length !== CODE_LENGTH}
          onPress={() => handleVerify(code)}
          className={cn(
            "h-16 w-full rounded-2xl flex-row items-center justify-center shadow-xl transition-all",
            code.length === CODE_LENGTH
              ? "bg-green-600 shadow-green-900"
              : "bg-gray-800 opacity-50"
          )}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white uppercase tracking-widest">
              Verify & Continue
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Resend code")}>
          <Text className="text-gray-400 font-medium">
            Didn't receive the code?{" "}
            <Text className="text-green-500 font-bold underline">Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
