import { httpBatchLink } from '@trpc/client';
import Constants from 'expo-constants';
import { getSession } from './auth-client';
import { trpc } from './trpc';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

/**
 * Get the authentication token for API requests
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.session?.token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * tRPC client configured for React Native
 * Handles authentication headers automatically
 * Includes request/response logging in development
 */
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${API_URL}/api/trpc`,
      
      // Add authentication headers
      async headers() {
        const token = await getAuthToken();
        
        return {
          authorization: token ? `Bearer ${token}` : undefined,
          'content-type': 'application/json',
        };
      },
      
      // Optional: Add request interceptor for debugging
      fetch(url, options) {
        if (__DEV__) {
          console.log('tRPC Request:', url);
        }
        
        return fetch(url, options).then(async (response) => {
          if (__DEV__) {
            console.log('tRPC Response:', response.status, url);
          }
          
          // Log errors in development
          if (!response.ok && __DEV__) {
            const text = await response.clone().text();
            console.error('tRPC Error Response:', text);
          }
          
          return response;
        });
      },
    }),
  ],
});

/**
 * Get the base API URL (useful for other API calls outside tRPC)
 */
export function getApiUrl(): string {
  return API_URL;
}
