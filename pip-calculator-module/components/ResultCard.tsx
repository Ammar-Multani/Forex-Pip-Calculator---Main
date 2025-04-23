import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ResultCardProps {
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  pipCount: string;
  selectedPair: {
    name: string;
    base: string;
    quote: string;
  };
  accountCurrency: {
    code: string;
    symbol: string;
  };
  exchangeRate: number;
  colors: any; // Theme colors
  formatPipValue: (
    value: number,
    currencyCode: string,
    currencySymbol: string
  ) => string;
  formatCurrencyValue: (
    value: number,
    currencyCode: string,
    currencySymbol: string
  ) => string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  pipValueInQuoteCurrency,
  pipValueInAccountCurrency,
  totalValueInQuoteCurrency,
  totalValueInAccountCurrency,
  pipCount,
  selectedPair,
  accountCurrency,
  exchangeRate,
  colors,
  formatPipValue,
  formatCurrencyValue,
}) => {
  const quoteCurrency = selectedPair.quote;
  const quoteCurrencySymbol = getCurrencySymbol(quoteCurrency);
  const numericPipCount = parseFloat(pipCount) || 0;

  function getCurrencySymbol(currencyCode: string): string {
    // Simple mapping for common currency symbols
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
      CHF: "Fr",
      NZD: "NZ$",
    };
    return symbols[currencyCode] || currencyCode;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <MaterialIcons name="attach-money" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Pip Value Results
        </Text>
      </View>

      <View style={[styles.resultSection, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Single Pip Value
        </Text>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: colors.subtext }]}>
            In {quoteCurrency}:
          </Text>
          <Text style={[styles.resultValue, { color: colors.text }]}>
            {formatPipValue(
              pipValueInQuoteCurrency,
              quoteCurrency,
              quoteCurrencySymbol
            )}
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: colors.subtext }]}>
            In {accountCurrency.code}:
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

      <View style={[styles.resultSection, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Total Value for {numericPipCount} pips
        </Text>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: colors.subtext }]}>
            In {quoteCurrency}:
          </Text>
          <Text style={[styles.resultValue, { color: colors.text }]}>
            {formatCurrencyValue(
              totalValueInQuoteCurrency,
              quoteCurrency,
              quoteCurrencySymbol
            )}
          </Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: colors.subtext }]}>
            In {accountCurrency.code}:
          </Text>
          <Text style={[styles.resultValue, { color: colors.text }]}>
            {formatCurrencyValue(
              totalValueInAccountCurrency,
              accountCurrency.code,
              accountCurrency.symbol
            )}
          </Text>
        </View>
      </View>

      <View style={[styles.infoRow, { backgroundColor: colors.card }]}>
        <View style={styles.exchangeRateContainer}>
          <Text style={[styles.exchangeRateLabel, { color: colors.subtext }]}>
            Exchange Rate:
          </Text>
          <Text style={[styles.exchangeRateValue, { color: colors.text }]}>
            1 {quoteCurrency} = {exchangeRate.toFixed(6)} {accountCurrency.code}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  titleRow: {
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  resultSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    padding: 12,
    borderRadius: 8,
  },
  exchangeRateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exchangeRateLabel: {
    fontSize: 12,
  },
  exchangeRateValue: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ResultCard;
