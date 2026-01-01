// This is the other options component for mobile app.
// When user taps on it, it appears like a shadcn sheet from the bottom.
// Location: apps/mobile/app/(app)/(public)/other-options.tsx

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

const OtherOptionsScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closBtn} onPress={() => router.dismiss()}>
        <Ionicons name="close" size={24} />
      </TouchableOpacity>
      <Text style={styles.title}>Log in or Create an Account</Text>

      <View style={styles.buttonContainer}>
        <Animated.View entering={FadeInDown.delay(100)}>
          {/* <AppleAuthButton /> */}
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200)}>
          {/* <GoogleAuthButton /> */}
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(300)}>
          <Link href={"/(app)/(public)/other-options"} asChild>
            <TouchableOpacity style={styles.otherButton}>
              <Text style={styles.otherButtonText}>Other Options</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  closBtn: {
    backgroundColor: Colors.light,
    borderRadius: 40,
    padding: 8,
    alignSelf: "flex-end",
  },
  title: { fontSize: 30, fontFamily: Fonts.brandBlack, marginVertical: 22 },
  buttonContainer: {
    gap: 12,
    width: "100%",
  },
  otherButton: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 12,
    gap: 4,
  },
  otherButtonText: {
    fontSize: 16,
  },
});

export default OtherOptionsScreen;
