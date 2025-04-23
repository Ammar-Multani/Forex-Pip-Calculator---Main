import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CurrencyPair } from "../constants/currencies";

interface OnboardingContextType {
  isOnboardingComplete: boolean;
  selectedCurrencyPair: CurrencyPair | null;
  notificationsEnabled: boolean;
  completeOnboarding: () => Promise<void>;
  setSelectedCurrencyPair: (pair: CurrencyPair) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [selectedCurrencyPair, setSelectedCurrencyPairState] =
    useState<CurrencyPair | null>(null);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [onboardingStatus, savedPair, notificationStatus] =
          await Promise.all([
            AsyncStorage.getItem("onboarding_complete"),
            AsyncStorage.getItem("selected_currency_pair"),
            AsyncStorage.getItem("notifications_enabled"),
          ]);

        setIsOnboardingComplete(onboardingStatus === "true");
        if (savedPair) {
          setSelectedCurrencyPairState(JSON.parse(savedPair));
        }
        setNotificationsEnabledState(notificationStatus === "true");
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("onboarding_complete", "true");
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const setSelectedCurrencyPair = async (pair: CurrencyPair) => {
    try {
      await AsyncStorage.setItem(
        "selected_currency_pair",
        JSON.stringify(pair)
      );
      setSelectedCurrencyPairState(pair);
    } catch (error) {
      console.error("Error saving selected currency pair:", error);
    }
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem("notifications_enabled", String(enabled));
      setNotificationsEnabledState(enabled);
    } catch (error) {
      console.error("Error saving notification status:", error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        selectedCurrencyPair,
        notificationsEnabled,
        completeOnboarding,
        setSelectedCurrencyPair,
        setNotificationsEnabled,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContext;
