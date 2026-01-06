import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold text-blue-600">
        🎉 NativeWind is working!
      </Text>
      <Text className="text-gray-600 mt-4">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
