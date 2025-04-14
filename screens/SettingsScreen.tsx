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
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";

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
      <Header 
        title="Settings" 
        onThemeToggle={toggleTheme}
        showBackButton={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
          >
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <MaterialIcons
                  name="brightness-6"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Appearance
              </Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <MaterialIcons
                  name="dark-mode"
                  size={22}
                  color={colors.text}
                />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={isDarkMode ? colors.primary : "#f4f3f4"}
                ios_backgroundColor={colors.border}
              />
            </View>
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
          >
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <MaterialIcons
                  name="public"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                API Data Sources
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.settingButton,
                { backgroundColor: colors.primary + "10" },
              ]}
              onPress={handleApiKeysPress}
            >
              <View style={styles.settingLabelContainer}>
                <MaterialIcons name="vpn-key" size={22} color={colors.text} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Manage API Keys
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.infoContainer,
                { backgroundColor: colors.info + "15" },
              ]}
            >
              <MaterialIcons name="info-outline" size={20} color={colors.info} />
              <Text style={[styles.infoText, { color: colors.subtext }]}>
                Set up API keys for different forex data providers to ensure you
                have reliable real-time data.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
          >
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <MaterialIcons
                  name="info"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                About
              </Text>
            </View>

            <View style={styles.aboutContainer}>
              <Text style={[styles.appName, { color: colors.text }]}>
                Forex Pip Calculator
              </Text>
              <Text style={[styles.appVersion, { color: colors.subtext }]}>
                Version 1.0.0
              </Text>
              <Text style={[styles.appDescription, { color: colors.subtext }]}>
                A professional-grade calculator for forex traders, with real-time
                exchange rates and accurate pip calculations.
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
    borderWidth: 1,
    overflow: "hidden",
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
  cardContent: {
    padding: 20,
  },
  cardHeaderRow: {
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
  cardTitle: {
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
  settingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default SettingsScreen;
