import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { generatePdf, sharePdf } from "../utils/pdfGenerator";
import { Currency, CurrencyPair } from "../constants/currencies";

// Type definition for history item
interface HistoryItem {
  id: string;
  timestamp: string;
  accountCurrency: Currency;
  currencyPair: CurrencyPair;
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  exchangeRate: number;
  pipCount: number;
  positionSize: number;
  lotType: string;
  lotCount: number;
}

const HistoryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, theme, toggleTheme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load history from storage
  const loadHistory = useCallback(async () => {
    try {
      const historyJson = await AsyncStorage.getItem(
        "forex-pip-calculator-history"
      );
      if (historyJson) {
        const parsedHistory = JSON.parse(historyJson);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      Alert.alert(
        "Error",
        "Failed to load calculation history. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  // Handle delete all history
  const handleClearHistory = useCallback(async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your calculation history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("forex-pip-calculator-history");
              setHistory([]);
              Alert.alert(
                "Success",
                "Your calculation history has been cleared."
              );
            } catch (error) {
              console.error("Error clearing history:", error);
              Alert.alert(
                "Error",
                "Failed to clear history. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  }, []);

  // Handle delete single history item
  const handleDeleteItem = useCallback(
    async (id: string) => {
      try {
        const updatedHistory = history.filter((item) => item.id !== id);
        await AsyncStorage.setItem(
          "forex-pip-calculator-history",
          JSON.stringify(updatedHistory)
        );
        setHistory(updatedHistory);
      } catch (error) {
        console.error("Error deleting history item:", error);
        Alert.alert("Error", "Failed to delete item. Please try again.", [
          { text: "OK" },
        ]);
      }
    },
    [history]
  );

  // Format date from ISO string
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Handle save as PDF
  const handleSaveAsPdf = async (item: HistoryItem) => {
    try {
      // Generate PDF
      const filePath = await generatePdf({
        accountCurrency: item.accountCurrency,
        currencyPair: item.currencyPair,
        pipValueInQuoteCurrency: item.pipValueInQuoteCurrency,
        pipValueInAccountCurrency: item.pipValueInAccountCurrency,
        totalValueInQuoteCurrency: item.totalValueInQuoteCurrency,
        totalValueInAccountCurrency: item.totalValueInAccountCurrency,
        exchangeRate: item.exchangeRate,
        pipCount: item.pipCount,
        positionSize: item.positionSize,
        lotType: item.lotType,
        lotCount: item.lotCount,
      });

      if (filePath) {
        // Share PDF
        await sharePdf(filePath);
      } else {
        Alert.alert("Error", "Failed to generate PDF. Please try again.", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("Error saving PDF:", error);
      Alert.alert(
        "Error",
        "An error occurred while saving the PDF. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Render each history item
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    // Determine exchange rate display text
    let exchangeRateText = "";
    if (item.currencyPair.quote === item.accountCurrency.code) {
      exchangeRateText = `Same currency (${item.currencyPair.quote})`;
    } else {
      exchangeRateText = `1 ${item.currencyPair.quote} = ${
        item.accountCurrency.symbol
      }${item.exchangeRate.toFixed(6)} ${item.accountCurrency.code}`;
    }

    return (
      <View
        style={[
          styles.historyItem,
          {
            backgroundColor: isDarkMode
              ? "rgba(45, 52, 65, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDarkMode
              ? colors.border + "30"
              : "rgba(230, 235, 240, 0.9)",
          },
        ]}
      >
        <View style={styles.historyItemHeader}>
          <View style={styles.timestampContainer}>
            <MaterialIcons
              name="access-time"
              size={16}
              color={colors.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.timestamp, { color: colors.subtext }]}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => handleSaveAsPdf(item)}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="picture-as-pdf"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id)}
              style={styles.actionButton}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pairContainer}>
          <Text style={[styles.pairText, { color: colors.primary }]}>
            {item.currencyPair.name}
          </Text>
          <View
            style={[
              styles.pipBadge,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.pipBadgeText, { color: colors.primary }]}>
              {item.pipCount} pip{item.pipCount !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.detailsContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(30, 35, 45, 0.4)"
                : "rgba(0,0,0,0.03)",
            },
          ]}
        >
          {/* First row: Position size */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              Position Size:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {item.lotType} ({item.lotCount}) -{" "}
              {item.positionSize.toLocaleString()} units
            </Text>
          </View>

          {/* Second row: Exchange rate */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              Exchange Rate:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exchangeRateText}
            </Text>
          </View>

          {/* Per pip value row */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              Per Pip:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatPipValue(
                item.pipValueInAccountCurrency,
                item.accountCurrency.code,
                item.accountCurrency.symbol
              )}
            </Text>
          </View>

          {/* Total value row */}
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              Total Value:
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.primary, fontWeight: "700" },
              ]}
            >
              {formatCurrencyValue(
                item.totalValueInAccountCurrency,
                item.accountCurrency.code,
                item.accountCurrency.symbol
              )}
            </Text>
          </View>

          {/* Quote currency value (if different from account currency) */}
          {item.currencyPair.quote !== item.accountCurrency.code && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.text }]}>
                In {item.currencyPair.quote}:
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatCurrencyValue(
                  item.totalValueInQuoteCurrency,
                  item.currencyPair.quote,
                  item.currencyPair.quote === "JPY"
                    ? "¥"
                    : item.currencyPair.quote === "USD"
                    ? "$"
                    : item.currencyPair.quote === "EUR"
                    ? "€"
                    : item.currencyPair.quote === "GBP"
                    ? "£"
                    : ""
                )}
              </Text>
            </View>
          )}
        </View>

        {/* Export button */}
        <TouchableOpacity
          style={[
            styles.exportButton,
            { backgroundColor: colors.primary + "15" },
          ]}
          onPress={() => handleSaveAsPdf(item)}
        >
          <MaterialIcons
            name="picture-as-pdf"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.exportButtonText, { color: colors.primary }]}>
            Export as PDF
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Calculation History"
        onThemeToggle={toggleTheme}
        onBackPress={() => navigation.goBack()}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Clear All Button */}
        {history.length > 0 && (
          <TouchableOpacity
            style={[
              styles.clearAllButton,
              {
                backgroundColor: colors.error + "15",
                borderColor: colors.error + "30",
              },
            ]}
            onPress={handleClearHistory}
          >
            <MaterialIcons name="delete-sweep" size={18} color={colors.error} />
            <Text style={[styles.clearAllText, { color: colors.error }]}>
              Clear All History
            </Text>
          </TouchableOpacity>
        )}

        {/* Empty State */}
        {history.length === 0 && (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <MaterialIcons name="history" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Saved Calculations
            </Text>
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              Your saved calculations will appear here.
            </Text>
            <TouchableOpacity
              style={[
                styles.newCalculationButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => navigation.navigate("Calculator")}
            >
              <MaterialIcons name="calculate" size={18} color="#fff" />
              <Text style={styles.newCalculationText}>New Calculation</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History List */}
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  pairContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  pairText: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
  pipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pipBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailsContainer: {
    padding: 12,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    alignSelf: "center",
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  newCalculationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  newCalculationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default HistoryScreen;
