import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MedicationsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-slate-900">My Medications</Text>
        <Text className="text-slate-500">Manage your daily medication reminders</Text>
      </View>

      <TouchableOpacity
        className="flex-row items-center p-4 bg-emerald-50 rounded-2xl mb-4"
        onPress={() => router.push("/Medications/history")}
      >
        <View className="bg-emerald-100 p-3 rounded-full mr-4">
          <Ionicons name="time-outline" size={24} color="#10b981" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-slate-800">View History</Text>
          <Text className="text-slate-500 text-sm">Check your past medication logs</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#10b981" />
      </TouchableOpacity>

      <View className="mt-8 items-center justify-center py-20">
        <Ionicons name="medical-outline" size={64} color="#cbd5e1" />
        <Text className="text-slate-400 font-bold mt-4">No medications added yet</Text>
      </View>
    </ScrollView>
  );
}
