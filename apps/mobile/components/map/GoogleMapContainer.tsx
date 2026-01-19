import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useGetFacilitiesMapData } from "@/hooks/use-facilities";
import { Ionicons } from "@expo/vector-icons";
import { mapOptions } from "@/constants/mapOptions";
import LoadingScreen from "../LoadingScreen";

const MapContainer = () => {
  const { width, height } = useWindowDimensions();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 5.6037,
    longitude: -0.187,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Calculate bounding box for Supabase
  const bounds = useMemo(
    () => ({
      minLng: region.longitude - region.longitudeDelta / 2,
      minLat: region.latitude - region.latitudeDelta / 2,
      maxLng: region.longitude + region.longitudeDelta / 2,
      maxLat: region.latitude + region.latitudeDelta / 2,
      zoom: Math.round(Math.log2(360 / region.longitudeDelta)),
    }),
    [region],
  );

  const { data: geojson, isLoading } = useGetFacilitiesMapData({
    ...bounds,
    enabled: true,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ width, height }} className="bg-slate-50">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
        // Custom map styling for high-end look
        customMapStyle={mapOptions.styles}
      >
        {geojson?.features?.map((feature: any) => (
          <Marker
            key={feature.id}
            coordinate={{
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
            }}
            // PERFORMANCE: Setting tracksViewChanges to false prevents
            // constant re-renders of the marker icons.
            tracksViewChanges={false}
            title={feature.properties?.name}
            description={feature.properties?.address}
          >
            {/* High-end Custom Marker */}
            <View className="items-center shadow-lg">
              <View className="bg-emerald-500 p-2 rounded-full border-2 border-white">
                <Ionicons name="medical" size={16} color="white" />
              </View>
              {/* Pointer Triangle */}
              <View className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-500 -mt-0.5" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Dynamic Header Overlay */}
      <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
        <View className="bg-white/95 px-4 py-3 rounded-3xl shadow-xl border border-slate-100 flex-row items-center flex-1 mr-4">
          <Ionicons name="search" size={20} color="#64748b" />
          <Text className="ml-2 text-slate-400 font-medium">
            Search for facilities...
          </Text>
        </View>
        <TouchableOpacity className="bg-white size-12 rounded-2xl shadow-xl items-center justify-center">
          <Ionicons name="options-outline" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(MapContainer);
