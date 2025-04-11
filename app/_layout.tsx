import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

export default function RootLayout() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Check network connectivity on app startup
  useEffect(() => {
    const checkConnectivity = async () => {
      const netInfoState = await NetInfo.fetch();

      // Only show the alert on first load and if not connected
      if (isFirstLoad && !netInfoState.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "You're currently offline. Some features like real-time exchange rates won't be available until you reconnect to the internet.",
          [{ text: "OK", onPress: () => setIsFirstLoad(false) }]
        );
      } else {
        setIsFirstLoad(false);
      }
    };

    checkConnectivity();

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      // No need to show alerts for subsequent changes
    });

    return () => {
      unsubscribe();
    };
  }, [isFirstLoad]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
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
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
