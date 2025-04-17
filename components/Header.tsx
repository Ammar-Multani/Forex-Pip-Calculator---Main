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
import { LinearGradient } from "expo-linear-gradient";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onThemeToggle?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
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

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
            borderBottomColor: isDarkMode
              ? "rgba(75, 75, 75, 0.3)"
              : "rgba(230, 230, 230, 0.8)",
          },
        ]}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? ["rgba(40, 40, 40, 0.8)", "rgba(30, 30, 30, 0.8)"]
              : ["rgba(255, 255, 255, 1)", "rgba(250, 250, 250, 0.95)"]
          }
          style={styles.headerGradient}
        >
          <View style={styles.headerLeft}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.iconButtonbacl}
                onPress={handleBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 0 }}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              </TouchableOpacity>
            ) : null}
            <View style={showBackButton ? { marginLeft: -10 } : {}}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#333333" },
                ]}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: isDarkMode ? "#AAAAAA" : "#757575" },
                  ]}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.headerActions}>
            {!showBackButton && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleInfoPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              </TouchableOpacity>
            )}

            {onThemeToggle && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onThemeToggle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name={isDarkMode ? "light-mode" : "dark-mode"}
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSettingsPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="settings"
                size={24}
                color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 3,
    height: 100,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingTop: 7,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: "row",
    paddingTop: 16,
  },
  iconButton: {
    marginLeft: 8,
    padding: 8,
  },
  iconButtonbacl: {
    marginLeft: 8,
    padding: 8,
    right: 17,
  },
});

export default Header;
