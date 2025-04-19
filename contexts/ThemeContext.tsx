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
  | "accent";

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
  secondary: string;
  accent: string;
  placeholder: string;
  error: string;
  info: string;
  success: string;
  highlight: string;
  input: string;
  gradients: Record<GradientType, GradientOptions>;
}

// Modern 2025 Light Theme
export const lightTheme: ColorTheme = {
  background: "#f8fafd",
  card: "#ffffff",
  text: "#1a1a2e",
  subtext: "#5d6b98",
  border: "#e4e9f2",
  primary: "#4361ee",
  secondary: "#3f37c9",
  accent: "#4895ef",
  placeholder: "#a0aec0",
  error: "#e53e3e",
  info: "#4299e1",
  success: "#38b2ac",
  highlight: "#ebf4ff",
  input: "#f7fafc",
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#3f37c9", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#38b2ac", "#2f855a"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#4299e1", "#3182ce"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#ffffff", "#f8fafd"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    header: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    accent: {
      colors: ["#4895ef", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
  },
};

// Modern 2025 Dark Theme
export const darkTheme: ColorTheme = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  subtext: "#94a3b8",
  border: "#334155",
  primary: "#4361ee",
  secondary: "#3f37c9",
  accent: "#4895ef",
  placeholder: "#64748b",
  error: "#ef4444",
  info: "#38bdf8",
  success: "#10b981",
  highlight: "#1e3a8a",
  input: "#1e293b",
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    secondary: {
      colors: ["#3f37c9", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
      colors: ["#10b981", "#059669"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
      colors: ["#38bdf8", "#0284c7"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
      colors: ["#1e293b", "#0f172a"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    header: {
      colors: ["#1e293b", "#0f172a"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    accent: {
      colors: ["#4895ef", "#4361ee"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
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
