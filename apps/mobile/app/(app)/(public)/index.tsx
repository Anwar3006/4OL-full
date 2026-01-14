import { useAssets } from "expo-asset";
import { Link } from "expo-router";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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
        <Text className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          4 Our Life
        </Text>
        <Text className="text-lg md:text-xl text-gray-200 mt-2 max-w-[80%]">
          Welcome back to the future of 4ol.
        </Text>
      </View>

      {/* Bottom Content: Buttons */}
      <View
        style={{ paddingBottom: insets.bottom + 10 }}
        className="flex-1 justify-end px-6 absolute bottom-0 left-0 w-full"
      >
        <View className={`gap-4 ${isLargeScreen ? "flex-row" : "flex-col"}`}>
          <Link href="/Login" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 bg-white/10 border border-white/20 h-16 rounded-2xl items-center justify-center backdrop-blur-md"
            >
              <Text className="text-white text-lg font-semibold">Login</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/SignUp" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-1 bg-green-600 h-16 rounded-2xl items-center justify-center shadow-xl shadow-green-900"
            >
              <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
