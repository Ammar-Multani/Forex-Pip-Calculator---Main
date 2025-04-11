import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { colors, ThemeType, ColorScheme } from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the context type
interface ThemeContextType {
  theme: ThemeType;
  colors: ColorScheme;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colors: colors.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Storage key for theme preference
const THEME_STORAGE_KEY = "forex-pip-calculator-theme";

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get the device color scheme
  const deviceTheme = useColorScheme() as ThemeType;

  // State for the current theme
  const [theme, setThemeState] = useState<ThemeType>(deviceTheme || "light");

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Get the current color scheme based on the theme
  const currentColors = theme === "light" ? colors.light : colors.dark;

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    colors: currentColors,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);
