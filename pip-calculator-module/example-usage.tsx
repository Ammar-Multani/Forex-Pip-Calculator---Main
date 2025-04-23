import React, { useState } from "react";
import { View, StyleSheet, Text, Switch, SafeAreaView } from "react-native";
import { PipCalculator } from "./index";
import { ThemeType, getColors } from "./utils/theme";

/**
 * Example screen showing how to integrate the PipCalculator module
 * into a React Native application
 */
export default function PipCalculatorScreen() {
  const [theme, setTheme] = useState<ThemeType>("light");
  const colors = getColors(theme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with theme toggle */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Forex Pip Calculator
        </Text>
        <View style={styles.themeToggle}>
          <Text style={[styles.themeLabel, { color: colors.subtext }]}>
            {theme === "light" ? "Light" : "Dark"}
          </Text>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: colors.primary + "70" }}
            thumbColor={theme === "dark" ? colors.primary : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Pip Calculator Component */}
      <PipCalculator
        theme={theme}
        onThemeChange={setTheme}
        containerStyle={styles.calculatorContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  calculatorContainer: {
    flex: 1,
  },
});
