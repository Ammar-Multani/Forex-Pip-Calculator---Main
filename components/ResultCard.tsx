import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Currency, CurrencyPair } from "../constants/currencies";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { calculatePipValueInQuoteCurrency } from "../utils/pipCalculator";
import { LotSize } from "../constants/lotSizes";
import { generatePdf, sharePdf } from "../utils/pdfGenerator";

interface ResultCardProps {
  accountCurrency: Currency;
  currencyPair: CurrencyPair;
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  exchangeRate: number;
  pipCount: number;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
  lotType?: string;
  lotCount?: number;
  positionSize?: number;
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
  onRefresh,
  isRefreshing = false,
  lotType,
  lotCount,
  positionSize,
}) => {
  const { colors, theme, getGradient } = useTheme();
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

  const handleRefresh = () => {
    if (onRefresh && !isRefreshing) {
      onRefresh();
    }
  };

  const handleSaveAsPdf = async () => {
    try {
      // Get position size from props or calculate it if not provided
      const calculatedPositionSize =
        positionSize ||
        pipValueInQuoteCurrency /
          (currencyPair.quote === "JPY" ? 0.01 : 0.0001) /
          (pipCount || 1);

      // Generate PDF
      const filePath = await generatePdf({
        accountCurrency,
        currencyPair,
        pipValueInQuoteCurrency,
        pipValueInAccountCurrency,
        totalValueInQuoteCurrency,
        totalValueInAccountCurrency,
        exchangeRate,
        pipCount,
        positionSize: calculatedPositionSize,
        lotType: lotType || "Standard", // Use props or default
        lotCount: lotCount || 1, // Use props or default
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.primary + "30",
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            },
            android: {
              elevation: 10,
            },
          }),
        },
      ]}
    >
      <View style={styles.content}>
        {/* Main result hero section with gradient background */}
        <LinearGradient
          colors={getGradient("primary").colors}
          start={getGradient("primary").start}
          end={getGradient("primary").end}
          style={styles.heroContainer}
        >
          <View style={styles.heroContent}>
            <View style={styles.pipCountContainer}>
              <Text style={styles.pipCountLabel}>
                {pipCount} pip{pipCount !== 1 ? "s" : ""}
              </Text>
            </View>

            <View style={styles.heroValueContainer}>
              <Text style={styles.currencySymbol}>
                {accountCurrency.symbol}
              </Text>
              <Text style={styles.heroValue}>
                {totalValueInAccountCurrency.toFixed(2)}
              </Text>
            </View>

            <View style={styles.heroSubtextContainer}>
              <Text style={styles.heroSubtext}>{accountCurrency.code}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Data visualization cards */}
        <View style={styles.dataCardsContainer}>
          {/* Per Pip Value Card */}
          <View
            style={[
              styles.dataCard,
              {
                backgroundColor: isDarkMode
                  ? "rgb(45, 52, 65)"
                  : "rgb(255, 255, 255)",
                borderColor: isDarkMode
                  ? colors.border + "30"
                  : "rgba(230, 235, 240, 0.9)",
              },
            ]}
          >
            <View style={styles.dataCardHeader}>
              <View
                style={[
                  styles.iconBubble,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <MaterialIcons
                  name="trending-up"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.dataCardTitle, { color: colors.text }]}>
                Per Pip
              </Text>
            </View>

            <View style={styles.dataCardContent}>
              <View style={styles.dataRow}>
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {quoteCurrencyCode}
                </Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {formatPipValue(
                    pipValueInQuoteCurrency,
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.dataDivider,
                  { backgroundColor: colors.border + "30" },
                ]}
              />

              <View style={styles.dataRow}>
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {accountCurrency.code}
                </Text>
                <Text style={[styles.dataValue, { color: colors.primary }]}>
                  {formatPipValue(
                    pipValueInAccountCurrency,
                    accountCurrency.code,
                    accountCurrency.symbol
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Total Value Card */}
          <View
            style={[
              styles.dataCard,
              {
                backgroundColor: isDarkMode
                  ? "rgb(45, 52, 65)"
                  : "rgb(255, 255, 255)",
                borderColor: isDarkMode
                  ? colors.border + "30"
                  : "rgba(230, 235, 240, 0.9)",
              },
            ]}
          >
            <View style={styles.dataCardHeader}>
              <View
                style={[
                  styles.iconBubble,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <MaterialIcons
                  name="calculate"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.dataCardTitle, { color: colors.text }]}>
                Total ({pipCount})
              </Text>
            </View>

            <View style={styles.dataCardContent}>
              <View style={styles.dataRow}>
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {quoteCurrencyCode}
                </Text>
                <Text style={[styles.dataValue, { color: colors.text }]}>
                  {formatCurrencyValue(
                    totalValueInQuoteCurrency,
                    quoteCurrencyCode,
                    quoteCurrencySymbol
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.dataDivider,
                  { backgroundColor: colors.border + "30" },
                ]}
              />

              <View style={styles.dataRow}>
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {accountCurrency.code}
                </Text>
                <Text
                  style={[
                    styles.dataValue,
                    { color: colors.primary, fontWeight: "700" },
                  ]}
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

        {/* Exchange rate info - glassmorphism design */}
        <View
          style={[
            styles.exchangeRateContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(50, 55, 65, 0.7)"
                : "rgba(250, 250, 255, 0.8)",
              borderColor: isDarkMode
                ? "rgba(80, 90, 110, 0.3)"
                : "rgba(220, 225, 235, 0.8)",
            },
          ]}
        >
          <View style={styles.exchangeRateContent}>
            <View style={styles.exchangeRateHeader}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={isRefreshing || !onRefresh}
              >
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <MaterialIcons name="sync" size={14} color={colors.primary} />
                )}
              </TouchableOpacity>
              <Text style={[styles.exchangeRateTitle, { color: colors.text }]}>
                Exchange Rate
              </Text>
            </View>
            <Text style={[styles.exchangeRateValue, { color: colors.primary }]}>
              {exchangeRateText}
            </Text>
          </View>

          <View
            style={[
              styles.liveRatesBadge,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <MaterialIcons name="public" size={10} color={colors.success} />
            <Text style={[styles.liveRatesLabel, { color: colors.success }]}>
              LIVE
            </Text>
          </View>
        </View>

        {/* Lot size pip value table - modern, clean design */}
        <View style={styles.lotSizesSection}>
          <View style={styles.lotSizesSectionHeader}>
            <View
              style={[
                styles.iconBubble,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <MaterialIcons
                name="account-balance"
                size={16}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.lotSizesSectionTitle, { color: colors.text }]}>
              Pip Values by Lot Size
            </Text>
          </View>

          <View style={styles.lotSizeGrid}>
            {/* Standard Lot */}
            <View
              style={[
                styles.lotSizeCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(45, 52, 65, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderColor: isDarkMode
                    ? "rgba(80, 100, 140, 0.2)"
                    : "rgba(230, 235, 245, 0.9)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(63, 81, 181, 0.1)", "rgba(63, 81, 181, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lotSizeBadge}
              >
                <Text style={styles.lotSizeType}>Standard</Text>
              </LinearGradient>
              <Text style={[styles.lotSizeUnits, { color: colors.subtext }]}>
                100,000 units
              </Text>
              <Text style={[styles.lotSizeValue, { color: colors.primary }]}>
                {formatPipValue(
                  standardPipValues.accountValue,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
              <Text style={[styles.lotSizePerPip, { color: colors.subtext }]}>
                per pip
              </Text>
            </View>

            {/* Mini Lot */}
            <View
              style={[
                styles.lotSizeCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(45, 52, 65, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderColor: isDarkMode
                    ? "rgba(80, 100, 140, 0.2)"
                    : "rgba(230, 235, 245, 0.9)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(76, 175, 80, 0.1)", "rgba(76, 175, 80, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lotSizeBadge}
              >
                <Text style={[styles.lotSizeType, { color: "#4CAF50" }]}>
                  Mini
                </Text>
              </LinearGradient>
              <Text style={[styles.lotSizeUnits, { color: colors.subtext }]}>
                10,000 units
              </Text>
              <Text style={[styles.lotSizeValue, { color: colors.primary }]}>
                {formatPipValue(
                  miniPipValues.accountValue,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
              <Text style={[styles.lotSizePerPip, { color: colors.subtext }]}>
                per pip
              </Text>
            </View>

            {/* Micro Lot */}
            <View
              style={[
                styles.lotSizeCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(45, 52, 65, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderColor: isDarkMode
                    ? "rgba(80, 100, 140, 0.2)"
                    : "rgba(230, 235, 245, 0.9)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(255, 152, 0, 0.1)", "rgba(255, 152, 0, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lotSizeBadge}
              >
                <Text style={[styles.lotSizeType, { color: "#FF9800" }]}>
                  Micro
                </Text>
              </LinearGradient>
              <Text style={[styles.lotSizeUnits, { color: colors.subtext }]}>
                1,000 units
              </Text>
              <Text style={[styles.lotSizeValue, { color: colors.primary }]}>
                {formatPipValue(
                  microPipValues.accountValue,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
              <Text style={[styles.lotSizePerPip, { color: colors.subtext }]}>
                per pip
              </Text>
            </View>

            {/* Nano Lot */}
            <View
              style={[
                styles.lotSizeCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(45, 52, 65, 0.7)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderColor: isDarkMode
                    ? "rgba(80, 100, 140, 0.2)"
                    : "rgba(230, 235, 245, 0.9)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(233, 30, 99, 0.1)", "rgba(233, 30, 99, 0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.lotSizeBadge}
              >
                <Text style={[styles.lotSizeType, { color: "#E91E63" }]}>
                  Nano
                </Text>
              </LinearGradient>
              <Text style={[styles.lotSizeUnits, { color: colors.subtext }]}>
                100 units
              </Text>
              <Text style={[styles.lotSizeValue, { color: colors.primary }]}>
                {formatPipValue(
                  nanoPipValues.accountValue,
                  accountCurrency.code,
                  accountCurrency.symbol
                )}
              </Text>
              <Text style={[styles.lotSizePerPip, { color: colors.subtext }]}>
                per pip
              </Text>
            </View>
          </View>
        </View>

        {/* Save as PDF Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveAsPdfButtonWrapper}
            onPress={handleSaveAsPdf}
          >
            <LinearGradient
              colors={getGradient("secondary").colors}
              start={getGradient("secondary").start}
              end={getGradient("secondary").end}
              style={styles.saveAsPdfButton}
            >
              <MaterialIcons name="picture-as-pdf" size={18} color="#fff" />
              <Text style={styles.saveAsPdfButtonText}>Save as PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
  },
  content: {
    paddingBottom: 5,
  },
  // Hero section styles
  heroContainer: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  heroContent: {
    alignItems: "center",
  },
  pipCountContainer: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pipCountLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
  },
  heroValueContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currencySymbol: {
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 8,
    marginRight: 2,
  },
  heroValue: {
    fontSize: 46,
    color: "#ffffff",
    fontWeight: "700",
  },
  heroSubtextContainer: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  heroSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
  },
  // Data cards styles
  dataCardsContainer: {
    flexDirection: "row",
    marginTop: -24,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  dataCard: {
    width: "47%",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  dataCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  smallIconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  dataCardIcon: {
    marginRight: 6,
  },
  dataCardTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  dataCardContent: {
    padding: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  dataLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  dataDivider: {
    height: 1,
    marginVertical: 6,
  },
  // Exchange rate container styles
  exchangeRateContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exchangeRateContent: {
    flex: 1,
  },
  exchangeRateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  exchangeRateTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  refreshButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.03)",
    justifyContent: "center",
    alignItems: "center",
  },
  exchangeRateValue: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 30,
  },
  liveRatesBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  liveRatesLabel: {
    fontSize: 9,
    fontWeight: "700",
    marginLeft: 3,
    letterSpacing: 0.5,
  },
  // Lot sizes section styles
  lotSizesSection: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  lotSizesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  lotSizesSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  lotSizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lotSizeCard: {
    width: "47%",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  lotSizeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  lotSizeType: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3F51B5",
  },
  lotSizeUnits: {
    fontSize: 11,
    marginBottom: 6,
  },
  lotSizeValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  lotSizePerPip: {
    fontSize: 11,
    marginTop: 3,
  },
  // Save as PDF button styles
  saveButtonContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  saveAsPdfButtonWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
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
  saveAsPdfButton: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  saveAsPdfButtonText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    color: "#fff",
  },
});

export default ResultCard;
