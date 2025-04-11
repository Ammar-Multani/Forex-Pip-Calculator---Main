import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Currency, CurrencyPair } from "../constants/currencies";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { MaterialIcons } from "@expo/vector-icons";

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
  const { colors } = useTheme();

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Calculation Results
      </Text>

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

      <View style={styles.divider} />

      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>
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

      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>
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

      <View style={styles.divider} />

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

      {/* Standard lot size reference */}
      <View style={styles.lotSizesContainer}>
        <View style={styles.lotSizeRow}>
          <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
            Standard lot:
          </Text>
          <Text style={[styles.lotSizeValue, { color: colors.text }]}>
            100,000 units
          </Text>
        </View>

        <View style={styles.lotSizeRow}>
          <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
            Mini lot:
          </Text>
          <Text style={[styles.lotSizeValue, { color: colors.text }]}>
            10,000 units
          </Text>
        </View>

        <View style={styles.lotSizeRow}>
          <Text style={[styles.lotSizeLabel, { color: colors.subtext }]}>
            Micro lot:
          </Text>
          <Text style={[styles.lotSizeValue, { color: colors.text }]}>
            1,000 units
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    flex: 1,
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
    backgroundColor: "#E0E0E0",
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
  },
  dataSourceLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  lotSizesContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  lotSizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  lotSizeLabel: {
    fontSize: 13,
  },
  lotSizeValue: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default ResultCard;
