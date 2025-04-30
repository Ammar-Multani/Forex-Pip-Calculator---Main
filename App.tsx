import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import CalculatorScreen from "./screens/CalculatorScreen";
import InfoScreen from "./screens/InfoScreen";
import SettingsScreen from "./screens/SettingsScreen";
import TermsOfServiceScreen from "./screens/TermsOfServiceScreen";
import DisclaimerScreen from "./screens/DisclaimerScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import HelpGuideScreen from "./screens/HelpGuideScreen";
import HistoryScreen from "./screens/HistoryScreen";
import OnboardingScreen, {
  ONBOARDING_COMPLETE_KEY,
} from "./screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create stack navigator
const Stack = createNativeStackNavigator();

// Main app content with theme access
const AppContent = () => {
  const { theme } = useTheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;
  const isDarkMode = theme === "dark";
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setIsOnboardingComplete(value === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboardingComplete(false);
      }
    };

    checkOnboarding();
  }, []);

  // Set navigation bar and status bar color based on theme
  useEffect(() => {
    async function updateNavigationBar() {
      await NavigationBar.setBackgroundColorAsync(
        isDarkMode ? "#121212" : "#FFFFFF"
      );
      await NavigationBar.setButtonStyleAsync(isDarkMode ? "light" : "dark");
    }

    updateNavigationBar();
  }, [isDarkMode]);

  // Show loading screen while checking onboarding status
  if (isOnboardingComplete === null) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={isOnboardingComplete ? "Calculator" : "Onboarding"}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Calculator" component={CalculatorScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfServiceScreen}
          />
          <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="HelpGuide" component={HelpGuideScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
