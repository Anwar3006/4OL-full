import { createAuthClient } from '@better-auth/expo';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

/**
 * Better Auth client for React Native
 * Handles authentication with token persistence using SecureStore
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  
  // Use SecureStore for sensitive data (tokens)
  storage: {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.warn('SecureStore get failed, falling back to AsyncStorage:', error);
        return await AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.warn('SecureStore set failed, falling back to AsyncStorage:', error);
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.warn('SecureStore delete failed, falling back to AsyncStorage:', error);
        await AsyncStorage.removeItem(key);
      }
    },
  },
});

// Export useful helpers
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  changePassword,
} = authClient;

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!session?.user;
  } catch {
    return false;
  }
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.user?.id || null;
  } catch {
    return null;
  }
}
