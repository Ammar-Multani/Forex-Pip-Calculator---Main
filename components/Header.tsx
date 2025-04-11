import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  onThemeToggle?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onThemeToggle,
  showBackButton = false,
}) => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();

  const isDarkMode = theme === "dark";

  const handleSettingsPress = () => {
    navigation.navigate("Settings" as never);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInfoPress = () => {
    navigation.navigate("Info" as never);
  };

  // Choose header colors based on theme for a more subtle look
  const headerBackgroundColor = isDarkMode ? "#1a1a1a" : "#fff";
  const headerTextColor = isDarkMode ? "#fff" : "#333";
  const iconColor = "#5a6ed1";

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={headerBackgroundColor}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBackgroundColor,
            borderBottomColor: isDarkMode ? colors.border : "transparent",
          },
        ]}
      >
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleInfoPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="info-outline" size={24} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.title, { color: headerTextColor }]}>{title}</Text>

        <View style={styles.rightContainer}>
          {onThemeToggle && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onThemeToggle}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name={isDarkMode ? "light-mode" : "dark-mode"}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSettingsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="settings" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 30,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
});

export default Header;
