import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Currency, CurrencyPair } from "../constants/currencies";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { calculatePipValueInQuoteCurrency } from "../utils/pipCalculator";

interface ResultCardProps {
  accountCurrency: Currency;
  currencyPair: CurrencyPair;
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  exchangeRate: number;
  pipCount: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  accountCurrency,
  currencyPair,
  pipValueInQuoteCurrency,
  pipValueInAccountCurrency,
  totalValueInQuoteCurrency,
  totalValueInAccountCurrency,
  exchangeRate,
  pipCount,
}) => {
  const { colors, getGradient } = useTheme();

  // Get quote currency details
  const quoteCurrencyCode = currencyPair.quote;
  const quoteCurrencySymbol =
    quoteCurrencyCode === "JPY"
      ? "¥"
      : quoteCurrencyCode === "USD"
      ? "$"
      : quoteCurrencyCode === "EUR"
      ? "€"
      : quoteCurrencyCode === "GBP"
      ? "£"
      : quoteCurrencyCode === "INR"
      ? "₹"
      : "";

  // Determine exchange rate display text and explanation
  let exchangeRateText = "";
  let conversionExplanation = "";

  if (quoteCurrencyCode === accountCurrency.code) {
    // Same currency case
    exchangeRateText = `Same currency (${quoteCurrencyCode})`;
    conversionExplanation = "No conversion needed";
  } else {
    // Direct rate display matching professional trading platforms
    exchangeRateText = `1 ${quoteCurrencyCode} = ${
      accountCurrency.symbol
    }${exchangeRate.toFixed(6)} ${accountCurrency.code}`;
    conversionExplanation = `Converting ${quoteCurrencyCode} to ${accountCurrency.code} using real-time rates`;
  }

  // Calculate pip values for different lot sizes
  const calculatePipForLotSize = (units: number) => {
    const pipValue = calculatePipValueInQuoteCurrency(
      currencyPair,
      units,
      1 // 1 pip
    );

    // Calculate in account currency if needed
    const accountValue =
      pipValue *
      (quoteCurrencyCode === accountCurrency.code ? 1 : exchangeRate);

    return {
      quoteValue: pipValue,
      accountValue: accountValue,
    };
  };

  // Define standard lot sizes
  const standardLotSize = 100000;
  const miniLotSize = 10000;
  const microLotSize = 1000;
  const nanoLotSize = 100;

  // Calculate pip values for each lot size
  const standardPipValues = calculatePipForLotSize(standardLotSize);
  const miniPipValues = calculatePipForLotSize(miniLotSize);
  const microPipValues = calculatePipForLotSize(microLotSize);
  const nanoPipValues = calculatePipForLotSize(nanoLotSize);

  return (
<<<<<<< Updated upstream
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={getGradient("card").colors}
        start={getGradient("card").start}
        end={getGradient("card").end}
        style={[
          styles.container,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <LinearGradient
          colors={getGradient("primary").colors}
          start={getGradient("primary").start}
          end={getGradient("primary").end}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Calculation Results</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.mainResults}>
            <View style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: colors.subtext }]}>
                Per Pip in {quoteCurrencyCode}
              </Text>
              <Text style={[styles.resultValue, { color: colors.text }]}>
                {formatPipValue(
                  pipValueInQuoteCurrency,
                  quoteCurrencyCode,
                  quoteCurrencySymbol
                )}
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: colors.subtext }]}>
                Per Pip in {accountCurrency.code}
              </Text>
              <Text style={[styles.resultValue, { color: colors.text }]}>
                {formatPipValue(
                  pipValueInAccountCurrency,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
            </View>
          </View>
=======
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 6,
            },
          }),
        },
      ]}
    >
      <LinearGradient
        colors={getGradient("primary").colors}
        start={getGradient("primary").start}
        end={getGradient("primary").end}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Calculation Results</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Main Results Section */}
        <View style={styles.mainResultsContainer}>
          <View style={styles.resultColumn}>
            <Text style={[styles.resultLabel, { color: colors.subtext }]}>
              Pip Value in {quoteCurrencyCode}
            </Text>
            <Text style={[styles.resultValue, { color: colors.text }]}>
              {formatPipValue(
                pipValueInQuoteCurrency,
                quoteCurrencyCode,
                quoteCurrencySymbol
              )}
            </Text>
          </View>
          
          <View style={styles.resultColumn}>
            <Text style={[styles.resultLabel, { color: colors.subtext }]}>
              Pip Value in {accountCurrency.code}
            </Text>
            <Text style={[styles.resultValue, { color: colors.text }]}>
              {formatPipValue(
                pipValueInAccountCurrency,
                accountCurrency.code,
                accountCurrency.symbol
              )}
            </Text>
          </View>
        </View>
>>>>>>> Stashed changes

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

<<<<<<< Updated upstream
          <View style={styles.totalResults}>
            <View
              style={[
                styles.totalCard,
                { backgroundColor: colors.primary + "10" },
              ]}
            >
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total for {pipCount} pip{pipCount !== 1 ? "s" : ""}
              </Text>
              <View style={styles.totalValues}>
                <View style={styles.totalValueContainer}>
                  <Text
                    style={[styles.totalCurrency, { color: colors.subtext }]}
                  >
                    {quoteCurrencyCode}
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: colors.primary }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {formatCurrencyValue(
                      totalValueInQuoteCurrency,
                      quoteCurrencyCode,
                      quoteCurrencySymbol
                    )}
                  </Text>
                </View>

                <View style={styles.totalValueContainer}>
                  <Text
                    style={[styles.totalCurrency, { color: colors.subtext }]}
                  >
                    {accountCurrency.code}
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: colors.primary }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {formatCurrencyValue(
                      totalValueInAccountCurrency,
                      accountCurrency.code,
                      accountCurrency.symbol
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
=======
        {/* Total Values Section */}
        <View style={styles.totalContainer}>
          <LinearGradient
            colors={getGradient("accent").colors}
            start={getGradient("accent").start}
            end={getGradient("accent").end}
            style={styles.totalBadge}
          >
            <Text style={styles.totalBadgeText}>
              TOTAL FOR {pipCount} PIP{pipCount !== 1 ? "S" : ""}
            </Text>
          </LinearGradient>
          
          <View style={styles.totalValuesContainer}>
            <View style={styles.totalValueRow}>
              <Text style={[styles.totalValueLabel, { color: colors.subtext }]}>
                In {quoteCurrencyCode}:
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {formatCurrencyValue(
                  totalValueInQuoteCurrency,
                  quoteCurrencyCode,
                  quoteCurrencySymbol
                )}
              </Text>
            </View>
            
            <View style={styles.totalValueRow}>
              <Text style={[styles.totalValueLabel, { color: colors.subtext }]}>
                In {accountCurrency.code}:
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {formatCurrencyValue(
                  totalValueInAccountCurrency,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
            </View>
          </View>
        </View>
>>>>>>> Stashed changes

          <View style={styles.exchangeRateContainer}>
            <Text style={[styles.exchangeRateLabel, { color: colors.text }]}>
              Exchange Rate
            </Text>
            <Text style={[styles.exchangeRateValue, { color: colors.primary }]}>
              {exchangeRateText}
            </Text>
            <Text
              style={[styles.conversionExplanation, { color: colors.subtext }]}
            >
              {conversionExplanation}
            </Text>
          </View>

<<<<<<< Updated upstream
          <View
            style={[
              styles.dataSourceContainer,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <MaterialIcons name="public" size={16} color={colors.success} />
=======
        {/* Exchange Rate Section */}
        <View style={styles.exchangeRateContainer}>
          <View style={styles.exchangeRateHeader}>
            <MaterialIcons name="sync" size={18} color={colors.primary} />
            <Text style={[styles.exchangeRateTitle, { color: colors.text }]}>
              Exchange Rate
            </Text>
          </View>
          
          <Text style={[styles.exchangeRateValue, { color: colors.text }]}>
            {exchangeRateText}
          </Text>
          
          <Text style={[styles.conversionExplanation, { color: colors.subtext }]}>
            {conversionExplanation}
          </Text>

          <View style={[styles.dataSourceContainer, { backgroundColor: colors.success + "15" }]}>
            <MaterialIcons name="public" size={14} color={colors.success} />
>>>>>>> Stashed changes
            <Text style={[styles.dataSourceLabel, { color: colors.success }]}>
              USING TRADERMADE LIVE RATES
            </Text>
          </View>

<<<<<<< Updated upstream
          <View
            style={[styles.lotSizesContainer, { borderTopColor: colors.border }]}
          >
            <Text style={[styles.lotSizesTitle, { color: colors.text }]}>
              Pip Values by Lot Size
            </Text>
            <View style={styles.lotSizeGrid}>
              <View
=======
        {/* Lot Size Pip Values Section */}
        <View style={[styles.lotSizesContainer, { borderTopColor: colors.border }]}>
          <Text style={[styles.lotSizesTitle, { color: colors.text }]}>
            Pip Values by Lot Size
          </Text>
          
          <View style={styles.lotSizeGrid}>
            {[
              { label: "Standard (100K)", values: standardPipValues },
              { label: "Mini (10K)", values: miniPipValues },
              { label: "Micro (1K)", values: microPipValues },
              { label: "Nano (100)", values: nanoPipValues }
            ].map((item, index) => (
              <View
                key={index}
>>>>>>> Stashed changes
                style={[
                  styles.lotSizeItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
<<<<<<< Updated upstream
                  Standard (100K)
                </Text>
                <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                  {formatPipValue(
                    standardPipValues.quoteValue,
=======
                  {item.label}
                </Text>
                <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                  {formatPipValue(
                    item.values.quoteValue,
>>>>>>> Stashed changes
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
<<<<<<< Updated upstream
                <Text
                  style={[styles.lotSizeSubValue, { color: colors.primary }]}
                >
                  {formatPipValue(
                    standardPipValues.accountValue,
                    accountCurrency.code,
                    accountCurrency.symbol
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.lotSizeItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
                  Mini (10K)
                </Text>
                <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                  {formatPipValue(
                    miniPipValues.quoteValue,
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
                <Text
                  style={[styles.lotSizeSubValue, { color: colors.primary }]}
                >
                  {formatPipValue(
                    miniPipValues.accountValue,
                    accountCurrency.code,
                    accountCurrency.symbol
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.lotSizeItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
                  Micro (1K)
                </Text>
                <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                  {formatPipValue(
                    microPipValues.quoteValue,
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
                <Text
                  style={[styles.lotSizeSubValue, { color: colors.primary }]}
                >
                  {formatPipValue(
                    microPipValues.accountValue,
                    accountCurrency.code,
                    accountCurrency.symbol
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.lotSizeItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
                  Nano (100)
                </Text>
                <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                  {formatPipValue(
                    nanoPipValues.quoteValue,
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
                <Text
                  style={[styles.lotSizeSubValue, { color: colors.primary }]}
                >
                  {formatPipValue(
                    nanoPipValues.accountValue,
                    accountCurrency.code,
                    accountCurrency.symbol
                  )}
                </Text>
              </View>
            </View>
=======
                <LinearGradient
                  colors={getGradient("primary").colors}
                  start={getGradient("primary").start}
                  end={getGradient("primary").end}
                  style={styles.lotSizeAccountValue}
                >
                  <Text style={styles.lotSizeAccountValueText}>
                    {formatPipValue(
                      item.values.accountValue,
                      accountCurrency.code,
                      accountCurrency.symbol
                    )}
                  </Text>
                </LinearGradient>
              </View>
            ))}
>>>>>>> Stashed changes
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  container: {
    borderRadius: 20,
<<<<<<< Updated upstream
=======
    marginVertical: 16,
>>>>>>> Stashed changes
    borderWidth: 1,
    overflow: "hidden",
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    padding: 20,
  },
<<<<<<< Updated upstream
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  mainResults: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    marginHorizontal: 4,
=======
  mainResultsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  resultColumn: {
    flex: 1,
    alignItems: "center",
    padding: 12,
>>>>>>> Stashed changes
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  resultValue: {
<<<<<<< Updated upstream
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
=======
    fontSize: 20,
    fontWeight: "bold",
>>>>>>> Stashed changes
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
<<<<<<< Updated upstream
  totalResults: {
    marginBottom: 16,
  },
  totalCard: {
    borderRadius: 16,
    padding: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  totalValues: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalValueContainer: {
    flex: 1,
    alignItems: "center",
  },
  totalCurrency: {
    fontSize: 14,
    marginBottom: 4,
=======
  totalContainer: {
    marginVertical: 8,
    alignItems: "center",
  },
  totalBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  totalBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  totalValuesContainer: {
    width: "100%",
  },
  totalValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  totalValueLabel: {
    fontSize: 16,
>>>>>>> Stashed changes
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exchangeRateContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
<<<<<<< Updated upstream
  exchangeRateLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  exchangeRateValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  conversionExplanation: {
    fontSize: 12,
=======
  exchangeRateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exchangeRateTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  exchangeRateValue: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  conversionExplanation: {
    fontSize: 14,
    marginBottom: 8,
>>>>>>> Stashed changes
  },
  dataSourceContainer: {
    flexDirection: "row",
    alignItems: "center",
<<<<<<< Updated upstream
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
=======
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
>>>>>>> Stashed changes
  },
  dataSourceLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
  },
  lotSizesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  lotSizesTitle: {
    fontSize: 16,
    fontWeight: "600",
<<<<<<< Updated upstream
    marginBottom: 12,
=======
    marginBottom: 16,
>>>>>>> Stashed changes
    textAlign: "center",
  },
  lotSizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lotSizeItem: {
    width: "48%",
<<<<<<< Updated upstream
    borderRadius: 12,
=======
    borderRadius: 16,
>>>>>>> Stashed changes
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
<<<<<<< Updated upstream
  },
  lotSizeLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  lotSizeValue: {
    fontSize: 16,
    fontWeight: "600",
=======
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  lotSizeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  lotSizeValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
>>>>>>> Stashed changes
  },
  lotSizeAccountValue: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  lotSizeAccountValueText: {
    fontSize: 12,
<<<<<<< Updated upstream
    marginTop: 4,
=======
    fontWeight: "bold",
    color: "white",
>>>>>>> Stashed changes
  },
});

export default ResultCard;
