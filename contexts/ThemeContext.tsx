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
<<<<<<< Updated upstream
  | "modal";
=======
  | "accent";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
<<<<<<< Updated upstream
      colors: ["#3a86ff", "#4361ee"],
=======
      colors: ["#3f37c9", "#4361ee"],
>>>>>>> Stashed changes
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
<<<<<<< Updated upstream
      colors: ["#06d6a0", "#2dc653"],
=======
      colors: ["#38b2ac", "#2f855a"],
>>>>>>> Stashed changes
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
<<<<<<< Updated upstream
      colors: ["#4cc9f0", "#4361ee"],
=======
      colors: ["#4299e1", "#3182ce"],
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  gradients: {
    primary: {
      colors: ["#4361ee", "#3a0ca3"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
<<<<<<< Updated upstream
      colors: ["#3a86ff", "#4361ee"],
=======
      colors: ["#3f37c9", "#4361ee"],
>>>>>>> Stashed changes
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    success: {
<<<<<<< Updated upstream
      colors: ["#06d6a0", "#2dc653"],
=======
      colors: ["#10b981", "#059669"],
>>>>>>> Stashed changes
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    info: {
<<<<<<< Updated upstream
      colors: ["#4cc9f0", "#4361ee"],
=======
      colors: ["#38bdf8", "#0284c7"],
>>>>>>> Stashed changes
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    card: {
<<<<<<< Updated upstream
      colors: ["#1a1d29", "#151823"],
=======
      colors: ["#1e293b", "#0f172a"],
>>>>>>> Stashed changes
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
