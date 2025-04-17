import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../config/env";
import { LinearGradient } from "expo-linear-gradient";

interface ApiKeyFormData {
  alphaVantageApiKey: string;
  fixerApiKey: string;
  currencyLayerApiKey: string;
  exchangeRateApiKey: string;
}

// Storage keys
const API_KEY_STORAGE_PREFIX = "forex-pip-calculator-api-key-";

interface ApiKeyManagerProps {
  onClose: () => void;
}

interface ApiKeyConfig {
  name: string;
  key: string;
  storageKey: string;
  inputPlaceholder: string;
  signupUrl: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onClose }) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";

  // API key states - initialize with values from env
  const [traderMadeKey, setTraderMadeKey] = useState(env.traderMadeApiKey);
  const [loading, setLoading] = useState(false);

  // Load stored API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const storedTraderMadeKey = await AsyncStorage.getItem(
          `${API_KEY_STORAGE_PREFIX}trader-made`
        );

        if (storedTraderMadeKey) setTraderMadeKey(storedTraderMadeKey);
      } catch (error) {
        console.error("Error loading API keys", error);
      }
    };

    loadApiKeys();
  }, []);

  // Save API keys
  const saveApiKeys = async () => {
    setLoading(true);
    try {
      // Save API keys to storage
      await AsyncStorage.setItem(
        `${API_KEY_STORAGE_PREFIX}trader-made`,
        traderMadeKey
      );

      // Update environment variables
      await env.updateApiKeys();

      Alert.alert(
        "Success",
        "API keys saved successfully. New keys will be used for future exchange rate requests.",
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Open signup URL
  const openSignupUrl = (url: string) => {
    // Handle opening URL (depends on linking implementation)
    Alert.alert(
      "External Link",
      `Please sign up at: ${url}\n\nAfter registration, you will receive an API key that you can enter here.`
    );
  };

  // API Configuration
  const apiConfigs = [
    {
      name: "TraderMade",
      key: traderMadeKey,
      storageKey: "trader-made",
      inputPlaceholder: "Enter your TraderMade API key",
      signupUrl: "https://tradermade.com/signup",
    },
  ];

  // Handle input change for any API key
  const handleInputChange = (text: string, apiConfig: any) => {
    if (apiConfig.storageKey === "trader-made") {
      setTraderMadeKey(text);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
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
              ? ["rgba(25, 25, 25, 0.95)", "rgba(18, 18, 18, 0.98)"]
              : ["rgba(255, 255, 255, 1)", "rgba(250, 250, 250, 0.95)"]
          }
          style={styles.headerGradient}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.iconButtonbacl}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
              />
            </TouchableOpacity>

            <View style={{ marginLeft: -10 }}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#333333" },
                ]}
              >
                API Keys
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: isDarkMode ? "#AAAAAA" : "#757575" },
                ]}
              >
                Management
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={saveApiKeys}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <MaterialIcons
                  name="save"
                  size={24}
                  color={isDarkMode ? "#6c8cf2" : "#6c8cf2"}
                />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDarkMode
                  ? "rgba(45, 52, 65, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                borderColor: isDarkMode
                  ? colors.border + "30"
                  : "rgba(230, 235, 240, 0.9)",
              },
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
                    name="info-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  API Keys for Currency Data
                </Text>
              </View>

              <Text style={[styles.infoText, { color: colors.subtext }]}>
                For the most accurate and reliable forex data, it's recommended
                to use your own API key from TraderMade. The free tiers of these
                services provide sufficient data for personal use.
              </Text>
              <Text style={[styles.recommText, { color: colors.success }]}>
                TraderMade is now the recommended primary data source.
              </Text>
            </LinearGradient>
          </View>

          {apiConfigs.map((apiConfig) => (
            <View
              key={apiConfig.storageKey}
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(45, 52, 65, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  borderColor: isDarkMode
                    ? colors.border + "30"
                    : "rgba(230, 235, 240, 0.9)",
                },
                apiConfig.storageKey === "trader-made" &&
                  styles.recommendedCard,
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
                      name="vpn-key"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {apiConfig.name}
                  </Text>

                  {apiConfig.storageKey === "trader-made" && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>RECOMMENDED</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => openSignupUrl(apiConfig.signupUrl)}
                  style={[
                    styles.signupButton,
                    { backgroundColor: colors.primary + "15" },
                  ]}
                >
                  <MaterialIcons
                    name="open-in-new"
                    size={18}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.signupButtonText, { color: colors.primary }]}
                  >
                    Sign Up for API Key
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(30, 35, 45, 0.8)"
                        : "rgba(245, 247, 250, 0.8)",
                      color: colors.text,
                      borderColor: colors.border + "40",
                    },
                  ]}
                  placeholder={apiConfig.inputPlaceholder}
                  placeholderTextColor={
                    colors.placeholder || colors.subtext + "80"
                  }
                  value={apiConfig.key}
                  onChangeText={(text) => handleInputChange(text, apiConfig)}
                  secureTextEntry={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 10,
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
  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 22,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    padding: 17,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 4,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  recommendedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  recommendedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  recommendedText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  signupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signupButtonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 15,
  },
});

export default ApiKeyManager;
