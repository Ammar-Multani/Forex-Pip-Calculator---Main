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
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 3,
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
              <MaterialIcons name="palette" size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <MaterialIcons
                  name="brightness-6"
                  size={24}
                  color={colors.text}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor="#f4f3f4"
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
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 3,
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
              <MaterialIcons
                name="cloud-done"
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                API Data Sources
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary + "20" },
              ]}
              onPress={handleApiKeysPress}
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
                { backgroundColor: colors.info + "15" },
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
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 3,
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
              <MaterialIcons name="info" size={22} color={colors.primary} />
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
              <View style={styles.divider} />
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
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
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
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "40%",
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});

export default SettingsScreen;
