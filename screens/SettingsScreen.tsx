import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Modal,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ApiKeyManager from "../components/ApiKeyManager";
import Header from "../components/Header";
import { LinearGradient } from "expo-linear-gradient";

const SettingsScreen: React.FC = () => {
  const { colors, theme, toggleTheme, setTheme, getGradient } = useTheme();
  const navigation = useNavigation();
  const [apiKeyModalVisible, setApiKeyModalVisible] = useState(false);

  const isDarkMode = theme === "dark";

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleApiKeysPress = () => {
    setApiKeyModalVisible(true);
  };

  const handleCloseApiKeyModal = () => {
    setApiKeyModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />
      <Header title="Settings" showBackButton onThemeToggle={toggleTheme} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Appearance Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <MaterialIcons
                  name="palette"
                  size={22}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <View
                  style={[
                    styles.smallIconContainer,
                    { backgroundColor: colors.primary + "10" },
                  ]}
                >
                  <MaterialIcons
                    name="brightness-6"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: "#767577", true: colors.primary + "90" }}
                thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </LinearGradient>
        </View>

        {/* API Data Sources Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <MaterialIcons
                  name="cloud-done"
                  size={22}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                API Data Sources
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary + "15" },
              ]}
              onPress={handleApiKeysPress}
              activeOpacity={0.7}
            >
              <MaterialIcons name="vpn-key" size={20} color={colors.primary} />
              <Text
                style={[styles.actionButtonText, { color: colors.primary }]}
              >
                Manage API Keys
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.infoContainer,
                {
                  backgroundColor: colors.info + "10",
                  borderLeftColor: colors.info,
                  borderLeftWidth: 4,
                },
              ]}
            >
              <MaterialIcons
                name="info-outline"
                size={20}
                color={colors.info}
              />
              <Text style={[styles.infoText, { color: colors.subtext }]}>
                The app is currently using TraderMade API for reliable real-time
                forex data.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* About Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 4,
                },
              }),
            },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <MaterialIcons name="info" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About
              </Text>
            </View>

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
          </LinearGradient>
        </View>
      </ScrollView>

      {/* API Key Manager Modal */}
      <Modal
        visible={apiKeyModalVisible}
        animationType="slide"
        onRequestClose={handleCloseApiKeyModal}
      >
        <ApiKeyManager onClose={handleCloseApiKeyModal} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 0,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  smallIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
});

export default SettingsScreen;
