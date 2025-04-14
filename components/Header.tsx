import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  LinearGradient,
  useSafeAreaInsets,
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
  const { colors, theme, getGradient } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
  const screenWidth = Dimensions.get("window").width;

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
        translucent
      />
      <LinearGradient
        colors={getGradient("header").colors}
        start={getGradient("header").start}
        end={getGradient("header").end}
        style={[
          styles.headerContainer,
          { paddingTop: insets.top > 0 ? insets.top : 30 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.leftContainer}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleInfoPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="info-outline" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>{title}</Text>

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
                  color="white"
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSettingsPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    color: "white",
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
});

export default Header;
