import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCategoryData } from "@/hooks/use-categoryData";
import { CategorySmall } from "./CategoryComponents";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CategoryList = () => {
  const { categories, width } = useCategoryData();
  const router = useRouter();

  // Logic: 4 items for mobile (2x2), 5-6 for larger screens
  const isLargeScreen = width > 600;
  const displayLimit = isLargeScreen ? 5 : 3;
  const displayedCategories = categories.slice(0, displayLimit);

  return (
    <View className="w-full mt-6">
      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-xl font-black text-slate-900">Categories</Text>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(auth)/(tabs)/Home/Categories")}
          className="flex-row items-center"
        >
          <Text className="text-green-600 font-bold mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Grid Layout */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {displayedCategories.map((item) => (
          <CategorySmall
            key={item.id}
            title={item.title}
            icon={item.icon}
            screen={item.screen}
            // Dynamically adjust width based on screen size so they fit perfectly
            containerClassName={isLargeScreen ? "w-[18%]" : "w-[30%]"}
          />
        ))}
      </View>
    </View>
  );
};

export default CategoryList;
