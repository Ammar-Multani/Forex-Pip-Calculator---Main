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

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

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

          <View
            style={[
              styles.dataSourceContainer,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <MaterialIcons name="public" size={16} color={colors.success} />
            <Text style={[styles.dataSourceLabel, { color: colors.success }]}>
              USING TRADERMADE LIVE RATES
            </Text>
          </View>

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
                    backgroundColor: colors.card,
                    borderColor: colors.border,
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
    borderWidth: 1,
    overflow: "hidden",
  },
  headerGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  content: {
    padding: 20,
  },
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
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
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
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exchangeRateContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
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
  },
  dataSourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
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
    marginBottom: 12,
    textAlign: "center",
  },
  lotSizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lotSizeItem: {
    width: "48%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  lotSizeLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  lotSizeValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  lotSizeSubValue: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ResultCard;
