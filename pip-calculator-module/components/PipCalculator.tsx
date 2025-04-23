import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import CurrencySelector from "./CurrencySelector";
import CurrencyPairSelector from "./CurrencyPairSelector";
import LotSizeSelector from "./LotSizeSelector";
import PipInput from "./PipInput";
import ResultCard from "./ResultCard";
import { MaterialIcons } from "@expo/vector-icons";

// Import constants
import {
  currencies,
  currencyPairs,
  Currency,
  CurrencyPair,
  filterCurrencies,
  filterCurrencyPairs,
} from "../constants/currencies";
import {
  defaultLotSizes,
  LotSize,
  LotType,
  calculateTotalUnits,
} from "../constants/lotSizes";

// Import utilities
import {
  calculatePipValueInQuoteCurrency,
  calculatePipValueInAccountCurrency,
  formatPipValue,
  formatCurrencyValue,
} from "../utils/pipCalculator";
import { fetchExchangeRate } from "../utils/api";
import { ThemeType, getColors, getGradient } from "../utils/theme";

interface PipCalculatorProps {
  theme?: ThemeType;
  onThemeChange?: (theme: ThemeType) => void;
  containerStyle?: any;
}

const PipCalculator: React.FC<PipCalculatorProps> = ({
  theme = "light",
  onThemeChange,
  containerStyle,
}) => {
  const colors = getColors(theme);

  // Currency selection state
  const [accountCurrency, setAccountCurrency] = useState<Currency>(
    currencies[0]
  );
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );

  // Modals state
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [lotSizeEditorVisible, setLotSizeEditorVisible] = useState(false);

  // Lot size state
  const [lotSizes, setLotSizes] =
    useState<Record<string, LotSize>>(defaultLotSizes);
  const [lotType, setLotType] = useState<LotType>("Standard");
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1);

  // Pip input state
  const [pipCount, setPipCount] = useState("10");
  const [pipDecimalPlaces, setPipDecimalPlaces] = useState(4);

  // Results state
  const [pipValueInQuoteCurrency, setPipValueInQuoteCurrency] = useState(0);
  const [pipValueInAccountCurrency, setPipValueInAccountCurrency] = useState(0);
  const [totalValueInQuoteCurrency, setTotalValueInQuoteCurrency] = useState(0);
  const [totalValueInAccountCurrency, setTotalValueInAccountCurrency] =
    useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal search state
  const [currencySearch, setCurrencySearch] = useState("");
  const [pairSearch, setPairSearch] = useState("");

  // Loading state
  const [isCalculating, setIsCalculating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate pip values whenever relevant inputs change
  useEffect(() => {
    calculatePipValues();
  }, [
    selectedPair,
    accountCurrency,
    lotType,
    lotCount,
    customUnits,
    pipCount,
    pipDecimalPlaces,
  ]);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await calculatePipValues(true);
    setRefreshing(false);
  };

  // Calculate pip values
  const calculatePipValues = async (forceRefresh = false) => {
    try {
      setIsCalculating(true);
      setErrorMessage(null);

      // Parse the pip count
      const numericPipCount = parseFloat(pipCount) || 0;

      // Calculate position size based on lot type and count
      const positionSize = calculateTotalUnits(
        lotType,
        lotCount,
        customUnits,
        lotSizes
      );

      // Calculate pip value in quote currency
      const pipValueQuote = calculatePipValueInQuoteCurrency(
        selectedPair,
        positionSize,
        1, // Calculate for a single pip
        pipDecimalPlaces
      );

      // Set single pip value in quote currency
      setPipValueInQuoteCurrency(pipValueQuote);

      // Calculate total value for the number of pips entered
      const totalValueQuote = pipValueQuote * numericPipCount;
      setTotalValueInQuoteCurrency(totalValueQuote);

      // If account currency is different from quote currency, convert
      if (selectedPair.quote !== accountCurrency.code) {
        // Fetch the exchange rate (or use cached if not forcing refresh)
        const rate = forceRefresh
          ? await fetchExchangeRate(selectedPair.quote, accountCurrency.code)
          : exchangeRate ||
            (await fetchExchangeRate(selectedPair.quote, accountCurrency.code));

        setExchangeRate(rate);

        // Calculate pip value in account currency
        const pipValueAccount = calculatePipValueInAccountCurrency(
          pipValueQuote,
          selectedPair.quote,
          accountCurrency.code,
          rate
        );

        // Set single pip value in account currency
        setPipValueInAccountCurrency(pipValueAccount);

        // Calculate total value for the number of pips entered
        const totalValueAccount = pipValueAccount * numericPipCount;
        setTotalValueInAccountCurrency(totalValueAccount);
      } else {
        // If account currency is the same as quote currency
        setExchangeRate(1);
        setPipValueInAccountCurrency(pipValueQuote);
        setTotalValueInAccountCurrency(totalValueQuote);
      }
    } catch (error) {
      console.error("Error calculating pip values:", error);
      setErrorMessage("Failed to calculate pip values. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle account currency selection
  const handleAccountCurrencySelect = (currency: Currency) => {
    setAccountCurrency(currency);
    setCurrencyModalVisible(false);
  };

  // Handle currency pair selection
  const handleCurrencyPairSelect = (pair: CurrencyPair) => {
    setSelectedPair(pair);
    setPipDecimalPlaces(pair.pipDecimalPlaces);
    setPairModalVisible(false);
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
    setLotSizeEditorVisible(false);
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

  // Handle pip decimal places change
  const handlePipDecimalPlacesChange = (places: number) => {
    setPipDecimalPlaces(places);
  };

  // Filter currencies based on search
  const filteredCurrencies = filterCurrencies(currencySearch);

  // Filter currency pairs based on search
  const filteredPairs = filterCurrencyPairs(pairSearch);

  // Render account currency modal
  const renderCurrencyModal = () => (
    <Modal
      visible={currencyModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setCurrencyModalVisible(false)}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: "rgba(0,0,0,0.5)" }]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Account Currency
            </Text>
            <TouchableOpacity
              onPress={() => setCurrencyModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyItem,
                  {
                    backgroundColor:
                      item.code === accountCurrency.code
                        ? colors.primary + "20"
                        : "transparent",
                  },
                ]}
                onPress={() => handleAccountCurrencySelect(item)}
              >
                <Text style={[styles.currencyCode, { color: colors.text }]}>
                  {item.code}
                </Text>
                <Text
                  style={[styles.currencyName, { color: colors.subtext }]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  // Render currency pair modal
  const renderPairModal = () => (
    <Modal
      visible={pairModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setPairModalVisible(false)}
    >
      <View
        style={[styles.modalContainer, { backgroundColor: "rgba(0,0,0,0.5)" }]}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Currency Pair
            </Text>
            <TouchableOpacity
              onPress={() => setPairModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredPairs}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyItem,
                  {
                    backgroundColor:
                      item.name === selectedPair.name
                        ? colors.primary + "20"
                        : "transparent",
                  },
                ]}
                onPress={() => handleCurrencyPairSelect(item)}
              >
                <Text style={[styles.currencyCode, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[styles.currencyName, { color: colors.subtext }]}
                  numberOfLines={1}
                >
                  {item.group}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, containerStyle]}>
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
        {/* Currency Setup Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="monetization-on"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Currency Setup
            </Text>
          </View>

          <CurrencySelector
            label="Account Currency"
            selectedCurrency={accountCurrency}
            onPress={() => setCurrencyModalVisible(true)}
            colors={colors}
          />

          <CurrencyPairSelector
            label="Currency Pair"
            selectedPair={selectedPair}
            onPress={() => setPairModalVisible(true)}
            colors={colors}
          />
        </View>

        {/* Position Size Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="account-balance"
              size={24}
              color={colors.primary}
            />
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
            onEditPress={() => setLotSizeEditorVisible(true)}
            colors={colors}
          />
        </View>

        {/* Pip Input Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="trending-up"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Pip Value
            </Text>
          </View>

          <PipInput
            value={pipCount}
            onChange={handlePipCountChange}
            pipDecimalPlaces={pipDecimalPlaces}
            onPipDecimalPlacesChange={handlePipDecimalPlacesChange}
            colors={colors}
            theme={theme}
          />
        </View>

        {/* Results Section */}
        {isCalculating ? (
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: colors.card + "80" },
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.primary }]}>
              Calculating...
            </Text>
          </View>
        ) : errorMessage ? (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: colors.error + "20" },
            ]}
          >
            <MaterialIcons name="error" size={24} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errorMessage}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <ResultCard
              pipValueInQuoteCurrency={pipValueInQuoteCurrency}
              pipValueInAccountCurrency={pipValueInAccountCurrency}
              totalValueInQuoteCurrency={totalValueInQuoteCurrency}
              totalValueInAccountCurrency={totalValueInAccountCurrency}
              pipCount={pipCount}
              selectedPair={selectedPair}
              accountCurrency={accountCurrency}
              exchangeRate={exchangeRate}
              colors={colors}
              formatPipValue={formatPipValue}
              formatCurrencyValue={formatCurrencyValue}
            />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderCurrencyModal()}
      {renderPairModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
    width: 60,
  },
  currencyName: {
    fontSize: 14,
    flex: 1,
  },
});

export default PipCalculator;
