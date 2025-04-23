export type ThemeType = "light" | "dark";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  placeholder: string;
}

export const lightTheme: ThemeColors = {
  primary: "#2F80ED",
  secondary: "#4CAF50",
  background: "#F5F7FA",
  card: "#FFFFFF",
  text: "#333333",
  subtext: "#666666",
  border: "#E0E0E0",
  error: "#DC3545",
  success: "#28A745",
  warning: "#FFC107",
  info: "#17A2B8",
  placeholder: "#BBBBBB",
};

export const darkTheme: ThemeColors = {
  primary: "#3D8BF5",
  secondary: "#4DB351",
  background: "#121212",
  card: "#1E1E1E",
  text: "#F0F0F0",
  subtext: "#BBBBBB",
  border: "#2C2C2C",
  error: "#F86674",
  success: "#48D369",
  warning: "#FFCF29",
  info: "#34B4CC",
  placeholder: "#666666",
};

export const getColors = (theme: ThemeType): ThemeColors => {
  return theme === "light" ? lightTheme : darkTheme;
};

export interface GradientConfig {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const getGradient = (
  type: "card" | "header" | "button",
  theme: ThemeType
): GradientConfig => {
  const isDark = theme === "dark";

  const configs: Record<string, GradientConfig> = {
    card: {
      colors: isDark
        ? ["rgba(40, 44, 52, 0.8)", "rgba(30, 34, 42, 0.8)"]
        : ["rgba(255, 255, 255, 0.9)", "rgba(245, 247, 250, 0.9)"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    header: {
      colors: isDark ? ["#121212", "#1E1E1E"] : ["#F5F7FA", "#FFFFFF"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    button: {
      colors: isDark ? ["#3D8BF5", "#1D6BD7"] : ["#2F80ED", "#1A65C2"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  };

  return configs[type];
};
