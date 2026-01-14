import { ScrollView, Text } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Terms of Service</Text>
      <Text className="text-gray-600 leading-6">
        [Your long legal text here...]
      </Text>
    </ScrollView>
  );
}
