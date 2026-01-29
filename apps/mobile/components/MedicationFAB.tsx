import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const MedicationFAB = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [medication, setMedication] = useState("");
  const insets = useSafeAreaInsets();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: insets.bottom + 80, right: 20 },
        ]}
        className="bg-green-600 shadow-xl items-center justify-center"
        onPress={() => setModalVisible(true)}
      >
        <View className="relative">
          <MaterialCommunityIcons name="pill" size={30} color="white" />
          <View className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
            <Ionicons name="add" size={14} color="#16a34a" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-black/50">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="w-full"
            >
              <View className="bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl">
                <View className="items-center mb-6">
                  <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-8" />
                  <View className="bg-green-100 p-4 rounded-full mb-4">
                    <MaterialCommunityIcons name="pill" size={40} color="#10b981" />
                  </View>
                  <Text className="text-2xl font-black text-center text-slate-900 px-4">
                    Welcome to your Medication Reminder.
                  </Text>
                  <Text className="text-slate-500 text-center mt-2 font-medium">
                    Type the name of your medication to begin
                  </Text>
                </View>

                <View className="bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-6">
                  <TextInput
                    className="text-lg font-bold text-slate-900"
                    placeholder="e.g. Paracetamol"
                    placeholderTextColor="#94a3b8"
                    value={medication}
                    onChangeText={setMedication}
                    autoFocus
                  />
                </View>

                <View className="flex-row gap-4">
                  <TouchableOpacity
                    className="flex-1 bg-slate-100 p-4 rounded-2xl items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-slate-600 font-bold text-lg">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-2 bg-green-600 p-4 rounded-2xl items-center shadow-lg shadow-green-200"
                    onPress={() => {
                      // Handle medication save logic here
                      console.log("Saving medication:", medication);
                      setModalVisible(false);
                      setMedication("");
                    }}
                  >
                    <Text className="text-white font-bold text-lg">Add Medication</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    zIndex: 1000,
  },
});
