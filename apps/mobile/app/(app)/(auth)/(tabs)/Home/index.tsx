import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Search from "@/components/Search";

import CategoryList from "@/components/home/CategoryList";
import CampaignBox from "@/components/CampaignBox";
import TopRated from "@/components/home/TopRated";
import { useNotification } from "@/context/NotificationContext";
import { MedicationFAB } from "@/components/MedicationFAB";

const Home = () => {
  const { error, expoPushToken, notification } = useNotification();

  console.log("Stuff - Notification: ", expoPushToken, error, notification);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600;

  return (
    <>
      <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 10,
        paddingHorizontal: isLargeScreen ? width * 0.1 : 20, // Slightly tighter on foldables
      }}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-8 bg-[#]">
        <View className="flex-row items-center">
          <View className="bg-white size-20 rounded-full items-center justify-center mr-4 shadow-sm border border-gray-100">
            <Ionicons name="person" size={24} color="#10b981" />
          </View>
          <View>
            <Text className="text-3xl font-black text-slate-900">John Doe</Text>
            <Text className="text-gray-500 text-xs font-bold tracking-tight">
              How are you feeling today {expoPushToken} ----
            </Text>
          </View>
        </View>

        <TouchableOpacity className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <Ionicons name="notifications-outline" size={24} color="black" />
          <View className="size-2.5 bg-red-500 absolute top-3 right-3 rounded-full border-2 border-white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar Container */}
      <View className="mb-2">
        <Search />
      </View>

      {/* Categories Section */}
      <CategoryList />

      {/* Campaign Box */}
      <View className="my-4">
        <CampaignBox />
      </View>

      {/* Top Rated Facilities */}
      <TopRated />
    </ScrollView>
    <MedicationFAB />
    </>
  );
};

export default Home;
