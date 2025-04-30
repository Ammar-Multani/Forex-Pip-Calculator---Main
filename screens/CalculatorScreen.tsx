import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  BackHandler,
  ToastAndroid,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import CurrencySelector from "../components/CurrencySelector";
import CurrencyModal from "../components/CurrencyModal";
import CurrencyPairSelector from "../components/CurrencyPairSelector";
import CurrencyPairModal from "../components/CurrencyPairModal";
import LotSizeSelector from "../components/LotSizeSelector";
import LotSizeEditorModal from "../components/LotSizeEditorModal";
import PipInput from "../components/PipInput";
import ResultCard from "../components/ResultCard";
import CalculatorModal from "../components/CalculatorModal";
import InfoModal from "../components/InfoModal";
import {
  currencies,
  currencyPairs,
  Currency,
  CurrencyPair,
} from "../constants/currencies";
import {
  defaultLotSizes,
  LotSize,
  LotType,
  calculateTotalUnits,
} from "../constants/lotSizes";
import {
  calculatePipValueInQuoteCurrency,
  calculatePipValueInAccountCurrency,
} from "../utils/pipCalculator";
import { fetchExchangeRate } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Storage keys
const ACCOUNT_CURRENCY_KEY = "forex-pip-calculator-account-currency";
const CURRENCY_PAIR_KEY = "forex-pip-calculator-currency-pair";
const LOT_SIZES_KEY = "forex-pip-calculator-lot-sizes";
const LOT_TYPE_KEY = "forex-pip-calculator-lot-type";
const LOT_COUNT_KEY = "forex-pip-calculator-lot-count";
const CUSTOM_UNITS_KEY = "forex-pip-calculator-custom-units";
const PIP_COUNT_KEY = "forex-pip-calculator-pip-count";
const PIP_DECIMAL_PLACES_KEY = "forex-pip-calculator-pip-decimal-places";

// Info modal content
const INFO_CONTENT = {
  currencySetup: {
    title: "Currency Setup",
    content:
      "The Currency Setup section allows you to configure the base parameters for your pip value calculations:\n\n" +
      "• Account Currency: The currency in which your trading account is denominated. All pip values will be converted to this currency.\n\n" +
      "• Currency Pair: The forex pair you are trading. A currency pair consists of a base currency (first) and a quote currency (second). For example, in EUR/USD, EUR is the base currency and USD is the quote currency.\n\n" +
      "These settings determine how pip values are calculated and how currency conversions are applied.",
  },
  positionSize: {
    title: "Position Size",
    content:
      "The Position Size section determines the volume of your forex trade:\n\n" +
      "• Standard Lot: 100,000 units of the base currency\n" +
      "• Mini Lot: 10,000 units of the base currency\n" +
      "• Micro Lot: 1,000 units of the base currency\n" +
      "• Nano Lot: 100 units of the base currency\n" +
      "• Custom Units: Set a specific number of currency units\n\n" +
      "Your position size directly impacts your pip value. Larger positions mean each pip is worth more money, while smaller positions reduce the value of each pip.\n\n" +
      "You can edit the lot sizes by tapping the edit button if your broker uses different lot size definitions.",
  },
  pipValue: {
    title: "Pip Value",
    content:
      "The Pip Value section lets you specify how many pips you want to calculate the value for:\n\n" +
      "• Pip Count: The number of pips you want to calculate the value for. You can enter this directly or use the calculator button.\n\n" +
      "• Pip Decimal Places: Determines the precision of a pip for the selected currency pair. Most currency pairs use 4 decimal places (0.0001 = 1 pip), while JPY pairs typically use 2 decimal places (0.01 = 1 pip).\n\n" +
      "The pip value is calculated based on your currency pair, position size, and the current exchange rates.",
  },
  results: {
    title: "Understanding Results",
    content:
      "The Results section shows the detailed calculation of pip values based on your inputs:\n\n" +
      "• Total Value: The main result showing the total value of your specified pips in your account currency.\n\n" +
      "• Per Pip Value: Shows how much each pip is worth in both your account currency and the quote currency of the pair.\n\n" +
      "• Exchange Rate: Displays the current exchange rate used for converting between currencies.\n\n" +
      "• Pip Values by Lot Size: A reference table showing pip values for standard lot sizes (Standard, Mini, Micro, and Nano).\n\n" +
      "• Save Options: You can save your calculation to history for future reference or export it as a PDF document.\n\n" +
      "All calculations are performed using real-time exchange rates when available.",
  },
};

const CalculatorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, theme, toggleTheme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";

  // Add back handler tracking
  const backPressedTimeRef = useRef<number | null>(null);

  // State for currency selection
  const [accountCurrency, setAccountCurrency] = useState<Currency>(
    currencies[0]
  );
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );

  // State for modals
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [lotSizeEditorVisible, setLotSizeEditorVisible] = useState(false);
  const [pipCalculatorVisible, setPipCalculatorVisible] = useState(false);

  // State for info modals
  const [infoModalType, setInfoModalType] = useState<
    "currencySetup" | "positionSize" | "pipValue" | "results" | null
  >(null);

  // State for lot size
  const [lotSizes, setLotSizes] =
    useState<Record<string, LotSize>>(defaultLotSizes);
  const [lotType, setLotType] = useState<LotType>("Standard");
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1);

  // State for pip input
  const [pipCount, setPipCount] = useState("10");
  const [pipDecimalPlaces, setPipDecimalPlaces] = useState(4);

  // State for calculation results and errors
  const [pipValueInQuoteCurrency, setPipValueInQuoteCurrency] = useState(0);
  const [pipValueInAccountCurrency, setPipValueInAccountCurrency] = useState(0);
  const [totalValueInQuoteCurrency, setTotalValueInQuoteCurrency] = useState(0);
  const [totalValueInAccountCurrency, setTotalValueInAccountCurrency] =
    useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for refresh control
  const [refreshing, setRefreshing] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load account currency
        const savedAccountCurrency = await AsyncStorage.getItem(
          ACCOUNT_CURRENCY_KEY
        );
        if (savedAccountCurrency) {
          const parsedCurrency = JSON.parse(savedAccountCurrency);
          setAccountCurrency(parsedCurrency);
        }

        // Load currency pair
        const savedCurrencyPair = await AsyncStorage.getItem(CURRENCY_PAIR_KEY);
        if (savedCurrencyPair) {
          const parsedPair = JSON.parse(savedCurrencyPair);
          setSelectedPair(parsedPair);
        }

        // Load lot sizes
        const savedLotSizes = await AsyncStorage.getItem(LOT_SIZES_KEY);
        if (savedLotSizes) {
          const parsedLotSizes = JSON.parse(savedLotSizes);
          setLotSizes(parsedLotSizes);
        }

        // Load lot type
        const savedLotType = await AsyncStorage.getItem(LOT_TYPE_KEY);
        if (savedLotType) {
          setLotType(savedLotType as LotType);
        }

        // Load lot count
        const savedLotCount = await AsyncStorage.getItem(LOT_COUNT_KEY);
        if (savedLotCount) {
          setLotCount(parseInt(savedLotCount));
        }

        // Load custom units
        const savedCustomUnits = await AsyncStorage.getItem(CUSTOM_UNITS_KEY);
        if (savedCustomUnits) {
          setCustomUnits(parseInt(savedCustomUnits));
        }

        // Load pip count
        const savedPipCount = await AsyncStorage.getItem(PIP_COUNT_KEY);
        if (savedPipCount) {
          setPipCount(savedPipCount);
        }

        // Load pip decimal places
        const savedPipDecimalPlaces = await AsyncStorage.getItem(
          PIP_DECIMAL_PLACES_KEY
        );
        if (savedPipDecimalPlaces) {
          setPipDecimalPlaces(parseInt(savedPipDecimalPlaces));
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(
          ACCOUNT_CURRENCY_KEY,
          JSON.stringify(accountCurrency)
        );

        await AsyncStorage.setItem(
          CURRENCY_PAIR_KEY,
          JSON.stringify(selectedPair)
        );

        await AsyncStorage.setItem(LOT_SIZES_KEY, JSON.stringify(lotSizes));

        await AsyncStorage.setItem(LOT_TYPE_KEY, lotType);

        await AsyncStorage.setItem(LOT_COUNT_KEY, lotCount.toString());

        await AsyncStorage.setItem(CUSTOM_UNITS_KEY, customUnits.toString());

        await AsyncStorage.setItem(PIP_COUNT_KEY, pipCount);

        await AsyncStorage.setItem(
          PIP_DECIMAL_PLACES_KEY,
          pipDecimalPlaces.toString()
        );
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    };

    savePreferences();
  }, [
    accountCurrency,
    selectedPair,
    lotSizes,
    lotType,
    lotCount,
    customUnits,
    pipCount,
    pipDecimalPlaces,
  ]);

  // Calculate pip values when inputs change
  useEffect(() => {
    calculatePipValues();
  }, [
    accountCurrency,
    selectedPair,
    lotType,
    lotCount,
    customUnits,
    pipCount,
    pipDecimalPlaces,
  ]);

  // Calculate pip values
  const calculatePipValues = async () => {
    try {
      // Reset error message
      setErrorMessage(null);

      // Get position size
      const positionSize = calculateTotalUnits(
        lotType,
        lotCount,
        customUnits,
        lotSizes
      );

      // Get pip count as number
      const pipCountNum = parseFloat(pipCount) || 0;

      // Calculate pip value in quote currency with the selected decimal place
      const pipValueQuote = calculatePipValueInQuoteCurrency(
        selectedPair,
        positionSize,
        pipCountNum,
        pipDecimalPlaces
      );
      setPipValueInQuoteCurrency(pipValueQuote);

      try {
        // Get exchange rate between quote currency and account currency
        // Professional trading platforms use this direct approach

        // If quote currency is the same as account currency
        if (selectedPair.quote === accountCurrency.code) {
          const rate = 1;
          setExchangeRate(rate);

          const pipValueAccount = calculatePipValueInAccountCurrency(
            pipValueQuote,
            selectedPair.quote,
            accountCurrency.code,
            rate
          );
          setPipValueInAccountCurrency(pipValueAccount);
          setTotalValueInQuoteCurrency(pipValueQuote * pipCountNum);
          setTotalValueInAccountCurrency(pipValueAccount * pipCountNum);
        }
        // For all other cases, get direct rate from quote to account currency
        else {
          // Get direct exchange rate from quote currency to account currency
          // This matches professional trading platforms' calculation logic
          const rate = await fetchExchangeRate(
            selectedPair.quote,
            accountCurrency.code
          );
          setExchangeRate(rate);

          const pipValueAccount = calculatePipValueInAccountCurrency(
            pipValueQuote,
            selectedPair.quote,
            accountCurrency.code,
            rate
          );
          setPipValueInAccountCurrency(pipValueAccount);
          setTotalValueInQuoteCurrency(pipValueQuote * pipCountNum);
          setTotalValueInAccountCurrency(pipValueAccount * pipCountNum);
        }
      } catch (error) {
        // Handle specific API errors
        if (error instanceof Error) {
          setErrorMessage(error.message);

          // If no internet, show alert
          if (error.message.includes("No internet connection")) {
            Alert.alert(
              "No Internet Connection",
              "Trading requires real-time exchange rates. Please connect to the internet."
            );
          } else if (
            error.message.includes("All forex data sources unavailable")
          ) {
            Alert.alert(
              "Exchange Rate Unavailable",
              "Unable to fetch accurate exchange rates at this time. Please try again later."
            );
          }
        } else {
          setErrorMessage(
            "Failed to fetch exchange rates. Please try again later."
          );
        }

        // Don't use cached rates for trading app - require fresh data
        throw new Error("Real-time rates required for accurate calculations");
      }
    } catch (error) {
      console.error("Error calculating pip values:", error);

      if (!errorMessage) {
        setErrorMessage(
          "Unable to perform calculation with real-time rates. Please try again."
        );
      }
    }
  };

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await calculatePipValues();
    setRefreshing(false);
  }, [
    accountCurrency,
    selectedPair,
    lotType,
    lotCount,
    customUnits,
    pipCount,
    pipDecimalPlaces,
  ]);

  // Handle account currency selection
  const handleAccountCurrencySelect = (currency: Currency) => {
    setAccountCurrency(currency);
  };

  // Handle currency pair selection
  const handleCurrencyPairSelect = (pair: CurrencyPair) => {
    setSelectedPair(pair);
  };

  // Handle lot type change
  const handleLotTypeChange = (type: LotType) => {
    setLotType(type);
  };

  // Handle lot count change
  const handleLotCountChange = (count: number) => {
    setLotCount(count);
  };

  // Handle custom units change
  const handleCustomUnitsChange = (units: number) => {
    setCustomUnits(units);
  };

  // Handle lot sizes save
  const handleLotSizesSave = (newLotSizes: Record<string, LotSize>) => {
    setLotSizes(newLotSizes);
  };

  // Handle pip count change
  const handlePipCountChange = (text: string) => {
    // Allow only numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = filtered.split(".");
    if (parts.length > 2) {
      return;
    }

    setPipCount(filtered);
  };

  // Handle pip value from calculator
  const handlePipValueFromCalculator = (value: number) => {
    setPipCount(value.toString());
    setPipCalculatorVisible(false);
  };

  // Handle pip decimal places change
  const handlePipDecimalPlacesChange = (places: number) => {
    setPipDecimalPlaces(places);
  };

  // Custom header with history button
  const renderHeader = () => {
    return (
      <Header
        title=""
        onThemeToggle={toggleTheme}
        rightComponent={
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("History")}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.historyButtonInner}>
              <MaterialIcons name="history" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        }
        leftComponent={
          <View style={styles.logoContainer}>
            <View style={styles.logoImageContainer}>
              <Image
                source={
                  isDarkMode
                    ? require("../assets/adaptive-icon-dark.png")
                    : require("../assets/adaptive-icon-light.png")
                }
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        }
      />
    );
  };

  // Handle showing the info modal
  const showInfoModal = (
    type: "currencySetup" | "positionSize" | "pipValue" | "results"
  ) => {
    setInfoModalType(type);
  };

  // Render card header with info button
  const renderCardHeader = (
    icon: React.ComponentProps<typeof MaterialIcons>["name"],
    title: string,
    infoType: "currencySetup" | "positionSize" | "pipValue" | "results"
  ) => (
    <View style={styles.cardHeaderRow}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.primary + "20" },
        ]}
      >
        <MaterialIcons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity
        style={[styles.infoButton, { backgroundColor: colors.primary + "20" }]}
        onPress={() => showInfoModal(infoType)}
      >
        <MaterialIcons name="info-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  // Replace existing back handler effect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      // Handler for back press
      const handleBackPress = () => {
        const now = Date.now();

        // First back press or more than 2 seconds since last press
        if (
          backPressedTimeRef.current === null ||
          now - backPressedTimeRef.current > 2000
        ) {
          backPressedTimeRef.current = now;

          // Show toast on Android or alert on iOS
          if (Platform.OS === "android") {
            ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
          } else {
            Alert.alert(
              "Exit App",
              "Press back again to exit the app",
              [{ text: "OK" }],
              { cancelable: true }
            );
          }
          return true; // Prevent default behavior
        }

        // Second back press within 2 seconds - exit directly without confirmation
        BackHandler.exitApp();
        return true;
      };

      // Add back press handler when screen comes into focus
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      // Remove back press handler when screen loses focus
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {/* Currency Setup Card */}
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
              {renderCardHeader(
                "monetization-on",
                "Currency Setup",
                "currencySetup"
              )}
              <CurrencySelector
                label="Account Currency"
                selectedCurrency={accountCurrency}
                onPress={() => setCurrencyModalVisible(true)}
              />

              <CurrencyPairSelector
                label="Currency Pair"
                selectedPair={selectedPair}
                onPress={() => setPairModalVisible(true)}
                exchangeRate={exchangeRate}
              />
            </LinearGradient>
          </View>

          {/* Position Size Card */}
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
              {renderCardHeader(
                "account-balance",
                "Position Size",
                "positionSize"
              )}
              <LotSizeSelector
                label="Position Size"
                lotType={lotType}
                lotCount={lotCount}
                customUnits={customUnits}
                lotSizes={lotSizes}
                onLotTypeChange={handleLotTypeChange}
                onLotCountChange={handleLotCountChange}
                onCustomUnitsChange={handleCustomUnitsChange}
                onEditPress={() => setLotSizeEditorVisible(true)}
              />
            </LinearGradient>
          </View>

          {/* Pip Input Card */}
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
              {renderCardHeader("trending-up", "Pip Value", "pipValue")}
              <PipInput
                value={pipCount}
                onChange={handlePipCountChange}
                onCalculatorPress={() => setPipCalculatorVisible(true)}
                pipDecimalPlaces={pipDecimalPlaces}
                onPipDecimalPlacesChange={handlePipDecimalPlacesChange}
              />
            </LinearGradient>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(220, 53, 69, 0.12)"
                    : "rgba(255, 235, 238, 0.9)",
                  borderColor: colors.error + "40",
                  borderWidth: 1,
                  borderRadius: 16,
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.error + "30",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                    },
                    android: {
                      elevation: 2,
                    },
                  }),
                },
              ]}
            >
              <View style={styles.errorIconContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={colors.error}
                />
              </View>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Results */}
          <View style={[styles.resultContainer]}>
            <ResultCard
              accountCurrency={accountCurrency}
              currencyPair={selectedPair}
              pipValueInQuoteCurrency={pipValueInQuoteCurrency}
              pipValueInAccountCurrency={pipValueInAccountCurrency}
              totalValueInQuoteCurrency={totalValueInQuoteCurrency}
              totalValueInAccountCurrency={totalValueInAccountCurrency}
              exchangeRate={exchangeRate}
              pipCount={parseFloat(pipCount) || 0}
              onRefresh={onRefresh}
              isRefreshing={refreshing}
              lotType={lotType}
              lotCount={lotCount}
              positionSize={calculateTotalUnits(
                lotType,
                lotCount,
                customUnits,
                lotSizes
              )}
              pipDecimalPlaces={pipDecimalPlaces}
              onHistorySaved={() => {
                // Display toast or subtle notification
                // You could add a visual feedback here if desired
              }}
              onInfoPress={() => showInfoModal("results")}
            />
          </View>

          {/* Disclaimer Footer */}
          <View style={styles.disclaimerContainer}>
            <Text style={[styles.disclaimerText, { color: colors.subtext }]}>
              DISCLAIMER: The exchange rates provided herein are obtained from
              third-party sources and are presented solely for informational
              purposes. These rates may not reflect the exact spreads, markups,
              or price fluctuations offered by your financial institution or
              broker. Users should independently verify all rates before
              executing any financial transactions. Trading foreign exchange
              carries significant risk and may not be suitable for all
              investors. Past performance does not guarantee future results.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={currencyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <CurrencyModal
          onClose={() => setCurrencyModalVisible(false)}
          onSelect={handleAccountCurrencySelect}
          selectedCurrency={accountCurrency}
        />
      </Modal>

      <Modal
        visible={pairModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPairModalVisible(false)}
      >
        <CurrencyPairModal
          onClose={() => setPairModalVisible(false)}
          onSelect={handleCurrencyPairSelect}
          selectedPair={selectedPair}
        />
      </Modal>

      <Modal
        visible={lotSizeEditorVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLotSizeEditorVisible(false)}
      >
        <LotSizeEditorModal
          lotSizes={lotSizes}
          onSave={handleLotSizesSave}
          onClose={() => setLotSizeEditorVisible(false)}
        />
      </Modal>

      {/* Calculator Modal for Pip Value */}
      <Modal
        visible={pipCalculatorVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setPipCalculatorVisible(false)}
      >
        <CalculatorModal
          onClose={() => setPipCalculatorVisible(false)}
          onSubmit={handlePipValueFromCalculator}
          initialValue={pipCount}
        />
      </Modal>

      {/* Info Modal */}
      {infoModalType && (
        <InfoModal
          isVisible={infoModalType !== null}
          onClose={() => setInfoModalType(null)}
          title={INFO_CONTENT[infoModalType].title}
          content={INFO_CONTENT[infoModalType].content}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 25,
    paddingTop: 10,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  errorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(220, 53, 69, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  infoBannerText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
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
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  resultContainer: {
    marginBottom: 24,
    marginTop: 10,
  },
  historyButton: {
    height: 40,
    width: 38,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  },
  historyButtonInner: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  disclaimerContainer: {
    padding: 16,
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 200, 200, 0.2)",
  },
  disclaimerText: {
    fontSize: 11,
    textAlign: "justify",
    lineHeight: 16,
    letterSpacing: 0.25,
    fontStyle: "italic",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  logoImageContainer: {
    width: 98,
    height: 58,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 192,
    height: 192,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
});

export default CalculatorScreen;
