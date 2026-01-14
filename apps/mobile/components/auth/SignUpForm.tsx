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

const loginSchema = z.object({
  firstName: z.string().min(3, "Please enter your firstname"),
  lastName: z.string().min(3, "Please enter your lastname"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptContract: z.literal(true, {
    error: () => ({ message: "You must accept the terms to continue" }),
  }),
});

type SignUpFormValues = z.infer<typeof loginSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (ctx: any) => {
          Alert.alert("Registration Failed", ctx.error.message);
        },
        onSuccess: () => {
          //   router.replace("/(tabs)");
        },
      },
    });
  };

  return (
    <View className="w-full gap-y-4">
      {/* Full Name Field */}
      <View className="flex-1 grid grid-cols-2 gap-3 items-center">
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="First Name"
              placeholder="Kweku"
              keyboardType="default"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomInput
              label="Last Name"
              placeholder="The Traveler"
              keyboardType="default"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.lastName?.message}
            />
          )}
        />
      </View>

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Email Address"
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      {/* Password Field */}
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
          />
        )}
      />

      {/* Accept Contract */}
      <Controller
        control={control}
        name="acceptContract"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            value={value}
            onValueChange={onChange}
            error={errors.acceptContract?.message}
            label={
              <Text className="text-gray-300 text-sm leading-5">
                I agree to the{" "}
                <Link href="/" className="text-green-500 font-bold underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/" className="text-green-500 font-bold underline">
                  Privacy Policy
                </Link>
              </Text>
            }
          />
        )}
      />
      {errors.acceptContract && (
        <Text className="text-red-500 text-xs">
          {errors.acceptContract.message}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.8}
        className="mt-4 h-14 w-full flex-row items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-900"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold text-white">Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
