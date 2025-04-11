import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Currency, CurrencyPair } from "../constants/currencies";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { calculatePipValueInQuoteCurrency } from "../utils/pipCalculator";
import { LotSize } from "../constants/lotSizes";

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
  const { colors, theme } = useTheme();
  const isDarkMode = theme === "dark";

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

  // Get gradient colors based on theme - more modern 2025 style for light mode
  const gradientConfig = useTheme().getGradient("primary");

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        },
      ]}
    >
      <LinearGradient
        colors={gradientConfig.colors}
        start={gradientConfig.start}
        end={gradientConfig.end}
        style={styles.headerGradient}
      >
        <Text style={[styles.title, { color: "#fff" }]}>
          Calculation Results
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.resultRow}>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Pip Value in {quoteCurrencyCode}:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatPipValue(
              pipValueInQuoteCurrency,
              quoteCurrencyCode,
              quoteCurrencySymbol
            )}
          </Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Pip Value in {accountCurrency.code}:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatPipValue(
              pipValueInAccountCurrency,
              accountCurrency.code,
              accountCurrency.symbol
            )}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>
            Total for {pipCount} pip{pipCount !== 1 ? "s" : ""} in{" "}
            {quoteCurrencyCode}:
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            {formatCurrencyValue(
              totalValueInQuoteCurrency,
              quoteCurrencyCode,
              quoteCurrencySymbol
            )}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>
            Total for {pipCount} pip{pipCount !== 1 ? "s" : ""} in{" "}
            {accountCurrency.code}:
          </Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            {formatCurrencyValue(
              totalValueInAccountCurrency,
              accountCurrency.code,
              accountCurrency.symbol
            )}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.exchangeRateContainer}>
          <Text style={[styles.exchangeRateLabel, { color: colors.text }]}>
            Exchange Rate: {exchangeRateText}
          </Text>

          <Text style={[styles.conversionExplanation, { color: colors.info }]}>
            {conversionExplanation}
          </Text>

          <View style={styles.dataSourceContainer}>
            <MaterialIcons name="public" size={14} color={colors.success} />
            <Text style={[styles.dataSourceLabel, { color: colors.success }]}>
              USING TRADERMADE LIVE RATES
            </Text>
          </View>
        </View>

        {/* Lot size pip value calculations */}
        <View
          style={[styles.lotSizesContainer, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.lotSizesTitle, { color: colors.text }]}>
            Pip Values by Lot Size
          </Text>
          <View style={styles.lotSizeGrid}>
            <View
              style={[
                styles.lotSizeItem,
                {
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
                Standard (100K)
              </Text>
              <Text style={[styles.lotSizeValue, { color: colors.text }]}>
                {formatPipValue(
                  standardPipValues.quoteValue,
                  quoteCurrencyCode,
                  quoteCurrencySymbol
                )}
              </Text>
              <Text style={[styles.lotSizeSubValue, { color: colors.primary }]}>
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
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                  borderWidth: 1,
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
              <Text style={[styles.lotSizeSubValue, { color: colors.primary }]}>
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
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                  borderWidth: 1,
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
              <Text style={[styles.lotSizeSubValue, { color: colors.primary }]}>
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
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary + "30",
                  borderWidth: 1,
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
              <Text style={[styles.lotSizeSubValue, { color: colors.primary }]}>
                {formatPipValue(
                  nanoPipValues.accountValue,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  headerGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  exchangeRateContainer: {
    marginVertical: 8,
    alignItems: "center",
  },
  exchangeRateLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  conversionExplanation: {
    fontSize: 12,
    marginBottom: 4,
  },
  dataSourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "#4CAF5020",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dataSourceLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  lotSizesContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  lotSizesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  lotSizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lotSizeItem: {
    width: "48%",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  lotSizeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  lotSizeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  lotSizeSubValue: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ResultCard;
