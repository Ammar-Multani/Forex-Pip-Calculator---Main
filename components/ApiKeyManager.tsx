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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../config/env";

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
  const { colors } = useTheme();

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
    }
  ];

  // Handle input change for any API key
  const handleInputChange = (text: string, apiConfig: any) => {
    if (apiConfig.storageKey === "trader-made") {
      setTraderMadeKey(text);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Manage API Keys
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveApiKeys}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons name="save" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            API Keys for Currency Data
          </Text>
          <Text style={[styles.infoText, { color: colors.subtext }]}>
            For the most accurate and reliable forex data, it's recommended to
            use your own API key from TraderMade. The free tiers of these
            services provide sufficient data for personal use.
            Backup api key: wsWt3A-afcjtbpTzs5hw
          </Text>
          <Text style={[styles.recommText, { color: colors.success }]}>
            TraderMade is now the recommended primary data source.
          </Text>
        </View>

        {apiConfigs.map((apiConfig) => (
          <View
            key={apiConfig.storageKey}
            style={[
              styles.apiKeyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              apiConfig.storageKey === "trader-made" && styles.recommendedCard,
            ]}
          >
            <View style={styles.apiKeyHeader}>
              <Text style={[styles.apiKeyName, { color: colors.text }]}>
                {apiConfig.name}
              </Text>
              {apiConfig.storageKey === "trader-made" && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => openSignupUrl(apiConfig.signupUrl)}
                style={styles.signupButton}
              >
                <Text
                  style={[styles.signupButtonText, { color: colors.primary }]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder={apiConfig.inputPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={apiConfig.key}
              onChangeText={(text) => handleInputChange(text, apiConfig)}
              secureTextEntry={false}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  recommText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  apiKeyCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  apiKeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  apiKeyName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  recommendedBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  recommendedText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  signupButton: {
    padding: 8,
  },
  signupButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
  },
});

export default ApiKeyManager;
