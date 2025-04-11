import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Theme storage key
const THEME_STORAGE_KEY = "forex-pip-calculator-theme";

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
  primary: "#5a6ed1",
  placeholder: "#bfc5cf",
  error: "#f44336",
  info: "#0288d1",
  success: "#4caf50",
  highlight: "#f0f7ff",
  gradients: {
    primary: {
      colors: ["#5a6ed1", "#5a6ed1"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#5a6ed1", "#5a6ed1"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#43cc90", "#32b47e"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#5a6ed1", "#5a6ed1"],
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
  primary: "#5a6ed1",
  placeholder: "#5e5e5e",
  error: "#f55246",
  info: "##5a6ed1",
  success: "#66bb6a",
  highlight: "#303030",
  gradients: {
    primary: {
      colors: ["#5a6ed1", "#5a6ed1"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#5a6ed1", "#5a6ed1"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#50c690", "#3fa876"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#5a6ed1", "#5a6ed1"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#1e1e1e", "#161616"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

// Theme context
interface ThemeContextProps {
  colors: ColorTheme;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  getGradient: (type: GradientType) => GradientOptions;
}

export const ThemeContext = createContext<ThemeContextProps>({
  colors: lightTheme,
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  getGradient: () => ({ colors: ["#ffffff", "#ffffff"] }),
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultTheme = (useColorScheme() as "light" | "dark") || "light";
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  // Load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setTheme(savedTheme as "light" | "dark");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();
  }, []);

  // Save theme when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.error("Error saving theme:", error);
      }
    };

    saveTheme();
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
        toggleTheme,
        setTheme,
        getGradient,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);
