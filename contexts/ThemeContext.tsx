import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme storage key
const THEME_STORAGE_KEY = "forex-pip-calculator-theme";
// Theme preference key
export const THEME_PREFERENCE_KEY = "forex-pip-calculator-theme-preference";

// Theme type
export type ThemeType = "light" | "dark";
export type ThemePreference = ThemeType | "system";

// Define gradient types
export type GradientType =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "card";

// Define gradient options for both light and dark themes
export interface GradientOptions {
  colors: [string, string];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

// Define the color theme
export interface ColorTheme {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  placeholder: string;
  error: string;
  info: string;
  success: string;
  highlight: string;
  gradients: Record<GradientType, GradientOptions>;
}

// Themes
export const lightTheme: ColorTheme = {
  background: "#f8f9fb",
  card: "#ffffff",
  text: "#1a1a1a",
  subtext: "#6e7687",
  border: "#e0e5e9",
  primary: "#6c8cf2",
  placeholder: "#bfc5cf",
  error: "#f44336",
  info: "#6c8cf2",
  success: "#4caf50",
  highlight: "#f0f7ff",
  gradients: {
    primary: {
      colors: ["#6c8cf2", "#5476e5"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#7d9af4", "#6c8cf2"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#4cdd93", "#32b47e"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#7d9af4", "#5476e5"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#ffffff", "#f8f9fb"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

export const darkTheme: ColorTheme = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#f5f5f5",
  subtext: "#a0a0a0",
  border: "#2c2c2c",
  primary: "#6c8cf2",
  placeholder: "#5e5e5e",
  error: "#f55246",
  info: "#6c8cf2",
  success: "#66bb6a",
  highlight: "#303030",
  gradients: {
    primary: {
      colors: ["#5476e5", "#3f61d3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#6c8cf2", "#5476e5"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#50c690", "#3fa876"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#6c8cf2", "#5476e5"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#1e1e1e", "#171717"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

// Theme context
interface ThemeContextProps {
  colors: ColorTheme;
  theme: ThemeType;
  themePreference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  setThemePreference: (preference: ThemePreference) => void;
  getGradient: (type: GradientType) => GradientOptions;
}

export const ThemeContext = createContext<ThemeContextProps>({
  colors: lightTheme,
  theme: "light",
  themePreference: "system",
  toggleTheme: () => {},
  setTheme: () => {},
  setThemePreference: () => {},
  getGradient: () => ({ colors: ["#ffffff", "#ffffff"] }),
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemTheme = (useColorScheme() as ThemeType) || "light";
  const [theme, setTheme] = useState<ThemeType>(systemTheme);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>("system");

  // Load saved theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(
          THEME_PREFERENCE_KEY
        );
        if (savedPreference) {
          setThemePreference(savedPreference as ThemePreference);

          // If preference is not system, set the theme directly
          if (savedPreference !== "system") {
            setTheme(savedPreference as ThemeType);
          }
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Update theme when system theme changes if preference is "system"
  useEffect(() => {
    if (themePreference === "system") {
      setTheme(systemTheme);
    }
  }, [systemTheme, themePreference]);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themePreference);
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    };

    saveThemePreference();
  }, [themePreference]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setThemePreference(newTheme); // Set preference to the specific theme
  };

  // Set theme preference
  const handleSetThemePreference = (preference: ThemePreference) => {
    setThemePreference(preference);

    // If the preference is a specific theme, update the theme
    if (preference !== "system") {
      setTheme(preference);
    } else {
      // If system theme, follow the device theme
      setTheme(systemTheme);
    }
  };

  // Get colors based on theme
  const colors = theme === "light" ? lightTheme : darkTheme;

  // Helper function to get gradient configuration
  const getGradient = (type: GradientType): GradientOptions => {
    return colors.gradients[type];
  };

  return (
    <ThemeContext.Provider
      value={{
        colors,
        theme,
        themePreference,
        toggleTheme,
        setTheme,
        setThemePreference: handleSetThemePreference,
        getGradient,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);
