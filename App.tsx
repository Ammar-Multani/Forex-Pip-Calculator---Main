import React, { useEffect } from "react";
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

// Create stack navigator
const Stack = createNativeStackNavigator();

// Main app content with theme access
const AppContent = () => {
  const { theme, colors } = useTheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;
  const isDarkMode = theme === "dark";

  // Customize navigation theme
  const customNavigationTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // Set navigation bar and status bar color based on theme
  useEffect(() => {
    async function updateNavigationBar() {
      await NavigationBar.setBackgroundColorAsync(
        isDarkMode ? colors.background : colors.background
      );
      await NavigationBar.setButtonStyleAsync(isDarkMode ? "light" : "dark");
    }

    updateNavigationBar();
  }, [isDarkMode, colors]);

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer theme={customNavigationTheme}>
        <Stack.Navigator
          initialRouteName="Calculator"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="Calculator" component={CalculatorScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
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
