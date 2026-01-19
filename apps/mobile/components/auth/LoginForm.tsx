import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { CustomInput } from "../CustomInput";
import { authClient } from "@/lib/auth-Client";
import { Ionicons } from "@expo/vector-icons";
import { useBiometricAuth } from "@/hooks/use-biometric-auth";
import { BiometricSetupPrompt } from "./BiometricSetupPrompt";
import { BiometricLoginButton } from "./BiometricLoginButton";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [pendingCredentials, setPendingCredentials] =
    useState<LoginFormValues | null>(null);

  const {
    isAvailable: isBiometricAvailable,
    isEnrolled: isBiometricEnrolled,
    biometricType,
    isBiometricEnabled,
    enableBiometric,
  } = useBiometricAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  /**
   * Handle successful login and optionally prompt for biometric setup
   */
  const handleLoginSuccess = async (
    credentials: LoginFormValues,
    skipBiometricPrompt = false
  ) => {
    // Navigate to home
    router.replace("/(app)/(auth)/(tabs)/Home");

    // Check if we should prompt for biometric setup
    // Only prompt if:
    // 1. Biometric is available and enrolled
    // 2. User hasn't enabled it yet
    // 3. We're not skipping the prompt (e.g., for biometric login)
    if (
      !skipBiometricPrompt &&
      isBiometricAvailable &&
      isBiometricEnrolled &&
      !isBiometricEnabled
    ) {
      setPendingCredentials(credentials);
      setShowBiometricPrompt(true);
    }
  };

  /**
   * Handle login with email/password
   */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        // callbackURL: "4ol://(app)/(auth)/(tabs)/Home",
        fetchOptions: {
          onError: (ctx: any) => {
            Alert.alert("Login Failed", ctx.error.message);
          },
          onSuccess: () => {
            handleLoginSuccess(data);
          },
        },
      });

      // If no onSuccess was called (shouldn't happen but just in case)
      if (!result.error) {
        handleLoginSuccess(data);
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    }
  };

  /**
   * Handle biometric login
   */
  const handleBiometricLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
        fetchOptions: {
          onError: (ctx: any) => {
            Alert.alert("Login Failed", ctx.error.message);
          },
          onSuccess: () => {
            handleLoginSuccess(credentials, true); // Skip biometric prompt
          },
        },
      });

      if (!result.error) {
        handleLoginSuccess(credentials, true);
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    }
  };

  /**
   * Handle enabling biometric authentication
   */
  const handleEnableBiometric = async () => {
    if (!pendingCredentials) return;

    setShowBiometricPrompt(false);

    try {
      const success = await enableBiometric(
        pendingCredentials.email,
        pendingCredentials.password
      );

      if (success) {
        Alert.alert(
          "Success!",
          `${biometricType === "facial" ? "Face ID" : "Touch ID"} has been enabled. You can now use it to sign in.`
        );
      } else {
        Alert.alert(
          "Setup Failed",
          "Unable to enable biometric authentication. Please try again in settings."
        );
      }
    } catch (error) {
      console.error("Error enabling biometric:", error);
      Alert.alert(
        "Error",
        "An error occurred while setting up biometric authentication."
      );
    } finally {
      setPendingCredentials(null);
    }
  };

  /**
   * Handle dismissing biometric prompt
   */
  const handleBiometricLater = () => {
    setShowBiometricPrompt(false);
    setPendingCredentials(null);
    router.replace("/(app)/(auth)/(tabs)/Home");
  };

  return (
    <>
      <View className="w-full gap-y-5">
        {/* Show biometric login button if enabled */}
        <BiometricLoginButton onSuccess={handleBiometricLogin} />

        {/* Divider */}
        {isBiometricEnabled && (
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-gray-400 text-sm mx-4">
              Or sign in with email
            </Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>
        )}

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Email Address"
              placeholder="kwakuTheTraveller@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
              icon="mail-outline"
            />
          )}
        />

        {/* Password Input */}
        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                icon="lock-closed-outline"
              />
            )}
          />
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-green-500 text-xs font-bold">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
          className="mt-6 h-16 w-full flex-row items-center justify-center rounded-3xl bg-green-600 shadow-sm"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-lg font-bold text-white mr-2">Log in</Text>
              <Ionicons name="log-in-outline" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center mt-2">
          <Text className="text-gray-400">Don't have an account? </Text>
          <Link href="/SignUp">
            <Text className="text-green-500 font-bold underline">Sign Up</Text>
          </Link>
        </View>
      </View>

      {/* Biometric Setup Prompt */}
      <BiometricSetupPrompt
        visible={showBiometricPrompt}
        biometricType={biometricType}
        onEnable={handleEnableBiometric}
        onLater={handleBiometricLater}
      />
    </>
  );
}
