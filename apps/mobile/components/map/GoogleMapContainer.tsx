import React, { useState, useRef, useMemo, useCallback } from "react";
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
import Animated, { FadeIn } from "react-native-reanimated";
import { CustomInput } from "../CustomInput";
import { SearchFormValues } from "../Search";

const MapContainer = () => {
  const { width, height } = useWindowDimensions();
  const mapRef = useRef<MapView>(null);

  // Use a wider initial delta to fetch more markers at once (reducing subsequent network calls)
  const [region, setRegion] = useState({
    latitude: 5.6037,
    longitude: -0.187,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  });

  const bounds = useMemo(
    () => ({
      minLng: region.longitude - region.longitudeDelta, // Fetch 2x the view area
      minLat: region.latitude - region.latitudeDelta,
      maxLng: region.longitude + region.longitudeDelta,
      maxLat: region.latitude + region.latitudeDelta,
      zoom: Math.round(Math.log2(360 / region.longitudeDelta)),
    }),
    [region.latitude, region.longitude],
  ); // Only recalculate on significant moves

  // keepPreviousData: true is crucial for smoothness in TanStack Query
  const { data: geojson, isFetching } = useGetFacilitiesMapData({
    ...bounds,
    enabled: true,
  });

  // Memoize markers so they don't re-render unless data actually changes
  const renderedMarkers = useMemo(() => {
    return geojson?.features?.map((feature: any) => (
      <Marker
        key={feature.properties?.id}
        coordinate={{
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        }}
        tracksViewChanges={false} // Huge performance win
        icon={undefined} // Use custom view below
        title={feature.properties?.name}
        flat={true} // Better for performance on rotate/tilt
      >
        <View
          className="items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          <View className="bg-emerald-500 p-2 rounded-full border-2 border-white shadow-sm">
            <Ionicons name="medical" size={16} color="white" />
          </View>
          <View className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-emerald-500 -mt-0.5" />
        </View>
      </Marker>
    ));
  }, [geojson?.features]);

  //   const onSubmit = (data: SearchFormValues) => {
  //   // This is called by handleSubmit
  //   router.push({
  //     pathname: "/(app)/(auth)/(modal)/SearchResult",
  //     params: { search: data.search.trim() },
  //   });
  //   reset();
  // };

  return (
    <View style={{ width, height }} className="bg-slate-100">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        rotateEnabled={false}
        pitchEnabled={false}
        customMapStyle={mapOptions.styles}
      >
        {renderedMarkers}
      </MapView>

      {/* 1% UX Tip: Use an Overlay Loader instead of a Full Screen one */}
      {isFetching && (
        <Animated.View
          entering={FadeIn.duration(300)}
          className="absolute bottom-10 self-center bg-white/90 px-4 py-2 rounded-full shadow-lg border border-emerald-100 flex-row items-center"
        >
          <View className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
          <Text className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">
            Updating Map...
          </Text>
        </Animated.View>
      )}

      {/* Header UI */}
      <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
        {/* <Controller
        control={control}
        name="search"
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            placeholder="Find pharmacies, hospitals..."
            icon="search"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={errors.search?.message}
            // Professional Search Settings
            returnKeyType="search" // Changes "Done" to "Search" on keyboard
            onSubmitEditing={handleSubmit(onSubmit)} // Triggers on Enter/Return
            submitBehavior="blurAndSubmit" // Hides keyboard after search
            // UI Tweaks for search bar feel
            containerClassName="shadow-none"
            className="bg-white border-gray-300 h-14 rounded-2xl"
          />
        )}
      /> */}
      </View>
    </View>
  );
};

export default React.memo(MapContainer);
