import { StyleSheet } from "react-native";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import CalculatorScreen from "./screens/CalculatorScreen";
import InfoScreen from "./screens/InfoScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Create stack navigator
const Stack = createNativeStackNavigator();

// Main app content with theme access
const AppContent = () => {
  const { theme } = useTheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Calculator"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
