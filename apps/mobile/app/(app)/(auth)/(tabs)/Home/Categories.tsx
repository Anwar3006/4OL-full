import { View, Text, FlatList, Platform } from "react-native";
import React from "react";
import { useCategoryData } from "@/hooks/use-categoryData";
import { CategoryLarge } from "@/components/home/CategoryComponents";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

const Categories = () => {
  const insets = useSafeAreaInsets();
  const { categories, width } = useCategoryData();
  const isLargeScreen = width > 600;

  return (
    <View className="flex-1 bg-[#EBF9E6]">
      <FlashList
        data={categories}
        keyExtractor={(item) => item.id}
        // FlashList handles numColumns changes more gracefully than FlatList
        numColumns={isLargeScreen ? 2 : 1}
        // IMPORTANT: FlashList needs this to prevent the "packing" bug.
        // Since your CategoryLarge 'h-24' is roughly 96px, we use 100 as an estimate.
        // estimatedItemSize={100}

        ListHeaderComponent={
          <View className="px-4 mt-6 mb-4">
            <Text className="text-3xl font-black text-slate-900">
              All Categories
            </Text>
            <Text className="text-gray-500 font-medium">
              Select a category to find specialized care
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className={isLargeScreen ? "p-2" : "px-4 mb-4"}>
            <CategoryLarge
              title={item.title}
              icon={item.icon}
              screen={item.screen}
              isLargeScreen={isLargeScreen}
            />
          </View>
        )}
        contentContainerStyle={{
          paddingTop: insets.top + 30,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;
