import { View, Text } from "react-native";
import React from "react";
import z from "zod";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CustomInput } from "./CustomInput";

const searchInputSchema = z.object({
  search: z.string().min(2, "Search is too short"),
});
type SearchFormValues = z.infer<typeof searchInputSchema>;

const Search = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchInputSchema),
    defaultValues: { search: "" },
  });

  return (
    <View className="w-full gap-y-5">
      <Controller
        control={control}
        name="search"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            label=""
            placeholder="Find pharmacies, hospitals..."
            keyboardType="default"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.search?.message}
            icon="search"
          />
        )}
      />
    </View>
  );
};

export default Search;
