import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const API_KEY_STORAGE_PREFIX = "forex-pip-calculator-api-key-";

interface EnvConfig {
  traderMadeApiKey: string;
  apiPriority: string[];
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  updateApiKeys: () => Promise<void>;
}

// Get the native config from Expo Constants
const nativeConfig = Constants.expoConfig?.extra || {};

// Use environment variable from .env file (with EXPO_PUBLIC_ prefix) instead of hardcoded key
let traderMadeApiKey = process.env.EXPO_PUBLIC_TRADER_MADE_API_KEY || "";

// API Priority - only using TraderMade
const apiPriority = ["trader_made"];

// Environment
const nodeEnv = nativeConfig.NODE_ENV || "development";
const isDevelopment = nodeEnv === "development";
const isProduction = nodeEnv === "production";

// Load API keys from storage
const updateApiKeys = async (): Promise<void> => {
  try {
    // Try to load TraderMade API key from local storage
    const storedTraderMadeApiKey = await AsyncStorage.getItem(
      `${API_KEY_STORAGE_PREFIX}trader-made`
    );

    // Update env variable if key is found in storage
    if (storedTraderMadeApiKey) {
      traderMadeApiKey = storedTraderMadeApiKey;
    }

    console.log(
      "API key loaded from storage:",
      traderMadeApiKey
        ? "TraderMade key loaded"
        : "Using default TraderMade key"
    );
  } catch (error) {
    console.error("Error loading API key from storage:", error);
  }
};

// Initialize with stored API keys (will run when the app starts)
updateApiKeys().catch(console.error);

// Export the combined config
const env: EnvConfig = {
  traderMadeApiKey,
  apiPriority,
  nodeEnv,
  isDevelopment,
  isProduction,
  updateApiKeys,
};

export default env;
