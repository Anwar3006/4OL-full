import React, { useState, useEffect } from "react";
import { View, Text, Alert, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBiometricAuth } from "@/hooks/use-biometric-auth";
import * as Haptics from "expo-haptics";

export function BiometricSettings() {
  const {
    isAvailable,
    isEnrolled,
    isBiometricEnabled,
    biometricType,
    disableBiometric,
    refreshBiometricStatus,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);

  // Refresh status when component mounts or when isBiometricEnabled changes
  useEffect(() => {
    refreshBiometricStatus();
  }, []);

  // Don't show if biometric is not available
  if (!isAvailable || !isEnrolled) {
    return null;
  }

  const handleToggleBiometric = async (value: boolean) => {
    if (isToggling) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (!value) {
        // Disabling biometric
        Alert.alert(
          "Disable Biometric Login?",
          "You will need to sign in with your password next time.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Disable",
              style: "destructive",
              onPress: async () => {
                setIsToggling(true);
                try {
                  await disableBiometric();
                  
                  // Wait a moment for SecureStore to complete
                  await new Promise(resolve => setTimeout(resolve, 100));
                  
                  // Refresh the status to ensure UI is in sync
                  await refreshBiometricStatus();
                  
                  await Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                  );
                  
                  Alert.alert(
                    "Disabled",
                    "Biometric login has been disabled."
                  );
                } catch (error) {
                  console.error("Error disabling biometric:", error);
                  Alert.alert(
                    "Error",
                    "Failed to disable biometric login. Please try again."
                  );
                } finally {
                  setIsToggling(false);
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error toggling biometric:", error);
      Alert.alert("Error", "Unable to update biometric settings.");
      setIsToggling(false);
    }
  };

  const getBiometricName = () => {
    switch (biometricType) {
      case "facial":
        return "Face ID";
      case "fingerprint":
        return "Touch ID";
      case "iris":
        return "Iris Recognition";
      default:
        return "Biometric Login";
    }
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case "facial":
        return "scan";
      case "fingerprint":
        return "finger-print";
      case "iris":
        return "eye";
      default:
        return "shield-checkmark";
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
            <Ionicons name={getBiometricIcon()} size={20} color="#16a34a" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900">
              {getBiometricName()}
            </Text>
            <Text className="text-sm text-gray-500">
              {isBiometricEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
        </View>
        <Switch
          value={isBiometricEnabled}
          onValueChange={handleToggleBiometric}
          disabled={isToggling}
          trackColor={{ false: "#d1d5db", true: "#86efac" }}
          thumbColor={isBiometricEnabled ? "#16a34a" : "#f3f4f6"}
        />
      </View>

      {isBiometricEnabled && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            Your credentials are stored securely on this device and are never
            sent to our servers.
          </Text>
        </View>
      )}
    </View>
  );
}
