import {
  ScrollView,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProfileMenuItem from "@/components/myaccount/ProfileMenuItem";

const Settings = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isLargeScreen = width > 600;

  return (
    <View className="flex-1 bg-white">
      {/* Header Bar */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center justify-between px-6 pb-4 bg-white"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-slate-800">Settings</Text>
        <View className="w-6" /> {/* Spacer for centering */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: isLargeScreen ? width * 0.2 : 24,
        }}
      >
        {/* Menu List */}
        <View className="mt-4 pe-4">
          <ProfileMenuItem
            label="Delete Account"
            subText="Delete your account and corresponding data"
            icon="trash-bin"
            href="/My Account/UserProfile"
          />
          <ProfileMenuItem
            label="Share App"
            subText="Share the app with your friends and family"
            icon="share"
            href="/My Account/Settings"
          />
          <ProfileMenuItem
            label="Rate App"
            subText="Rate the app on PlayStore/App Store"
            icon="card-outline"
            href="/My Account/PaymentOptions"
          />
          <ProfileMenuItem
            label="Get in Touch"
            subText="Contact us via email"
            icon="mail-outline"
            href="/My Account/PasswordManager"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
