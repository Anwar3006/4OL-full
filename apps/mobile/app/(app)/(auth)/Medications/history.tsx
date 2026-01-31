import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MedicationHistoryScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-slate-900">Medication History</Text>
        <Text className="text-slate-500">A record of your past medications</Text>
      </View>

      <View className="mt-8 items-center justify-center py-20">
        <View className="bg-slate-50 p-6 rounded-full">
          <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
        </View>
        <Text className="text-slate-400 font-bold mt-4">No history available</Text>
      </View>
    </ScrollView>
  );
}
