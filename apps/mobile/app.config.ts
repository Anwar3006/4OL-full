import "dotenv/config";

export default {
  expo: {
    name: "4 Our Life",
    slug: "4ourlife",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "4ourlife",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.4thpayapps.4ourlife.v2",
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
      infoPlist: {
        NSFaceIDUsageDescription:
          "This app uses Face ID to secure your account and streamline your login experience.",
        NSLocationWhenInUseUsageDescription:
          "This app needs access to location to show nearby facilities.",
        NSUserTrackingUsageDescription:
          "This identifier will be used to ensure your healthcare data remains secure and to provide a personalized experience.",
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: "com.fourthpayapps.fourourlife.v2",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      configChanges: [
        "keyboard",
        "keyboardHidden",
        "orientation",
        "screenSize",
        "smallestScreenSize",
        "screenLayout",
      ],
      softwareKeyboardLayoutMode: "pan",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-icon-light.png",
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "16.0",
            useFrameworks: "static",
          },
        },
      ],
      "expo-video",
      "expo-asset",
      "expo-secure-store",
      // "expo-notifications", //UNDO
      // "react-native-map",
    ],
    experiments: {
      typedRoutes: true,
      reactCanary: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
      SUPABASE_BUCKET_NAME: process.env.SUPABASE_BUCKET_NAME,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "80101bfa-71d7-4483-96ae-76f6e8ccb6f5",
      },
    },
    owner: "anwar3006",
  },
};
