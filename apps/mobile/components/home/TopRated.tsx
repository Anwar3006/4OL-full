import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import FacilityCard from "./FacilityCard";
import useFacilityStore from "@/store/use-facilityStore";
import { useRouter } from "expo-router";

const dummyFacilities = [
  {
    id: "1",
    type: "Hospital",
    name: "St. Patrick's Medical Center",
    image:
      "https://images.unsplash.com/photo-1587350859728-117622bc75fb?q=80&w=800&auto=format&fit=crop",
    address: "12 Independence Ave, Accra, Ghana",
    rating: 4.9,
  },
  {
    id: "2",
    type: "Diagnostic Lab",
    name: "Advanced Imaging & Labs",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    address: "7th North Ring Rd, Greater Accra",
    rating: 4.7,
  },
];

//TODO: Switch out with real data

const TopRated = () => {
  const router = useRouter();
  const { topFacilities } = useFacilityStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // Rotation Logic
  useEffect(() => {
    if (dummyFacilities.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dummyFacilities.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [dummyFacilities]);

  //   if (topFacilities.length === 0) return null;

  const activeFacility = dummyFacilities[activeIndex];

  return (
    <View className="mb-6 px-4">
      {/* Header Row */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-black text-slate-900">Top Rated</Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-green-600 font-bold">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Reanimated Container */}
      <View className="h-[320px]">
        <Animated.View
          key={`facility-${activeFacility.id}`} // Key forces re-animation on change
          entering={FadeInRight.duration(800).springify().damping(75)}
          exiting={FadeOutLeft.duration(400)}
          layout={LinearTransition.springify()}
        >
          <FacilityCard {...activeFacility} />
        </Animated.View>
      </View>

      {/* Premium Progress Indicators */}
      <View className="flex-row justify-center gap-x-2 mt-2">
        {dummyFacilities.map((_: any, i: any) => (
          <View
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex ? "w-6 bg-green-500" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default TopRated;
