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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSignUpStore } from "@/store/use-signupStore";

const editUserInfoSchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  phone_number: z
    .string()
    .regex(/^\d{7,15}$/, "Please enter a valid phone number"),
  dob: z.string().min(1, "Date of birth is required"),
  sex: z.enum(["Male", "Female", "Other"], {
    error: () => ({ message: "Please select your sex" }),
  }),
  email: z.email("Invalid email").optional().or(z.literal("")),
});

type EditUserInfoFormValues = z.infer<typeof editUserInfoSchema>;

export default function EditUserInfoForm() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [country, setCountry] = useState({
    code: "GH",
    callingCode: "233",
  });
  const { first_name, last_name, dob, sex, email, setStep1Data } =
    useSignUpStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserInfoFormValues>({
    resolver: zodResolver(editUserInfoSchema),
    mode: "onChange",
    defaultValues: {
      first_name: first_name || "",
      last_name: last_name || "",
      dob: dob || "",
      sex: sex as any,
      email: email || "",
    },
  });

  const onSubmit = async (data: EditUserInfoFormValues) => {
    // await authClient. .email({
    //   email: data.email!,
    //   password: data.password,
    //   callbackURL: "/dashboard",
    //   fetchOptions: {
    //     onError: (ctx: any) => {
    //       Alert.alert("Registration Failed", ctx.error.message);
    //     },
    //     onSuccess: () => {
    //       router.replace("/(app)/(auth)/(tabs)/Home");
    //     },
    //   },
    // });
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

  const handleCancel = () => {
    reset();
  };

  return (
    <View className="flex-1 w-full gap-y-4">
      <Controller
        control={control}
        name="first_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="First Name"
            placeholder="Kweku"
            keyboardType="default"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.first_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="last_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Last Name"
            placeholder="The Traveler"
            keyboardType="default"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.last_name?.message}
          />
        )}
      />

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

      <Controller
        control={control}
        name="phone_number"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label="Phone Number"
            placeholder="55 123 4567"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.phone_number?.message}
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
                <Text className="text-white font-bold text-lg">Birth date</Text>
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
                  watch("sex") === option ? "text-green-500" : "text-gray-400"
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

      <View className="flex-row gap-x-4 mt-4">
        <TouchableOpacity
          onPress={handleCancel}
          className="h-16 flex-[2] items-center justify-center rounded-2xl bg-black border border-white/10"
        >
          <Text className="text-white font-bold">Cancel</Text>
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
  );
}
