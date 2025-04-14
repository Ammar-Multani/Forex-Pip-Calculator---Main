import React, { useState, useEffect, useCallback, useNavigation } from "react";
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
  StatusBar,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
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
import { LinearGradient } from "expo-linear-gradient";

const CalculatorScreen: React.FC = () => {
  const { colors, toggleTheme, getGradient } = useTheme();
  const navigation = useNavigation();

  const isDarkMode = theme === "dark";

  const [accountCurrency, setAccountCurrency] = useState<Currency>(
    currencies[0]
  );
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [lotSizeEditorVisible, setLotSizeEditorVisible] = useState(false);

  const [lotSizes, setLotSizes] =
    useState<Record<string, LotSize>>(defaultLotSizes);
  const [lotType, setLotType] = useState<LotType>("Standard");
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1);

  const [pipCount, setPipCount] = useState("10");

  const [pipValueInQuoteCurrency, setPipValueInQuoteCurrency] = useState(0);
  const [pipValueInAccountCurrency, setPipValueInAccountCurrency] = useState(0);
  const [totalValueInQuoteCurrency, setTotalValueInQuoteCurrency] = useState(0);
  const [totalValueInAccountCurrency, setTotalValueInAccountCurrency] =
    useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedAccountCurrency = await AsyncStorage.getItem(
          ACCOUNT_CURRENCY_KEY
        );
        if (savedAccountCurrency) {
          const parsedCurrency = JSON.parse(savedAccountCurrency);
          setAccountCurrency(parsedCurrency);
        }

        const savedCurrencyPair = await AsyncStorage.getItem(CURRENCY_PAIR_KEY);
        if (savedCurrencyPair) {
          const parsedPair = JSON.parse(savedCurrencyPair);
          setSelectedPair(parsedPair);
        }

        const savedLotSizes = await AsyncStorage.getItem(LOT_SIZES_KEY);
        if (savedLotSizes) {
          const parsedLotSizes = JSON.parse(savedLotSizes);
          setLotSizes(parsedLotSizes);
        }

        const savedLotType = await AsyncStorage.getItem(LOT_TYPE_KEY);
        if (savedLotType) {
          setLotType(savedLotType as LotType);
        }

        const savedLotCount = await AsyncStorage.getItem(LOT_COUNT_KEY);
        if (savedLotCount) {
          setLotCount(parseInt(savedLotCount));
        }

        const savedCustomUnits = await AsyncStorage.getItem(CUSTOM_UNITS_KEY);
        if (savedCustomUnits) {
          setCustomUnits(parseInt(savedCustomUnits));
        }

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

  useEffect(() => {
    calculatePipValues();
  }, [accountCurrency, selectedPair, lotType, lotCount, customUnits, pipCount]);

  const calculatePipValues = async () => {
    try {
      setErrorMessage(null);

      const positionSize = calculateTotalUnits(
        lotType,
        lotCount,
        customUnits,
        lotSizes
      );

      const pipCountNum = parseFloat(pipCount) || 0;

      const pipValueQuote = calculatePipValueInQuoteCurrency(
        selectedPair,
        positionSize,
        pipCountNum
      );
      setPipValueInQuoteCurrency(pipValueQuote);

      try {
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
        } else {
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
        if (error instanceof Error) {
          setErrorMessage(error.message);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await calculatePipValues();
    setRefreshing(false);
  }, [accountCurrency, selectedPair, lotType, lotCount, customUnits, pipCount]);

  const handleAccountCurrencySelect = (currency: Currency) => {
    setAccountCurrency(currency);
  };

  const handleCurrencyPairSelect = (pair: CurrencyPair) => {
    setSelectedPair(pair);
  };

  const handleLotTypeChange = (type: LotType) => {
    setLotType(type);
  };

  const handleLotCountChange = (count: number) => {
    setLotCount(count);
  };

  const handleCustomUnitsChange = (units: number) => {
    setCustomUnits(units);
  };

  const handleLotSizesSave = (newLotSizes: Record<string, LotSize>) => {
    setLotSizes(newLotSizes);
  };

  const handlePipCountChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, "");
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

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
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
                      name="monetization-on"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Currency Setup
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
              </LinearGradient>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
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
                      name="account-balance"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Position Size
                  </Text>
                </View>
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
              </LinearGradient>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
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
                      name="trending-up"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Pip Value
                  </Text>
                </View>
                <PipInput
                  label="Number of Pips"
                  value={pipCount}
                  onChangeText={handlePipCountChange}
                  currencyPair={selectedPair}
                />
              </LinearGradient>
            </View>

            <TouchableOpacity
              style={styles.calculateButtonWrapper}
              onPress={calculatePipValues}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={getGradient("primary").colors}
                start={getGradient("primary").start}
                end={getGradient("primary").end}
                style={styles.calculateButton}
              >
                <MaterialIcons name="calculate" size={20} color="#fff" />
                <Text style={styles.calculateButtonText}>Calculate</Text>
              </LinearGradient>
            </TouchableOpacity>

            {errorMessage && (
              <View
                style={[
                  styles.errorContainer,
                  {
                    backgroundColor: colors.error + "15",
                    borderLeftColor: colors.error,
                    borderLeftWidth: 4,
                  },
                ]}
              >
                <MaterialIcons
                  name="error-outline"
                  size={24}
                  color={colors.error}
                />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errorMessage}
                </Text>
              </View>
            )}

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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.infoButtonWrapper}
                onPress={() => navigation.navigate("Info" as never)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={getGradient("secondary").colors}
                  start={getGradient("secondary").start}
                  end={getGradient("secondary").end}
                  style={styles.infoButton}
                >
                  <MaterialIcons name="help-outline" size={20} color="#fff" />
                  <Text style={styles.infoButtonText}>Learn About Pips</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.settingsButtonWrapper}
                onPress={() => navigation.navigate("Settings" as never)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={getGradient("info").colors}
                  start={getGradient("info").start}
                  end={getGradient("info").end}
                  style={styles.settingsButton}
                >
                  <MaterialIcons name="settings" size={20} color="#fff" />
                  <Text style={styles.infoButtonText}>Settings</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    paddingBottom: 30,
  },
  content: {
    padding: 16,
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
  calculateButtonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoButtonWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 16,
  },
  settingsButtonWrapper: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 16,
  },
  infoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default CalculatorScreen;
