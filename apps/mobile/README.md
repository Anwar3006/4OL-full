# 📱 React Native Mobile App

React Native mobile app with tRPC integration and Better Auth authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL
# For local development: API_URL=http://localhost:3000
# For device testing: API_URL=http://YOUR_LOCAL_IP:3000
```

### Run the App

```bash
# Start Expo
pnpm start

# Or run specific platform
pnpm ios      # iOS Simulator
pnpm android  # Android Emulator
pnpm web      # Web browser
```

## 📦 What's Included

### Core Setup
- ✅ tRPC client with React Query
- ✅ Better Auth integration
- ✅ TypeScript configuration
- ✅ Environment configuration

### Features
- 🔐 Authentication (login/signup/logout)
- 🖼️ Image loading with signed URLs
- 📋 Data fetching with caching
- 🔄 Optimistic updates
- 🔌 Offline support (via React Query)

### Directory Structure
```
apps/mobile/
├── lib/
│   ├── auth-client.ts       # Better Auth client
│   ├── trpc.ts              # tRPC React hooks
│   └── trpc-client.ts       # tRPC client config
├── providers/
│   └── trpc-provider.tsx    # tRPC provider wrapper
├── examples/
│   ├── auth-examples.tsx    # Auth usage examples
│   └── trpc-usage-examples.tsx  # API usage examples
├── .env.example             # Environment template
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
API_URL=http://localhost:3000
```

**For testing on physical device:**
1. Find your computer's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Update `.env`:
   ```bash
   API_URL=http://192.168.1.100:3000
   ```

3. Ensure backend allows connections:
   ```typescript
   // In your Next.js server
   app.listen(3000, '0.0.0.0', () => {
     console.log('Server running on all interfaces');
   });
   ```

### Backend Configuration

Update `packages/api/src/auth.ts`:
```typescript
trustedOrigins: [
  "http://localhost:3000",
  "exp://",                    // Expo Go
  "myapp://",                  // Your custom scheme
  "http://192.168.1.100:3000", // Your local IP
],
```

## 📖 Usage Examples

### Authentication

```typescript
import { signIn, useSession } from './lib/auth-client';

function LoginScreen() {
  const handleLogin = async () => {
    const result = await signIn.email({
      email: 'user@example.com',
      password: 'password123',
    });
    
    if (result.error) {
      console.error(result.error.message);
    }
  };
}

function ProfileScreen() {
  const { data: session } = useSession();
  
  if (session?.user) {
    return <Text>Welcome, {session.user.name}!</Text>;
  }
}
```

### API Calls

```typescript
import { trpc } from './lib/trpc';

function FacilitiesList() {
  const { data, isLoading } = trpc.facilityProfiles.getFacilities.useQuery({
    type: 'hospitals_&_clinics',
  });
  
  return (
    <FlatList
      data={data?.facilities}
      renderItem={({ item }) => <Text>{item.facilityName}</Text>}
    />
  );
}
```

### Image Loading

```typescript
import { trpc } from './lib/trpc';

function FacilityImages({ imagePaths }) {
  const { data: images } = trpc.mediaStorage.getImageUrl.useQuery({
    paths: imagePaths,
    isFacility: true,
    width: 800,
  });
  
  return (
    <View>
      {images?.map((img, i) => (
        <Image key={i} source={{ uri: img.url }} />
      ))}
    </View>
  );
}
```

### Mutations

```typescript
import { trpc } from './lib/trpc';

function CreateFacilityForm() {
  const mutation = trpc.facilityProfiles.insertFacility.useMutation({
    onSuccess: () => {
      console.log('Facility created!');
    },
  });
  
  const handleSubmit = () => {
    mutation.mutate({
      facilityName: 'New Hospital',
      facilityType: 'hospitals_&_clinics',
      // ... other fields
    });
  };
}
```

## 🔐 Protected Routes

```typescript
import { useSession } from './lib/auth-client';

function ProtectedScreen() {
  const { data: session, isLoading } = useSession();
  
  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  if (!session?.user) {
    return <Text>Please login</Text>;
  }
  
  return <YourProtectedContent />;
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "Network request failed"**
- Check API_URL in `.env`
- Ensure backend is running
- For physical device: use local IP, not localhost

**2. "Unauthorized" errors**
- Check if you're logged in
- Verify token in SecureStore
- Check backend CORS settings

**3. Images not loading**
- Use React Native's `<Image>` component
- Check image URLs are valid
- Verify network permissions

**4. "expo-secure-store not found"**
```bash
expo install expo-secure-store
```

### Debugging

Enable detailed logging in `lib/trpc-client.ts`:
```typescript
fetch(url, options) {
  console.log('Request:', url, options);
  return fetch(url, options).then(res => {
    console.log('Response:', res.status);
    return res;
  });
}
```

## 📱 Testing

### iOS Simulator
```bash
pnpm ios
```

### Android Emulator
```bash
pnpm android
```

### Physical Device
1. Install Expo Go app
2. Scan QR code from terminal
3. Update `.env` with your local IP

## 🚀 Building for Production

### Create Build
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Update Environment
```bash
# Production .env
API_URL=https://your-production-api.com
```

## 📚 Resources

- [tRPC Documentation](https://trpc.io)
- [Better Auth Documentation](https://www.better-auth.com)
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Query Documentation](https://tanstack.com/query)

## 🤝 Need Help?

Check the example files:
- `examples/auth-examples.tsx` - Authentication patterns
- `examples/trpc-usage-examples.tsx` - API call patterns

## 📝 Next Steps

1. ✅ Set up environment
2. ✅ Configure authentication
3. ✅ Test API connection
4. 🚧 Build your screens
5. 🚧 Add navigation
6. 🚧 Implement features
7. 🚧 Test on device
8. 🚧 Deploy to stores

Happy coding! 🎉
