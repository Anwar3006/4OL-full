import { View, Text } from "react-native";
import React from "react";
import GoogleMapContainer from "@/components/map/GoogleMapContainer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MapScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <GoogleMapContainer />
      </View>
    </View>
  );
};

export default MapScreen;
