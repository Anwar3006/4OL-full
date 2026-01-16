# Integrating TikTok as an OAuth Provider with Better Auth

This document outlines the steps required to integrate TikTok as an OAuth provider with Better Auth, allowing users to sign up and log in to your application using their TikTok account.

## 1. Create a TikTok Developer Account and App

Before you can integrate TikTok's OAuth, you need to create a developer account and register your application on the [TikTok for Developers](https://developers.tiktok.com/) portal.

- **Create a TikTok for Developers account:** If you don't have one, you'll need to create a new account.
- **Register your application:** Once your account is set up, create a new application to get your `client_key` and `client_secret`.
- **Configure the redirect URI:** In your TikTok app settings, set the redirect URI to `${baseURL}/api/auth/oauth2/callback/tiktok`, where `baseURL` is the base URL of your application.

## 2. Configure the Generic OAuth Plugin

Next, you'll need to configure the Generic OAuth plugin in your Better Auth setup. This involves adding the TikTok provider to your `auth.ts` file.

```ts
// server/auth.ts

import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  // ... other config options
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "tiktok",
          clientId: "YOUR_TIKTOK_CLIENT_KEY",
          clientSecret: "YOUR_TIKTOK_CLIENT_SECRET",
          authorizationUrl:
            "https://open-api.tiktok.com/platform/oauth/connect/",
          tokenUrl: "https://open-api.tiktok.com/oauth/access_token/",
          userInfoUrl: "https://open-api.tiktok.com/user/info/",
          scopes: ["user.info.basic"],
          mapProfileToUser: (profile) => {
            return {
              firstName: profile.display_name,
              // TikTok does not provide the user's last name
              lastName: "",
              email: profile.email,
            };
          },
        },
      ],
    }),
  ],
});
```

## 3. Implement the TikTok Sign-Up Button

To initiate the TikTok sign-up flow, you'll need to add a button to your `SignUpForm.tsx` that calls the `authClient.signIn.oauth2` method.

```tsx
// apps/mobile/components/auth/SignUpForm.tsx

// ... other imports
import { authClient } from "@/lib/auth-Client";

export default function SignUpForm() {
  // ... other code

  const handleTikTokSignUp = async () => {
    await authClient.signIn.oauth2({
      providerId: "tiktok",
      callbackURL: "/dashboard",
    });
  };

  return (
    <View className="w-full gap-y-4">
      {/* ... other form fields */}
      <TouchableOpacity
        onPress={handleTikTokSignUp}
        activeOpacity={0.8}
        className="mt-4 h-14 w-full flex-row items-center justify-center rounded-2xl bg-black shadow-lg shadow-gray-900"
      >
        <Text className="text-lg font-bold text-white">
          Sign Up with TikTok
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 4. Pre-populate the Sign-Up Form

After the user signs up with TikTok, the `mapProfileToUser` function will map the received data to the user's profile. To pre-populate the sign-up form with this data, you can use the `newUserCallbackURL` option to redirect the user to a specific page where you can retrieve the user's information and pre-fill the form.
