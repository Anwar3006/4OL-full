# Biometric Login with Expo

This guide provides a step-by-step walkthrough for implementing biometric authentication (Face ID, Touch ID) in your Expo application using the `expo-local-authentication` library. This feature enhances security and provides a seamless login experience for your users.

## 1. Installation

First, you need to add the `expo-local-authentication` package to your project.

```bash
npx expo install expo-local-authentication
```

## 2. Configuration (iOS)

To use biometric authentication on iOS, you must provide a reason for its use in your `app.json` or `app.config.ts`. This description will be displayed to the user in the permission prompt.

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "This app uses Face ID to secure your account and streamline your login experience."
      }
    }
  }
}
```

## 3. Implementation Steps

The following steps outline how to integrate biometric authentication into your login flow.

### Step 3.1: Check for Hardware and Enrollment

Before attempting to authenticate, you must verify that the device supports biometric authentication and that the user has enrolled their biometrics.

```javascript
import * as LocalAuthentication from "expo-local-authentication";

const checkBiometricSupport = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    console.log("Biometric hardware not available");
    return false;
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    console.log("No biometrics enrolled");
    return false;
  }

  return true;
};
```

### Step 3.2: Trigger Authentication

Once you've confirmed that the device is capable and the user is enrolled, you can trigger the biometric prompt.

```javascript
const handleBiometricLogin = async () => {
  const isBiometricSupported = await checkBiometricSupport();
  if (!isBiometricSupported) {
    // Fallback to traditional login (e.g., password)
    return;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Log in with your biometrics",
    cancelLabel: "Cancel",
    fallbackLabel: "Use Password", // iOS only
  });

  if (result.success) {
    console.log("Biometric authentication successful!");
    // Proceed with login
  } else {
    console.log("Biometric authentication failed or was canceled.");
  }
};
```

### Step 3.3: Storing User Credentials

For a complete biometric login solution, you'll need to securely store the user's credentials (e.g., a token or password) after their initial login. `expo-secure-store` is the recommended library for this.

**Installation:**

```bash
npx expo install expo-secure-store
```

**Usage:**

```javascript
import * as SecureStore from "expo-secure-store";

// After a successful password login, save the credentials
await SecureStore.setItemAsync(
  "user_credentials",
  JSON.stringify({
    username: "user@example.com",
    password: "user_password", // Or a token
  })
);

// During biometric login, retrieve the credentials
const credentialsJson = await SecureStore.getItemAsync("user_credentials");
if (credentialsJson) {
  const credentials = JSON.parse(credentialsJson);
  // Use the credentials to log the user in
}
```

## 4. Complete Login Flow Example

Here is an example of a `Login` component that incorporates biometric authentication.

```javascript
import React, { useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const LoginScreen = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const isAvailable =
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync());
      setIsBiometricAvailable(isAvailable);
    })();
  }, []);

  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account",
    });

    if (result.success) {
      const credentialsJson =
        await SecureStore.getItemAsync("user_credentials");
      if (credentialsJson) {
        const credentials = JSON.parse(credentialsJson);
        // Log in with the stored credentials
        Alert.alert("Success", `Logged in as ${credentials.username}`);
      }
    } else {
      Alert.alert("Authentication Failed", "Could not verify your identity.");
    }
  };

  const handlePasswordLogin = async () => {
    // ... your password login logic ...
    // After a successful login:
    await SecureStore.setItemAsync(
      "user_credentials",
      JSON.stringify({
        username: "user@example.com",
        password: "user_password",
      })
    );
  };

  return (
    <View>
      {isBiometricAvailable && (
        <Button title="Login with Biometrics" onPress={handleBiometricLogin} />
      )}
      {/* ... your password login form ... */}
      <Button title="Login with Password" onPress={handlePasswordLogin} />
    </View>
  );
};

export default LoginScreen;
```

This documentation provides a solid foundation for implementing biometric authentication in your Expo application. Remember to handle edge cases and provide clear feedback to the user throughout the process.

📁 Files Created

1. Core Hook: hooks/use-biometric-auth.tsx

Handles all biometric operations
Checks device support
Manages secure credential storage
Provides easy-to-use API

2. Setup Prompt: components/auth/BiometricSetupPrompt.tsx

Beautiful modal that appears after first login
Explains benefits of biometric login
Handles user choice (enable or later)

3. Login Button: components/auth/BiometricLoginButton.tsx

Shows on login screen if biometrics enabled
Triggers biometric authentication
Auto-fills credentials on success

4. Updated Login Form: components/auth/LoginForm.tsx

Integrated biometric flow
Shows biometric button for returning users
Prompts setup for new users

5. Settings Component: components/settings/BiometricSettings.tsx

Toggle to enable/disable biometrics
Can be added to your Profile/Settings screen

🚀 How to Use
The Login Form (Already Updated)
Your LoginForm.tsx now automatically:

✅ Shows biometric button if enabled
✅ Prompts to enable biometrics after first login
✅ Handles both email/password and biometric login

```tsx
// In your Profile or Settings screen
import { BiometricSettings } from "@/components/settings/BiometricSettings";

export default function ProfileScreen() {
  return (
    <View>
      {/* Other settings */}

      {/* Biometric Settings */}
      <BiometricSettings />

      {/* More settings */}
    </View>
  );
}
```

🔐 Security Features
Secure Storage

✅ Credentials stored in iOS Keychain / Android KeyStore
✅ Hardware-backed encryption
✅ Cannot be accessed by other apps
✅ Automatically deleted when app is uninstalled

Biometric Authentication

✅ Uses device's native Face ID / Touch ID
✅ Falls back to device passcode if biometric fails
✅ User can cancel anytime
✅ No biometric data is stored or sent to server

```ts
// Stored in secure device storage:
{
  email: "user@example.com",      // Encrypted
  password: "password123",         // Encrypted
  biometric_enabled: "true"        // Boolean flag
}
```
