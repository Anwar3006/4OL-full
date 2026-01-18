import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { authClient } from "@/lib/auth-client"; // Your Better Auth client
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomInput } from "../CustomInput";
import { Checkbox } from "../Checkbox";
import { authClient } from "@/lib/auth-Client";
import { Ionicons } from "@expo/vector-icons";
import useUserStore from "@/store/use-userstore";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  // const { setUser} = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      // callbackURL: "4ol://(app)/(auth)/(tabs)/Home",
      fetchOptions: {
        onError: (ctx: any) => {
          Alert.alert("Login Failed", ctx.error.message);
        },
        onSuccess: () => {
          router.replace("/(app)/(auth)/(tabs)/Home");
        },
      },
    });
  };

  return (
    <View className="w-full gap-y-5">
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

      <View className="flex-row justify-center items-center mt-2">
        <Text className="text-gray-400">Don't have an account? </Text>
        <Link href="/SignUp">
          <Text className="text-green-500 font-bold underline">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}
