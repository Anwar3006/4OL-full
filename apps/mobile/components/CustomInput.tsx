import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <View className={cn("flex flex-col gap-1.5 w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-medium text-gray-200 ml-1">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor="#94a3b8"
          className={cn(
            "h-14 w-full rounded-2xl border bg-white/5 px-4 text-white transition-all",
            error ? "border-red-500" : "border-white/10 focus:border-green-500",
            className
          )}
          {...props}
        />
        {error && (
          <Text className="text-xs text-red-500 ml-1 font-medium">{error}</Text>
        )}
      </View>
    );
  }
);

CustomInput.displayName = "CustomInput";
