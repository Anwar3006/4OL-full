import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomInput } from "@/components/CustomInput";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\d{7,15}$/, "Please enter a valid phone number"),
  countryCallingCode: z.string(),
});
type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

const VerifyPhoneNumber = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [country, setCountry] = React.useState({
    code: "GH",
    callingCode: "233",
  });

  const isLargeScreen = width > 600;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: { phoneNumber: "", countryCallingCode: "233" },
  });

  const onSubmit = async (data: PhoneNumberFormValues) => {
    const fullNumber = `+${country.callingCode}${data.phoneNumber}`;
    console.log("Sending OTP to:", fullNumber);
    // Trigger BetterAuth OTP flow here
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 10,
          paddingHorizontal: isLargeScreen ? width * 0.2 : 10,
          marginTop: insets.top + 50,
        }}
      >
        {/* Header */}
        <View className="mb-6 flex items-center">
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
            Verify your contact<Text className="text-green-500">.</Text>
          </Text>
          <Text className="text-gray-400 mt-2 text-lg leading-6">
            We'll send a 6-digit code to verify your account.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white/5 border border-white/10 p-8 rounded-[40px] shadow-2xl">
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Phone Number"
                placeholder="55 123 4567"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phoneNumber?.message}
                isPhoneNumber
                countryCode={country.code}
                onCountrySelect={(c) =>
                  setCountry({
                    code: c.cca2 as string,
                    callingCode: c.callingCode[0],
                  })
                }
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="mt-8 h-16 w-full flex-row items-center justify-center rounded-2xl bg-green-600 shadow-sm"
          >
            <Text className="text-lg font-bold text-white mr-2">Send Code</Text>
            <Ionicons name="paper-plane" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 text-center mt-8 px-4 text-xs">
          Standard message and data rates may apply.
        </Text>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-10 left-6 h-12 w-12 rounded-full bg-green-600 border border-white/10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Remove - Go to OTP - For Development only */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/(public)/OTP")}
          className="absolute bottom-12 right-6 h-12 w-12 rounded-full bg-red-400 border border-white/10 items-center justify-center"
        >
          <Ionicons name="arrow-forward-circle" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPhoneNumber;
