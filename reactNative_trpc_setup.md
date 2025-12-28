# 🔌 React Native tRPC Setup Guide

Complete guide to connect your React Native app to your tRPC backend with Better Auth.

---

## 📋 Prerequisites

- ✅ Existing tRPC backend (you have this)
- ✅ Better Auth setup (you have this)
- ✅ Monorepo structure (you have this)
- 📱 React Native/Expo app

---

## 📦 Step 1: Install Dependencies

### In your mobile app directory:

```bash
cd apps/mobile

# Core tRPC packages
pnpm add @trpc/client @trpc/react-query @tanstack/react-query

# Better Auth for React Native
pnpm add @better-auth/expo better-auth

# Async Storage for token persistence
pnpm add @react-native-async-storage/async-storage

# Secure Store for sensitive data (optional but recommended)
expo install expo-secure-store
```

### In your backend/api package:

```bash
cd packages/api

# Add Expo plugin for Better Auth
pnpm add @better-auth/expo
```

---

## 🔧 Step 2: Update Better Auth Config

### `packages/api/src/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { expo } from "@better-auth/expo"; // ✅ Add this

import { db } from "@4ol/db/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",        // Web
    "https://your-domain.com",      // Production Web
    "exp://",                        // Expo Go
    "myapp://",                      // Your custom scheme
    "http://localhost:8081",        // React Native Metro
  ],
  plugins: [
    nextCookies(),
    expo({
      // Optional: customize scheme
      scheme: "myapp://",
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
```

---

## 🌐 Step 3: Environment Configuration

### Create `apps/mobile/.env`

```bash
# Backend API URL
API_URL=http://localhost:3000

# For physical device testing (replace with your IP)
# API_URL=http://192.168.1.100:3000

# For production
# API_URL=https://your-api.com
```

### Create `apps/mobile/app.config.ts`

```typescript
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Your App Name',
  slug: 'your-app-slug',
  scheme: 'myapp', // For deep linking
  extra: {
    apiUrl: process.env.API_URL || 'http://localhost:3000',
  },
});
```

---

## 🔐 Step 4: Setup Authentication Client

### Create `apps/mobile/lib/auth-client.ts`

```typescript
import { createAuthClient } from '@better-auth/expo';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

/**
 * Better Auth client for React Native
 * Handles authentication with token persistence
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  
  // Use SecureStore for sensitive data (tokens)
  storage: {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        // Fallback to AsyncStorage if SecureStore fails
        return await AsyncStorage.getItem(key);
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch {
        await AsyncStorage.setItem(key, value);
      }
    },
    removeItem: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch {
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
} = authClient;
```

---

## 🚀 Step 5: Setup tRPC Client

### Create `apps/mobile/lib/trpc.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@4ol/api';

/**
 * tRPC React hooks
 * Type-safe API calls with React Query
 */
export const trpc = createTRPCReact<AppRouter>();
```

### Create `apps/mobile/lib/trpc-client.ts`

```typescript
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
        console.log('tRPC Request:', url);
        return fetch(url, options);
      },
    }),
  ],
});
```

---

## 🎨 Step 6: Create tRPC Provider

### Create `apps/mobile/providers/trpc-provider.tsx`

```typescript
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../lib/trpc';
import { trpcClient } from '../lib/trpc-client';

interface TRPCProviderProps {
  children: React.ReactNode;
}

/**
 * tRPC Provider for React Native
 * Wraps your app to enable tRPC hooks
 */
export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 2,
            // Don't retry on 401/403 (auth errors)
            retryCondition: (error: any) => {
              return ![401, 403].includes(error?.data?.code);
            },
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## 🎯 Step 7: Wrap Your App

### Update `apps/mobile/App.tsx` or `_layout.tsx` (Expo Router)

```typescript
import { TRPCProvider } from './providers/trpc-provider';

export default function App() {
  return (
    <TRPCProvider>
      {/* Your app content */}
    </TRPCProvider>
  );
}
```

---

## 📱 Step 8: Usage Examples

### Example 1: Get Image URLs

```typescript
import { trpc } from '../lib/trpc';
import { Image, View, ActivityIndicator } from 'react-native';

export function FacilityImages({ imagePaths }: { imagePaths: string[] }) {
  const { data, isLoading, error } = trpc.mediaStorage.getImageUrl.useQuery({
    paths: imagePaths,
    isFacility: true,
    width: 800,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading images: {error.message}</Text>;
  }

  return (
    <View>
      {data?.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.url }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}
```

### Example 2: Fetch Facilities

```typescript
import { trpc } from '../lib/trpc';
import { FlatList, Text } from 'react-native';

export function FacilitiesList() {
  const { data, isLoading, refetch } = trpc.facilityProfiles.getFacilities.useQuery({
    type: 'hospitals_&_clinics',
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={data?.facilities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.facilityName}</Text>
          <Text>{item.area}, {item.region}</Text>
        </View>
      )}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

### Example 3: Create Facility (Mutation)

```typescript
import { trpc } from '../lib/trpc';
import { Button, TextInput } from 'react-native';
import { useState } from 'react';

export function CreateFacilityForm() {
  const [name, setName] = useState('');
  
  const createMutation = trpc.facilityProfiles.insertFacility.useMutation({
    onSuccess: () => {
      console.log('Facility created!');
      // Navigate or show success message
    },
    onError: (error) => {
      console.error('Error:', error.message);
    },
  });

  const handleSubmit = () => {
    createMutation.mutate({
      facilityName: name,
      facilityType: 'hospitals_&_clinics',
      // ... other fields
    });
  };

  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Facility Name"
      />
      <Button
        title={createMutation.isLoading ? 'Creating...' : 'Create'}
        onPress={handleSubmit}
        disabled={createMutation.isLoading}
      />
    </View>
  );
}
```

### Example 4: Authentication Flow

```typescript
import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signIn, signUp, useSession } from '../lib/auth-client';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { data: session } = useSession();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        setError(result.error.message);
      }
      // Success - session will update automatically
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (session?.user) {
    return <Text>Welcome, {session.user.name}!</Text>;
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

### Example 5: Protected Route

```typescript
import { useSession } from '../lib/auth-client';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; // or your navigation

export function ProtectedScreen() {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!session?.user) {
    router.push('/login');
    return null;
  }

  return (
    <View>
      <Text>Protected Content</Text>
      {/* Your protected content */}
    </View>
  );
}
```

---

## 🔧 Step 9: Development Configuration

### For Testing on Physical Device

1. **Find your computer's local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Update `.env`:**
   ```bash
   API_URL=http://192.168.1.100:3000
   ```

3. **Ensure backend accepts connections:**
   ```typescript
   // In your Next.js or Express server
   const server = app.listen(3000, '0.0.0.0', () => {
     console.log('Server running on all interfaces');
   });
   ```

---

## 🐛 Troubleshooting

### Issue: "Network request failed"

**Solution 1: Check API URL**
```typescript
// Add logging in trpc-client.ts
console.log('API URL:', API_URL);
```

**Solution 2: Test endpoint**
```bash
curl http://YOUR_IP:3000/api/trpc/health
```

**Solution 3: Check CORS**
```typescript
// In your backend
app.use(cors({
  origin: '*', // Be more specific in production
  credentials: true,
}));
```

### Issue: "Unauthorized" errors

**Solution: Check token**
```typescript
// Add logging to trpc-client.ts
async headers() {
  const token = await getAuthToken();
  console.log('Auth token:', token ? 'present' : 'missing');
  return {
    authorization: token ? `Bearer ${token}` : undefined,
  };
}
```

### Issue: Images not loading

**Solution: Use React Native Image component**
```typescript
import { Image } from 'react-native';

// Don't use <img> tag - use Image component
<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
/>
```

---

## 🚀 Performance Optimizations

### 1. Enable Query Persistence

```typescript
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </PersistQueryClientProvider>
  );
}
```

### 2. Optimize Image Loading

```typescript
// Use smaller images for list views
trpc.mediaStorage.getImageUrl.useQuery({
  paths: imagePaths,
  isFacility: false,
  width: 400, // Smaller for thumbnails
});

// Use React Native Fast Image for better performance
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl, priority: FastImage.priority.normal }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 3. Implement Pagination

```typescript
const { data, fetchNextPage, hasNextPage } = 
  trpc.facilityProfiles.getFacilities.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
```

---

## ✅ Testing Checklist

- [ ] Can authenticate (sign in/sign up)
- [ ] Session persists on app restart
- [ ] Can call protected procedures
- [ ] Can fetch data (queries)
- [ ] Can mutate data (mutations)
- [ ] Images load correctly
- [ ] Error handling works
- [ ] Works on physical device
- [ ] Works in production build

---

## 📚 Best Practices

1. **Always handle errors:**
   ```typescript
   const { data, error } = trpc.someQuery.useQuery();
   if (error) {
     // Show user-friendly error
   }
   ```

2. **Use optimistic updates:**
   ```typescript
   const utils = trpc.useContext();
   
   mutation.mutate(newData, {
     onMutate: async (newData) => {
       await utils.facilities.list.cancel();
       utils.facilities.list.setData(undefined, (old) => [...old, newData]);
     },
   });
   ```

3. **Implement offline support:**
   - Use React Query's retry and caching
   - Add offline detection
   - Show offline indicator

4. **Secure token storage:**
   - Always use SecureStore for tokens
   - Clear tokens on logout
   - Handle token expiration

---

## 🎉 You're Done!

Your React Native app is now connected to your tRPC backend with full type safety and authentication!

**Next Steps:**
- Build your mobile screens
- Implement offline support
- Add push notifications
- Set up CI/CD for mobile builds
