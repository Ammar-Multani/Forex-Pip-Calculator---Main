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
  | "card"
  | "header"
  | "modal";

// Define gradient options for both light and dark themes
export interface GradientOptions {
  colors: string[];
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
  secondary: string;
  accent: string;
  placeholder: string;
  error: string;
  info: string;
  success: string;
  warning: string;
  highlight: string;
  input: string;
  gradients: Record<GradientType, GradientOptions>;
}

// Modern 2025 Light Theme
export const lightTheme: ColorTheme = {
  background: "#f8fafd",
  card: "#ffffff",
  text: "#1a1c25",
  subtext: "#5a6072",
  border: "#e4e8f0",
  primary: "#4361ee",
  secondary: "#3a86ff",
  accent: "#4cc9f0",
  placeholder: "#a0a8c0",
  error: "#ef476f",
  info: "#4361ee",
  success: "#06d6a0",
  warning: "#ffd166",
  highlight: "#eef2ff",
  input: "#f5f7fa",
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
      colors: ["#3a86ff", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#06d6a0", "#2dc653"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#4cc9f0", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#ffffff", "#f8fafd"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    header: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    modal: {
      colors: ["#ffffff", "#f8fafd"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
  },
};

// Modern 2025 Dark Theme
export const darkTheme: ColorTheme = {
  background: "#0f1117",
  card: "#1a1d29",
  text: "#f0f2f8",
  subtext: "#a0a8c0",
  border: "#2a2e3a",
  primary: "#4361ee",
  secondary: "#3a86ff",
  accent: "#4cc9f0",
  placeholder: "#5a6072",
  error: "#ef476f",
  info: "#4361ee",
  success: "#06d6a0",
  warning: "#ffd166",
  highlight: "#212433",
  input: "#242836",
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
      colors: ["#3a86ff", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#06d6a0", "#2dc653"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#4cc9f0", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#1a1d29", "#151823"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    header: {
      colors: ["#1f2233", "#151823"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    modal: {
      colors: ["#1a1d29", "#151823"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
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
