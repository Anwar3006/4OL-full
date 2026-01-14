import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import Constants from "expo-constants";
import zustandMMKVStorage from "./zustand-mmkv";
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig?.extra?.API_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: API_URL,

  // Use SecureStore for sensitive data (tokens)
  storage: {
    getItem: async (key: string) => {
      const secureItem = await SecureStore.getItemAsync(key);
      if (secureItem) return secureItem;

      return (await zustandMMKVStorage.getItem(key)) ?? null;
    },
    setItem: async (key: string, value: string) => {
      // Logic: If it looks like a token or sensitive ID, go to hardware storage
      if (key.includes("token") || key.includes("session")) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await zustandMMKVStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      await SecureStore.deleteItemAsync(key);
      await zustandMMKVStorage.removeItem(key);
    },
  },

  plugins: [
    expoClient({
      scheme: "4ol",
      storage: SecureStore,
    }),
  ],
});

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await authClient.getSession();
    return !!session?.data?.user;
  } catch {
    return false;
  }
}
