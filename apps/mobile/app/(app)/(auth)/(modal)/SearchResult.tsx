import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSearchResults } from "@/hooks/use-search-results";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

const SearchResult = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    facilityType?: string;
    search?: string;
  }>();

  // Fetch data based on params
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useSearchResults({
    facilityType: params.facilityType,
    search: params.search,
  });

  // Update header title based on search type
  useEffect(() => {
    if (params.facilityType) {
      navigation.setOptions({
        headerTitle: params.facilityType,
      });
    } else if (params.search) {
      navigation.setOptions({
        headerTitle: `Results for "${params.search}"`,
      });
    }
  }, [params.facilityType, params.search, navigation]);

  // Flatten paginated data
  const facilities = data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-600 mt-4">Loading results...</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          Oops! Something went wrong
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          {error?.message || "Failed to load results"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="mt-6 bg-green-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state
  if (facilities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="search-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          No results found
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          {params.search
            ? `We couldn't find anything matching "${params.search}"`
            : `No ${params.facilityType} facilities available`}
        </Text>
      </View>
    );
  }

  // Render facility item
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
      onPress={() => {
        // Navigate to facility details
        console.log("Navigate to facility:", item.id);
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
            {item.address}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text className="text-sm font-semibold text-gray-700 ml-1">
              {item.rating}
            </Text>
            <Text className="text-xs text-gray-500 ml-2">{item.type}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  // Footer component for loading more
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#16a34a" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <FlashList
        data={facilities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
        ListHeaderComponent={
          <Text className="text-sm text-gray-600 mb-4">
            {totalCount} {totalCount === 1 ? "result" : "results"} found
          </Text>
        }
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#16a34a"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchResult;
