import React, { useState, useEffect } from "react";
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
import env from "../config/env";

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
  | "brightness-6"
  | "wb-sunny"
  | "nightlight-round"
  | "settings-suggest";

// Theme option type
interface ThemeOption {
  id: string;
  name: string;
  value: "light" | "dark" | "system";
  icon: IconName;
}

// Theme options
const themeOptions: ThemeOption[] = [
  {
    id: "light",
    name: "Light Theme",
    value: "light",
    icon: "wb-sunny",
  },
  {
    id: "dark",
    name: "Dark Theme",
    value: "dark",
    icon: "nightlight-round",
  },
  {
    id: "system",
    name: "System Default",
    value: "system",
    icon: "settings-suggest",
  },
];

const SettingsScreen: React.FC = () => {
  const {
    colors,
    theme,
    toggleTheme,
    setTheme,
    getGradient,
    themePreference,
    setThemePreference,
  } = useTheme();
  const navigation = useNavigation();
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const isDarkMode = theme === "dark";

  // Log current API key from env when component loads
  useEffect(() => {
    console.log("Current TraderMade API key from env:", env.traderMadeApiKey);
  }, []);

  const handleApiKeysPress = () => {
    setApiKeyModalVisible(true);
  };

  const handleCloseApiKeyModal = () => {
    setApiKeyModalVisible(false);
  };

  const handleThemePress = () => {
    setThemeModalVisible(true);
  };

  const handleCloseThemeModal = () => {
    setThemeModalVisible(false);
  };

  const handleThemeSelect = (themeValue: "light" | "dark" | "system") => {
    setThemePreference(themeValue);
    setThemeModalVisible(false);
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
        <View style={[styles.iconContainer]}>
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

  // Function to get theme option name
  const getThemeOptionName = () => {
    const option = themeOptions.find((opt) => opt.value === themePreference);
    return option ? option.name : "System Default";
  };

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
              "palette",
              "Theme",
              handleThemePress,
              true,
              <View style={styles.themePreviewContainer}>
                <Text style={{ color: colors.subtext }}>
                  {getThemeOptionName()}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={isDarkMode ? "#AAAAAA" : "#757575"}
                />
              </View>
            )}
          </>
        )}

        {/* {renderSection(
          "API DATA SOURCES",
          <>
            {renderSettingItem(
              "vpn-key",
              "Manage API Keys",
              handleApiKeysPress
            )}
          </>
        )} */}
        {renderSection(
          "LEGAL",
          <>
            {renderSettingItem("description", "Terms of service", () =>
              navigation.navigate("TermsOfService" as never)
            )}
            {renderSettingItem("warning", "Disclaimer", () =>
              navigation.navigate("Disclaimer" as never)
            )}
          </>
        )}

        {renderSection(
          "PRIVACY",
          <>
            {renderSettingItem("security", "Privacy policy", () =>
              navigation.navigate("PrivacyPolicy" as never)
            )}
          </>
        )}

        {renderSection(
          "FOREX PIP CALCULATOR",
          <>
            {renderSettingItem("help-outline", "Help Guide", () =>
              navigation.navigate("HelpGuide" as never)
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

        {/* <View style={styles.dangerSection}>
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
        </View> */}

        <View style={styles.footer}>
          <LinearGradient
            colors={
              isDarkMode
                ? ["rgba(40, 40, 40, 0.5)", "rgba(30, 30, 30, 0.3)"]
                : ["rgba(247, 247, 247, 0.5)", "rgba(255, 255, 255, 0.3)"]
            }
            style={[
              styles.versionContainer,
              {
                borderColor: isDarkMode
                  ? "rgba(75, 75, 75, 0.2)"
                  : "rgba(230, 230, 230, 0.8)",
              },
            ]}
          >
            <Text
              style={[
                styles.footerText,
                { color: isDarkMode ? "#AAAAAA" : "#9E9E9E" },
              ]}
            >
              Version 1.2.0
            </Text>
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

      {/* Theme Selection Modal */}
      <Modal
        visible={themeModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseThemeModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.themeModalContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.themeModalHeader}>
              <Text style={[styles.themeModalTitle, { color: colors.text }]}>
                Select Theme
              </Text>
              <TouchableOpacity onPress={handleCloseThemeModal}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.themeOptionsContainer}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: colors.card,
                      borderColor:
                        themePreference === option.value
                          ? colors.primary
                          : colors.border,
                      borderWidth: themePreference === option.value ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSelect(option.value)}
                >
                  <View
                    style={[
                      styles.themeIconContainer,
                      { backgroundColor: colors.primary + "15" },
                    ]}
                  >
                    <MaterialIcons
                      name={option.icon}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text
                    style={[styles.themeOptionText, { color: colors.text }]}
                  >
                    {option.name}
                  </Text>
                  {themePreference === option.value && (
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color={colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
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
    paddingVertical: 18,
    paddingHorizontal: 16,
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
    paddingHorizontal: 12,
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
    paddingVertical: 20,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  themePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  themeModalContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  themeModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  themeModalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  themeOptionsContainer: {
    marginTop: 10,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  versionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default SettingsScreen;
