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
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onThemeToggle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  leftComponent,
}) => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();

  const isDarkMode = theme === "dark";

  const handleSettingsPress = () => {
    navigation.navigate("Settings" as never);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
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
              ? ["rgba(40, 40, 40, 0.9)", "rgba(25, 25, 25, 0.9)"]
              : ["rgba(255, 255, 255, 1)", "rgba(250, 250, 250, 0.98)"]
          }
          style={styles.headerGradient}
        >
          <View style={styles.headerLeft}>
            {showBackButton ? (
              <TouchableOpacity
                style={[
                  styles.backButton,
                  Platform.OS === "web" && styles.webBackButton,
                ]}
                onPress={handleBackPress}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <MaterialIcons
                  name="arrow-back"
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              </TouchableOpacity>
            ) : null}
            {leftComponent ? (
              leftComponent
            ) : (
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: isDarkMode ? "#FFFFFF" : "#333333" },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: isDarkMode ? "#AAAAAA" : "#757575" },
                    ]}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.headerActions}>
            {rightComponent}

            {/* {!showBackButton && (
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
            )} */}

            {onThemeToggle && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onThemeToggle}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <View style={styles.iconButtonInner}>
                  <MaterialIcons
                    name={isDarkMode ? "light-mode" : "dark-mode"}
                    size={24}
                    color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                  />
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSettingsPress}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <View style={styles.iconButtonInner}>
                <MaterialIcons
                  name="settings"
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              </View>
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
    paddingTop: Platform.OS === "ios" ? 56 : 35,
    paddingBottom: 16,
    borderBottomWidth: 1,
    height: Platform.OS === "ios" ? 110 : 95,
    zIndex: 10,
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 8,
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  iconButton: {
    marginLeft: -3,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonInner: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    height: 40,
    width: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  webBackButton: {
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: "rgba(108, 140, 242, 0.1)",
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  },
});

export default Header;
