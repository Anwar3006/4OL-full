import CustomButton from "@/components/CustomButton";
import { useAssets } from "expo-asset";
import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo, useEffect } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"; // Install: npx expo install expo-linear-gradient
import * as TrackingTransparency from "expo-tracking-transparency";

export default function Index() {
  useEffect(() => {
    (async () => {
      const { status } =
        await TrackingTransparency.requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Tracking permission granted");
      }
    })();
  }, []);

  const [assets] = useAssets([require("@/assets/videos/auth-video.mp4")]);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const videoSource = useMemo(() => {
    if (!assets?.[0]) return null;
    return assets[0].localUri || assets[0].uri;
  }, [assets]);

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.play();
    p.muted = true;
  });

  const isLargeScreen = width > 600;

  return (
    <View className="flex-1 bg-black">
      {/* 1. Cinematic Background */}
      {videoSource && (
        <VideoView
          style={{ width, height, position: "absolute" }}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      )}

      {/* 2. Layered Depth: Gradient Vignette */}
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.95)"]}
        // Ensure the gradient stretches correctly
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: height,
        }}
        // Adjust locations to keep the center clear for the video
        locations={[0, 0.5, 1]}
      />

      {/* 3. Top Branding Section */}
      <View
        style={{ paddingTop: insets.top + 40 }}
        className="absolute top-0 left-0 right-0 px-8 items-center md:items-start"
      >
        <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 mb-4">
          <Text className="text-green-400 text-xs font-bold uppercase tracking-widest">
            Healthcare Simplified
          </Text>
        </View>

        <Text className="text-6xl pt-2 font-black text-white text-center md:text-left tracking-tighter">
          4OL<Text className="text-green-500">.</Text>
        </Text>

        <View className="h-1 w-12 bg-green-500 my-4 rounded-full" />

        <Text className="text-xl text-gray-200 text-center md:text-left font-light leading-7">
          Your nearest health facility{"\n"}
          <Text className="font-bold text-white">Just a tap away.</Text>
        </Text>
      </View>

      {/* 4. Bottom Action Section */}
      <View
        style={{ paddingBottom: insets.bottom + 40 }}
        className="flex-1 justify-end px-8 absolute bottom-0 left-0 w-full"
      >
        <View
          className="bg-white/15 border border-white/30 p-6 rounded-[40px] backdrop-blur-3xl"
          style={{ width: isLargeScreen ? 500 : "100%", alignSelf: "center" }}
        >
          <Text className="text-white text-center text-sm mb-6 font-medium">
            Ready to find care?
          </Text>

          <View className={`gap-4 ${isLargeScreen ? "flex-row" : "flex-col"}`}>
            <CustomButton
              title="Login"
              href="/Login"
              containerClassName="bg-white h-16 rounded-2xl"
              textClassName="text-black font-bold text-lg"
              icon="log-in-outline"
            />

            <CustomButton
              title="Join 4OL"
              href="/VerifyPhoneNumber"
              containerClassName="bg-green-600 h-16 rounded-2xl shadow-2xl shadow-green-900"
              textClassName="text-white font-bold text-lg"
              icon="person-add-outline"
            />
          </View>

          <Text className="text-white/40 text-center text-[10px] mt-6 leading-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    </View>
  );
}
