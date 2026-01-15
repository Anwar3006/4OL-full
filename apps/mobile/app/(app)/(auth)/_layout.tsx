import React from "react";
import { Tabs } from "expo-router";

const AuthScreensLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="Home" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default AuthScreensLayout;
