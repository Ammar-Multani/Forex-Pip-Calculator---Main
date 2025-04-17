import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
  Linking,
  Alert,
  Share,
  StatusBar as RNStatusBar,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ApiKeyManager from "../components/ApiKeyManager";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a type for MaterialIcons names we use in this file
type IconName =
  | "palette"
  | "vpn-key"
  | "info-outline"
  | "description"
  | "warning"
  | "security"
  | "help-outline"
  | "share"
  | "bug-report"
  | "delete"
  | "chevron-right"
  | "arrow-back"
  | "brightness-6";

const SettingsScreen: React.FC = () => {
  const { colors, theme, toggleTheme, setTheme, getGradient } = useTheme();
  const navigation = useNavigation();
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);

  const isDarkMode = theme === "dark";

  const handleApiKeysPress = () => {
    setApiKeyModalVisible(true);
  };

  const handleCloseApiKeyModal = () => {
    setApiKeyModalVisible(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleClearHistory = async () => {
    Alert.alert(
      "Erase All Content",
      "Are you sure you want to erase all content and settings? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Erase",
          onPress: async () => {
            // Clear relevant storage keys
            try {
              const keys = await AsyncStorage.getAllKeys();
              const calculationKeys = keys.filter(
                (key) =>
                  key.startsWith("forex-pip-calculator-") &&
                  !key.includes("api-key")
              );
              await AsyncStorage.multiRemove(calculationKeys);
              Alert.alert("Content Erased", "All content has been erased.");
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert("Error", "Failed to clear data");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Check out this amazing Forex Pip Calculator app!",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the app.");
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleSubmitBugReport = () => {
    Linking.openURL("mailto:support@example.com?subject=Bug%20Report");
  };

  const renderSettingItem = (
    icon: IconName,
    title: string,
    onPress: () => void,
    showChevron = true,
    rightContent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          borderBottomColor: isDarkMode
            ? "rgba(80, 80, 80, 0.5)"
            : "rgba(220, 220, 220, 0.8)",
          borderBottomWidth: 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={rightContent ? 1 : 0.6}
    >
      <View style={styles.settingItemLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + "15" },
          ]}
        >
          <MaterialIcons name={icon} size={22} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.settingItemText,
            { color: isDarkMode ? "#FFFFFF" : "#212121" },
          ]}
        >
          {title}
        </Text>
      </View>
      {rightContent ||
        (showChevron && (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={isDarkMode ? "#AAAAAA" : "#757575"}
          />
        ))}
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? "#AAAAAA" : "#757575" },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.section,
          {
            backgroundColor: isDarkMode ? "#1E1E1E" : "white",
            borderColor: isDarkMode
              ? "rgba(80, 80, 80, 0.5)"
              : "rgba(220, 220, 220, 0.8)",
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 16,
            overflow: "hidden",
          },
        ]}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? ["rgba(40, 40, 40, 0.7)", "rgba(30, 30, 30, 0.5)"]
              : ["rgba(255, 255, 255, 0.95)", "rgba(250, 250, 255, 0.85)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sectionGradient}
        >
          {children}
        </LinearGradient>
      </View>
    </>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#F8F9FA" },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RNStatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
            borderBottomColor: isDarkMode
              ? "rgba(75, 75, 75, 0.3)"
              : "rgba(230, 230, 230, 0.8)",
            borderBottomWidth: 1,
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              SETTINGS
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSection(
          "APPEARANCE",
          <>
            {renderSettingItem(
              "brightness-6",
              "Dark Mode",
              () => {},
              false,
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: "#767577", true: colors.primary + "90" }}
                thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            )}
          </>
        )}

        {renderSection(
          "API DATA SOURCES",
          <>
            {renderSettingItem(
              "vpn-key",
              "Manage API Keys",
              handleApiKeysPress
            )}
          </>
        )}

        {renderSection(
          "LEGAL",
          <>
            {renderSettingItem("description", "Terms of service", () =>
              handleOpenLink("https://example.com/terms")
            )}
            {renderSettingItem("warning", "Disclaimer", () =>
              handleOpenLink("https://example.com/disclaimer")
            )}
          </>
        )}

        {renderSection(
          "PRIVACY",
          <>
            {renderSettingItem("security", "Privacy policy", () =>
              handleOpenLink("https://example.com/privacy")
            )}
          </>
        )}

        {renderSection(
          "FOREX PIP CALCULATOR",
          <>
            {renderSettingItem("help-outline", "Help Guide", () =>
              handleOpenLink("https://example.com/help")
            )}
            {renderSettingItem(
              "share",
              "Share this app",
              handleShareApp,
              false
            )}
          </>
        )}

        {renderSection(
          "CUSTOMER SERVICE",
          <>
            {renderSettingItem(
              "bug-report",
              "Report a bug",
              handleSubmitBugReport
            )}
          </>
        )}

        {renderSection(
          "ABOUT",
          <>
            <View style={styles.aboutContainer}>
              <Text style={[styles.appName, { color: colors.text }]}>
                Forex Pip Calculator
              </Text>
              <Text style={[styles.appVersion, { color: colors.subtext }]}>
                Version 1.2.0
              </Text>
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <Text style={[styles.appDescription, { color: colors.subtext }]}>
                A professional-grade calculator for forex traders, with
                real-time exchange rates and accurate pip calculations.
              </Text>
            </View>
          </>
        )}

        <View style={styles.dangerSection}>
          <LinearGradient
            colors={
              isDarkMode
                ? ["rgba(40, 40, 40, 0.7)", "rgba(30, 30, 30, 0.5)"]
                : ["rgba(255, 255, 255, 0.95)", "rgba(250, 250, 255, 0.85)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.dangerSectionGradient,
              {
                borderColor: isDarkMode
                  ? "rgba(75, 75, 75, 0.2)"
                  : "rgba(230, 230, 230, 0.8)",
                borderWidth: 1,
                borderRadius: 20,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.dangerButton,
                {
                  borderColor: isDarkMode
                    ? "rgba(75, 75, 75, 0.2)"
                    : "rgba(230, 230, 230, 0.8)",
                  borderWidth: 1,
                  borderRadius: 20,
                },
              ]}
              onPress={handleClearHistory}
            >
              <View style={styles.dangerButtonContent}>
                <MaterialIcons name="delete" size={24} color="#F44336" />
                <Text style={[styles.dangerButtonText, { color: "#F44336" }]}>
                  Erase All Content
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={isDarkMode ? "#AAAAAA" : "#757575"}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* API Key Manager Modal */}
      <Modal
        visible={apiKeyModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseApiKeyModal}
        statusBarTranslucent={true}
      >
        <ApiKeyManager onClose={handleCloseApiKeyModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 16,
    height: 90,
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
    paddingHorizontal: 8,
    paddingTop: 18,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionGradient: {
    borderRadius: 20,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  dangerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  dangerSectionGradient: {
    overflow: "hidden",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  dangerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 15,
    marginBottom: 16,
  },
  divider: {
    height: 2,
    width: "40%",
    marginBottom: 16,
    borderRadius: 1,
  },
  appDescription: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
});

export default SettingsScreen;
