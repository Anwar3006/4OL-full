import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { authClient } from "@/lib/auth-client"; // Your Better Auth client
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomInput } from "../CustomInput";
import { Checkbox } from "../Checkbox";
import { authClient } from "@/lib/auth-Client";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSharedValue, withTiming } from "react-native-reanimated";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.email("Invalid email").optional().or(z.literal("")),
    dob: z.string().min(1, "Date of birth is required"),
    sex: z.enum(["Male", "Female", "Other"], {
      error: () => ({ message: "Please select your sex" }),
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptContract: z.literal(false, {
      error: () => ({ message: "You must accept the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const progress = useSharedValue(0.5);
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date()); // Temporary state for iOS "scrolling"

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // Validate as they go
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      sex: undefined,
      acceptContract: false,
    },
  });

  const prevStep = () => setStep(1);

  useEffect(() => {
    progress.value = withTiming(step === 1 ? 0.5 : 1, { duration: 300 });
  }, [step]);

  // Handle "Next" with validation for specific fields
  const handleNext = async () => {
    const isStep1Valid = await trigger(["firstName", "lastName", "dob", "sex"]);
    if (isStep1Valid) setStep(2);
  };

  const onSubmit = async (data: SignUpFormValues) => {
    await authClient.signIn.email({
      email: data.email!,
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

  const formatDisplayDate = (date: string): string => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (date) setValue("dob", date.toISOString().split("T")[0]);
    } else {
      // iOS: Just update temp date while user scrolls
      if (date) setTempDate(date);
    }
  };

  const confirmIOSDate = () => {
    setValue("dob", tempDate.toISOString().split("T")[0]);
    setShowDatePicker(false);
  };

  return (
    <View className="w-full gap-y-4">
      {/* Step Indicator */}
      <View className="flex-row gap-x-2 mb-2">
        <View
          className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`}
        />
        <View
          className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`}
        />
      </View>

      {step === 1 ? (
        <View
          style={{ display: step === 1 ? "flex" : "none" }}
          className="gap-y-4"
        >
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

          <Controller
            control={control}
            name="dob"
            render={({ field: { value } }) => (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View pointerEvents="none">
                  <CustomInput
                    label="Date of Birth"
                    placeholder="Select Date"
                    value={formatDisplayDate(value)}
                    icon="calendar-outline"
                    error={errors.dob?.message}
                  />
                </View>
              </TouchableOpacity>
            )}
          />

          {/* iOS DATE PICKER MODAL */}
          {Platform.OS === "ios" && (
            <Modal visible={showDatePicker} transparent animationType="slide">
              <View className="flex-1 justify-end bg-black/40">
                <View className="bg-[#1c1c1e] rounded-t-[32px] p-6 pb-10">
                  <View className="flex-row justify-between items-center mb-4">
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text className="text-gray-400 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">
                      Birth date
                    </Text>
                    <TouchableOpacity onPress={confirmIOSDate}>
                      <Text className="text-green-500 font-bold">Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                    textColor="white"
                  />
                </View>
              </View>
            </Modal>
          )}

          {/* ANDROID DATE PICKER */}
          {Platform.OS === "android" && showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          <View className="gap-y-1.5">
            <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider ml-1">
              Sex
            </Text>
            <View className="flex-row gap-x-4">
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setValue("sex", option as any)}
                  className={cn(
                    "flex-1 h-14 rounded-2xl border items-center justify-center bg-white/5",
                    watch("sex") === option
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-400"
                  )}
                >
                  <Text
                    className={cn(
                      "font-bold",
                      watch("sex") === option
                        ? "text-green-500"
                        : "text-gray-400"
                    )}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.sex && (
              <Text className="text-xs text-red-400 ml-1">
                {errors.sex.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="mt-6 h-16 w-full items-center justify-center rounded-2xl bg-green-600 shadow-sm"
          >
            <Text className="text-lg font-bold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{ display: step === 2 ? "flex" : "none" }}
          className="gap-y-4"
        >
          {/* Email Field */}
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
                icon="lock-closed-outline"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry
                icon="shield-checkmark-outline"
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
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
                    <Link
                      href="/(app)/(public)/(legal)/Terms"
                      className="text-green-500 font-bold underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/(app)/(public)/(legal)/Privacy"
                      className="text-green-500 font-bold underline"
                    >
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

          <View className="flex-row gap-x-4 mt-4">
            <TouchableOpacity
              onPress={prevStep}
              className="h-16 flex-[2] items-center justify-center rounded-2xl bg-black border border-white/10"
            >
              <Text className="text-white font-bold">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}
              className="h-16 flex-[3] flex-row items-center justify-center rounded-2xl bg-green-600 shadow-sm"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-white">Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
