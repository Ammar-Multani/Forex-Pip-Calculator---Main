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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ApiKeyManager from "../components/ApiKeyManager";

const SettingsScreen: React.FC = () => {
  const { colors, theme, toggleTheme, setTheme } = useTheme();
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
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

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
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            API Data Sources
          </Text>

          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleApiKeysPress}
          >
            <View style={styles.settingLabelContainer}>
              <MaterialIcons name="vpn-key" size={24} color={colors.text} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Manage API Keys
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.subtext}
            />
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <MaterialIcons name="info-outline" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.subtext }]}>
              Set up API keys for different forex data providers to ensure you
              have reliable real-time data.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>

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
        </View>
      </ScrollView>

      {/* API Key Manager Modal */}
      <Modal
        visible={apiKeyModalVisible}
        animationType="slide"
        onRequestClose={handleCloseApiKeyModal}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              onPress={handleCloseApiKeyModal}
              style={styles.backButton}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              API Keys
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ApiKeyManager />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
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
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
});

export default SettingsScreen;
