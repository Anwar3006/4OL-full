import CustomButton from "@/components/CustomButton";

import { useAssets } from "expo-asset";

import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [assets] = useAssets([require("@/assets/videos/auth-video.mp4")]);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  // Video
  const videoSource = useMemo(() => {
    if (!assets?.[0]) return null;
    return assets[0].localUri || assets[0].uri;
  }, [assets]);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  //Breakpoint detection for larger mobile screens and tablets
  const isLargeScreen = width > 600;

  return (
    <View className="flex-1 bg-black">
      {/* 1. Background Video */}
      {videoSource && (
        <VideoView
          style={{ width, height, position: "absolute" }}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {/* 2. Dark Overlay - Fixed styling */}
      <View className="absolute inset-0 bg-black/40" pointerEvents="none" />

      {/* Top Content: Title & Subtitle (Beneath Header Panel) */}
      <View
        style={{ paddingTop: insets.top + 20 }}
        className="absolute top-0 left-0 right-0 px-6"
      >
        <Text className="text-5xl md:text-6xl font-bold text-white tracking-tight pt-4">
          4 Our Life
        </Text>
        <Text className="text-base md:text-xl text-gray-200 max-w-[80%]">
          Your Nearest Health Facility – Just a Tap Away!
        </Text>
      </View>

      {/* Bottom Content: Buttons */}
      <View
        style={{ paddingBottom: insets.bottom + 10 }}
        className="flex-1 justify-end px-6 absolute bottom-0 left-0 w-full"
      >
        <View className={`gap-4 ${isLargeScreen ? "flex-row" : "flex-col"}`}>
          <CustomButton
            title="Login"
            href="/Login"
            containerClassName="bg-white/10 border border-white/20 backdrop-blur-lg"
            textClassName="text-white font-semibold"
            icon={"log-in-outline"}
          />

          <CustomButton
            title="Sign Up"
            href="/SignUp"
            containerClassName="bg-green-600 backdrop-blur-lg shadow-xl shadow-green-900"
            textClassName="text-white font-semibold"
            icon="log-in"
          />
        </View>
      </View>
    </View>
  );
}
