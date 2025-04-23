import React, { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OneSignal, LogLevel } from "react-native-onesignal";

export default function RootLayout() {
  // Initialize OneSignal in useEffect to ensure it runs only once
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // Initialize with your OneSignal App ID
    OneSignal.initialize("65f7d9e0-6bb4-4d14-bc58-bf7e2c10b573");

    // We'll handle permission requests in the NotificationScreen
    // This ensures a better user experience during onboarding

    // Do not automatically request permission here
    // That will be handled in the NotificationScreen component
  }, []); // Ensure this only runs once on app mount

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="info"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </OnboardingProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
