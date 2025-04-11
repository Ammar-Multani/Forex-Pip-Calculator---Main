import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import Header from "../components/Header";
import CurrencySelector from "../components/CurrencySelector";
import CurrencyModal from "../components/CurrencyModal";
import CurrencyPairSelector from "../components/CurrencyPairSelector";
import CurrencyPairModal from "../components/CurrencyPairModal";
import LotSizeSelector from "../components/LotSizeSelector";
import LotSizeEditorModal from "../components/LotSizeEditorModal";
import PipInput from "../components/PipInput";
import ResultCard from "../components/ResultCard";
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

// Storage keys
const ACCOUNT_CURRENCY_KEY = "forex-pip-calculator-account-currency";
const CURRENCY_PAIR_KEY = "forex-pip-calculator-currency-pair";
const LOT_SIZES_KEY = "forex-pip-calculator-lot-sizes";
const LOT_TYPE_KEY = "forex-pip-calculator-lot-type";
const LOT_COUNT_KEY = "forex-pip-calculator-lot-count";
const CUSTOM_UNITS_KEY = "forex-pip-calculator-custom-units";
const PIP_COUNT_KEY = "forex-pip-calculator-pip-count";

const CalculatorScreen: React.FC = () => {
  const { colors, toggleTheme } = useTheme();

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

  // State for lot size
  const [lotSizes, setLotSizes] =
    useState<Record<string, LotSize>>(defaultLotSizes);
  const [lotType, setLotType] = useState<LotType>("Standard");
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1);

  // State for pip input
  const [pipCount, setPipCount] = useState("10");

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
  ]);

  // Calculate pip values when inputs change
  useEffect(() => {
    calculatePipValues();
  }, [accountCurrency, selectedPair, lotType, lotCount, customUnits, pipCount]);

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

      // Calculate pip value in quote currency
      const pipValueQuote = calculatePipValueInQuoteCurrency(
        selectedPair,
        positionSize,
        pipCountNum
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
  }, [accountCurrency, selectedPair, lotType, lotCount, customUnits, pipCount]);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />
      <Header title="Forex Pip Calculator" onThemeToggle={toggleTheme} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
            {/* TraderMade API Info Banner */}
            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: colors.success + "20",
                  borderColor: colors.success,
                },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.success}
              />
              <Text style={[styles.infoBannerText, { color: colors.text }]}>
                Using TraderMade API for professional-grade forex data
              </Text>
            </View>

            <CurrencySelector
              label="Account Currency"
              selectedCurrency={accountCurrency}
              onPress={() => setCurrencyModalVisible(true)}
            />

            <CurrencyPairSelector
              label="Currency Pair"
              selectedPair={selectedPair}
              onPress={() => setPairModalVisible(true)}
            />

            <LotSizeSelector
              label="Position Size"
              lotType={lotType}
              lotCount={lotCount}
              customUnits={customUnits}
              lotSizes={lotSizes}
              onLotTypeChange={handleLotTypeChange}
              onLotCountChange={handleLotCountChange}
              onCustomUnitsChange={handleCustomUnitsChange}
              onEditLotSizes={() => setLotSizeEditorVisible(true)}
            />

            <PipInput
              label="Number of Pips"
              value={pipCount}
              onChangeText={handlePipCountChange}
              currencyPair={selectedPair}
            />

            <TouchableOpacity
              style={[
                styles.calculateButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={calculatePipValues}
            >
              <MaterialIcons name="calculate" size={20} color="#fff" />
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>

            <ResultCard
              accountCurrency={accountCurrency}
              currencyPair={selectedPair}
              pipValueInQuoteCurrency={pipValueInQuoteCurrency}
              pipValueInAccountCurrency={pipValueInAccountCurrency}
              totalValueInQuoteCurrency={totalValueInQuoteCurrency}
              totalValueInAccountCurrency={totalValueInAccountCurrency}
              exchangeRate={exchangeRate}
              pipCount={parseFloat(pipCount) || 0}
            />

            {errorMessage && (
              <View style={styles.errorContainer}>
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={colors.error}
                />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errorMessage}
                </Text>
              </View>
            )}

            <View style={styles.infoContainer}>
              <MaterialIcons
                name="info-outline"
                size={20}
                color={colors.info}
              />
              <Text style={[styles.infoText, { color: colors.subtext }]}>
                Pull down to refresh exchange rates. Values are calculated based
                on the current position size and pip count. Real-time rates
                require internet connection.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <CurrencyModal
        isVisible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        onSelectCurrency={handleAccountCurrencySelect}
        selectedCurrency={accountCurrency}
        currencies={currencies}
      />

      <CurrencyPairModal
        isVisible={pairModalVisible}
        onClose={() => setPairModalVisible(false)}
        onSelectPair={handleCurrencyPairSelect}
        selectedPair={selectedPair}
        currencyPairs={currencyPairs}
      />

      <LotSizeEditorModal
        isVisible={lotSizeEditorVisible}
        onClose={() => setLotSizeEditorVisible(false)}
        lotSizes={lotSizes}
        onSave={handleLotSizesSave}
      />
    </SafeAreaView>
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
  },
  content: {
    padding: 16,
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
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
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  infoBannerText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
});

export default CalculatorScreen;
