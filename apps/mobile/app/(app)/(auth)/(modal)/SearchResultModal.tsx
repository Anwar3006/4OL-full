import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useFacilityProfiles } from "@/hooks/use-facilities";
import { formatTextToTitleCase } from "@/lib/utils";
import { useGetMediaPublicUrl } from "@/hooks/use-media";
import * as Constants from "expo-constants";

// Utility to check if facility is currently open based on your business_hours JSON
const getStatus = (hours: any[]) => {
  if (!hours || hours.length === 0)
    return { label: "Hours N/A", color: "text-gray-400" };
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[now.getDay()];
  const schedule = hours.find((h) => h.day === currentDay);

  if (!schedule || schedule.isClosed)
    return { label: "Closed", color: "text-red-500" };

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = schedule.open.split(":").map(Number);
  const [closeH, closeM] = schedule.close.split(":").map(Number);

  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;

  if (currentTime >= openTime && currentTime <= closeTime) {
    return { label: "Open Now", color: "text-emerald-500" };
  }
  return { label: "Closed", color: "text-red-500" };
};

const SUPABASE_URL = Constants.default?.expoConfig?.extra?.SUPABASE_URL || "";
const SUPABASE_BUCKET_NAME =
  Constants.default?.expoConfig?.extra?.SUPABASE_BUCKET_NAME || "";

const SearchResult = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    facilityType?: string;
    search?: string;
  }>();

  // Mock state for favorites (Ideally, this would be a separate Supabase mutation)
  //TODO: create favorites table, use facilityId and userId as composite key
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

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
  } = useFacilityProfiles({
    type: params.facilityType,
    search: params.search,
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.facilityType
        ? formatTextToTitleCase(params.facilityType, "_")
        : `Results for "${params.search}"`,
    });
  }, [params.facilityType, params.search]);

  const facilities = data?.pages.flatMap((page) => page.facilities) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-xs">
          Finding Facilities...
        </Text>
      </View>
    );
  }

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

  const openDirections = (lat: number, lng: number, label: string) => {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to browser if app isn't installed
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
          Linking.openURL(browserUrl);
        }
      });
    }
  };

  const goToFacilityProfile = (id: string) => {
    router.back();

    // Using a small timeout (0ms or 50ms) ensures the navigation occurs
    // after the modal has started its closing animation
    setTimeout(() => {
      router.push({
        pathname: "/(app)/(auth)/Facility/[id]",
        params: { id },
      });
    }, 0);
  };

  const renderItem = ({ item }: { item: any }) => {
    const status = getStatus(item.business_hours);
    const isFavorited = favorites.includes(item.id);

    const imageUri =
      item.media_urls?.length > 0
        ? `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${item.media_urls[0]}?width=300&height=250&resize=cover&quality=70`
        : null;

    return (
      <View className="bg-white rounded-3xl mb-5 border border-slate-100 shadow-sm overflow-hidden">
        <View className="p-5 flex-row">
          {/* Thumbnail */}
          <View className="w-28 h-24 bg-slate-100 rounded-2xl overflow-hidden items-center justify-center">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" />
            ) : (
              <Ionicons name="medical" size={30} color="#10b981" />
            )}
          </View>

          <View className="flex-1 ml-4 justify-between">
            <View>
              <View className="flex-row justify-between items-start">
                <Text
                  className="text-base font-black text-slate-900 flex-1 mr-2"
                  numberOfLines={1}
                >
                  {item.facility_name}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Ionicons
                    name={isFavorited ? "heart" : "heart-outline"}
                    size={30}
                    color={isFavorited ? "#ef4444" : "#cbd5e1"}
                  />
                </TouchableOpacity>
              </View>

              <Text className="text-xs text-slate-500 font-medium">
                {item.area}, {item.district}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-lg">
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text className="text-[12px] font-black text-amber-700 ml-1">
                  {item.avg_rating > 0 ? item.avg_rating.toFixed(1) : "N/A"}
                </Text>
              </View>
              <Text
                className={`text-[10px] font-black uppercase ${status.color}`}
              >
                {status.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Bar */}
        <View className="flex-row border-t border-slate-50 p-2">
          <TouchableOpacity
            onPress={() =>
              openDirections(item.latitude, item.longitude, item.facility_name)
            }
            className="flex-1 flex-row items-center justify-center bg-emerald-500 py-3 rounded-2xl mr-1"
          >
            <Ionicons name="location" size={18} color="white" />
            <Text className="text-white font-bold ml-2">Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center bg-slate-100 py-3 rounded-2xl ml-1"
            onPress={() => goToFacilityProfile(item.id)}
          >
            <Text className="text-slate-700 font-bold">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50/50">
      <FlashList
        data={facilities}
        // estimatedItemSize={110}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
              Showing {totalCount} Locations
            </Text>
          </View>
        }
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
            tintColor="#10b981"
          />
        }
      />
    </View>
  );
};

export default SearchResult;
