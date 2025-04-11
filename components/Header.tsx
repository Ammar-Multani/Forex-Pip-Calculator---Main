import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  onThemeToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onThemeToggle }) => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();

  const isDarkMode = theme === "dark";

  const handleSettingsPress = () => {
    // @ts-ignore - Using expo-router navigation
    navigation.navigate("settings");
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.buttonsContainer}>
        {onThemeToggle && (
          <TouchableOpacity style={styles.iconButton} onPress={onThemeToggle}>
            <MaterialIcons
              name={isDarkMode ? "light-mode" : "dark-mode"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSettingsPress}
        >
          <MaterialIcons name="settings" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default Header;
