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
import ProfileAvatar from "@/components/myaccount/ProfileAvatar";
import ProfileMenuItem from "@/components/myaccount/ProfileMenuItem";
import useUserStore from "@/store/use-userstore";

const MyAccount = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user } = useUserStore();
  const isLargeScreen = width > 600;

  return (
    <View className="flex-1 bg-white">
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="flex-row items-center justify-between px-6 pb-4 bg-white"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#334155" />
        </TouchableOpacity>

        <Text className="text-xl font-black text-slate-800">My Account</Text>

        <View className="w-6" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: isLargeScreen ? width * 0.2 : 24,
        }}
      >
        {/* Avatar Section */}
        <ProfileAvatar
          uri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
          name={`${user?.first_name} ${user?.last_name}`}
        />

        {/* Menu List */}
        <View className="mt-4">
          <ProfileMenuItem
            label="Profile"
            icon="person-outline"
            href="/My Account/UserProfile"
          />
          <ProfileMenuItem
            label="Favourite"
            icon="heart-outline"
            href="/My Account/Favorites"
          />
          <ProfileMenuItem
            label="Help Center"
            icon="information-circle-outline"
            href="/My Account/HelpCenter"
          />
          <ProfileMenuItem
            label="Privacy Policy"
            icon="shield-checkmark-outline"
            href="/(app)/(public)/(legal)/Privacy"
          />
          <ProfileMenuItem
            label="Settings"
            icon="settings-outline"
            href="/My Account/Settings"
          />
          <ProfileMenuItem
            label="Payment Options"
            icon="card-outline"
            href="/My Account/PaymentOptions"
          />
          <ProfileMenuItem
            label="Password Manager"
            icon="lock-closed-outline"
            href="/My Account/PasswordManager"
          />

          <View className="mt-4">
            <ProfileMenuItem
              label="Log out"
              icon="log-out-outline"
              href="/My Account/Logout"
              isLogout
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyAccount;
