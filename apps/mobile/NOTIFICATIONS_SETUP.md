# Notifications Setup Guide for 4OL

This document outlines the steps required to fully enable push notifications for the 4OL mobile application.

## 1. Dependencies Installed

The following packages have been added to the project:
- `expo-notifications`: Core library for handling notifications.
- `expo-tracking-transparency`: Required for App Tracking Transparency (ATT) alerts.
- `expo-location`: Required for location-based alerts/features.

## 2. Code Implementation

- **Permission Requests**: The app now requests permissions progressively:
    - **ATT**: On the initial landing screen (`(public)/index.tsx`).
    - **Notifications**: Upon reaching the Home screen after registration (`(auth)/(tabs)/Home/index.tsx`).
    - **Location**: When navigating to the Map screen (`(auth)/(tabs)/Map.tsx`).
- **Configuration**: `expo-notifications` has been added to the `plugins` array in `app.config.ts`.

## 3. Manual Steps Required for Production

To make push notifications work in a real production environment (standalone builds), you must complete the following steps:

### iOS (APNs)
1. **Apple Developer Account**: Ensure you have a paid Apple Developer account.
2. **Push Notifications Capability**:
   - Go to the [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list).
   - Select your App ID and enable the "Push Notifications" capability.
3. **APNs Key**:
   - Create a new "Apple Push Notifications service (APNs)" key in the "Keys" section.
   - Download the `.p8` file.
4. **Upload to Expo**:
   - Run `eas credentials` in the `apps/mobile` directory.
   - Follow the prompts to upload your APNs key to Expo.

### Android (FCM)
1. **Firebase Project**:
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Add an Android App with the package name `com.anonymous.fourOL`.
2. **Google Services JSON**:
   - Download the `google-services.json` file and place it in the `apps/mobile` directory.
   - It is already referenced in `app.config.ts` under `android.googleServicesFile`.
3. **Cloud Messaging API**:
   - Enable "Cloud Messaging" in the Firebase Project Settings.
   - Upload the "Service Account Key" (JSON) to Expo using `eas credentials`.

## 4. Testing Notifications

### In Development (Expo Go)
- You can test notifications using the [Expo Push Notifications Tool](https://expo.dev/notifications).
- You will need an Expo Push Token, which can be obtained using `Notifications.getExpoPushTokenAsync()`.

### In Production
- Use the Expo SDK or a custom backend to send notifications to the Expo Push Service using the user's push token.

## 5. Troubleshooting Alerts

If alerts are not showing:
- **iOS Simulator**: Note that ATT and Push Notification alerts may behave differently or not show at all on the iOS Simulator. Test on a physical device whenever possible.
- **Permissions**: Ensure that the `NSUserTrackingUsageDescription` and other permission descriptions are correctly set in `app.config.ts` (this has already been done).
- **Foreground Notifications**: By default, notifications might not show as a heads-up alert if the app is in the foreground. Use `Notifications.setNotificationHandler` to configure foreground behavior.

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```
