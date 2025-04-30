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
  Clipboard,
  ToastAndroid,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  Currency,
  CurrencyPair,
  getCurrencyByCode,
} from "../constants/currencies";
import { formatCurrencyValue, formatPipValue } from "../utils/pipCalculator";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { calculatePipValueInQuoteCurrency } from "../utils/pipCalculator";
import { LotSize } from "../constants/lotSizes";
import { generatePdf, sharePdf } from "../utils/pdfGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  pipDecimalPlaces?: number;
  onHistorySaved?: () => void;
  onInfoPress?: () => void;
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
  pipDecimalPlaces,
  onHistorySaved,
  onInfoPress,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";

  // Get quote currency details
  const quoteCurrencyCode = currencyPair.quote;
  const quoteCurrency = getCurrencyByCode(quoteCurrencyCode);
  const isQuoteCrypto = quoteCurrency?.isCrypto;

  // Get base currency details
  const baseCurrencyCode = currencyPair.base;
  const baseCurrency = getCurrencyByCode(baseCurrencyCode);
  const isBaseCrypto = baseCurrency?.isCrypto;

  // Get currency symbol, with special handling for cryptocurrencies
  const quoteCurrencySymbol = quoteCurrency?.symbol || "";

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
    }${exchangeRate.toFixed(isQuoteCrypto || isBaseCrypto ? 8 : 6)} ${
      accountCurrency.code
    }`;
    conversionExplanation = `Converting ${quoteCurrencyCode} to ${accountCurrency.code} using real-time rates`;
  }

  // Calculate pip values for different lot sizes
  const calculatePipForLotSize = (units: number) => {
    const pipValue = calculatePipValueInQuoteCurrency(
      currencyPair,
      units,
      1, // 1 pip
      pipDecimalPlaces
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
        pipDecimalPlaces, // Add the pipDecimalPlaces parameter
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

  const handleSaveToHistory = async () => {
    try {
      // Create calculation record to save
      const calculationRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        accountCurrency,
        currencyPair,
        pipValueInQuoteCurrency,
        pipValueInAccountCurrency,
        totalValueInQuoteCurrency,
        totalValueInAccountCurrency,
        exchangeRate,
        pipCount,
        positionSize: positionSize || 0,
        lotType: lotType || "Standard",
        lotCount: lotCount || 1,
        pipDecimalPlaces: pipDecimalPlaces || 4,
      };

      // Get existing history
      const historyJson = await AsyncStorage.getItem(
        "forex-pip-calculator-history"
      );
      let history = historyJson ? JSON.parse(historyJson) : [];

      // Add new calculation to history
      history.unshift(calculationRecord); // Add to beginning of array

      // Limit history to 50 entries
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      // Save updated history
      await AsyncStorage.setItem(
        "forex-pip-calculator-history",
        JSON.stringify(history)
      );

      // Notify user
      Alert.alert(
        "Saved to History",
        "This calculation has been saved to your history log.",
        [{ text: "OK" }]
      );

      // Call callback if provided
      if (onHistorySaved) {
        onHistorySaved();
      }
    } catch (error) {
      console.error("Error saving to history:", error);
      Alert.alert(
        "Error",
        "An error occurred while saving to history. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (value: string, label: string) => {
    Clipboard.setString(value);

    // Show feedback to user
    if (Platform.OS === "android") {
      ToastAndroid.show(`${label} copied to clipboard`, ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", `${label} copied to clipboard`, [{ text: "OK" }]);
    }
  };

  // Helper function to format large numbers with abbreviations
  const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}T`;
    } else if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}B`;
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}M`;
    } else {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  // Check if values are very large - lower threshold to 100k for better readability
  const hasLargeValues =
    totalValueInAccountCurrency > 100_000 ||
    totalValueInQuoteCurrency > 100_000 ||
    pipValueInAccountCurrency > 100_000 ||
    pipValueInQuoteCurrency > 100_000;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? "rgba(33, 33, 33, 0.8)"
            : "rgba(255, 255, 255, 0.9)",
          borderColor: isDarkMode ? colors.border : "rgba(230, 235, 240, 0.9)",
        },
      ]}
    >
      <View style={styles.content}>
        {/* Loading overlay when refreshing */}
        {isRefreshing && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.refreshingText, { color: colors.primary }]}>
              Refreshing data...
            </Text>
          </View>
        )}

        {/* Main result hero section with gradient background */}
        <LinearGradient
          colors={getGradient("primary").colors}
          start={getGradient("primary").start}
          end={getGradient("primary").end}
          style={styles.heroContainer}
        >
          <View style={styles.heroContent}>
            {/* Display currency pair icons at the top */}
            <View style={styles.currencyPairIconsContainer}>
              {/* Base currency icon */}
              {baseCurrency &&
                (isBaseCrypto ? (
                  <Image
                    source={{ uri: baseCurrency.iconUrl }}
                    style={styles.heroIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w160/${baseCurrency.countryCode.toLowerCase()}.png`,
                    }}
                    style={styles.heroIcon}
                    resizeMode="cover"
                  />
                ))}

              {/* Separator */}
              <View style={styles.iconSeparator}>
                <MaterialIcons name="compare-arrows" size={20} color="white" />
              </View>

              {/* Quote currency icon */}
              {quoteCurrency &&
                (isQuoteCrypto ? (
                  <Image
                    source={{ uri: quoteCurrency.iconUrl }}
                    style={styles.heroIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w160/${quoteCurrency.countryCode.toLowerCase()}.png`,
                    }}
                    style={styles.heroIcon}
                    resizeMode="cover"
                  />
                ))}
            </View>

            {/* Info button */}
            {onInfoPress && (
              <TouchableOpacity
                style={styles.infoButton}
                onPress={onInfoPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.infoButtonInner}>
                  <MaterialIcons name="info-outline" size={20} color="white" />
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.pipCountContainer}>
              <Text style={styles.pipCountLabel}>
                {pipCount} pip{pipCount !== 1 ? "s" : ""}
              </Text>
              {pipDecimalPlaces !== undefined && pipDecimalPlaces > 0 && (
                <Text style={styles.pipDecimalPlacesLabel}>
                  {pipDecimalPlaces}
                  {pipDecimalPlaces === 2
                    ? "nd"
                    : pipDecimalPlaces === 3
                    ? "rd"
                    : "th"}{" "}
                  decimal place
                </Text>
              )}
              {pipDecimalPlaces === 0 && (
                <Text style={styles.pipDecimalPlacesLabel}>whole units</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() =>
                copyToClipboard(
                  `${
                    accountCurrency.symbol
                  }${totalValueInAccountCurrency.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Total value"
                )
              }
              style={styles.copyableValue}
            >
              <View style={styles.heroValueContainer}>
                <Text style={styles.currencySymbol}>
                  {accountCurrency.symbol}
                </Text>
                <Text
                  style={styles.heroValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.5}
                >
                  {hasLargeValues
                    ? formatLargeNumber(totalValueInAccountCurrency)
                    : totalValueInAccountCurrency.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </Text>
              </View>
              <MaterialIcons
                name="content-copy"
                size={16}
                color="rgba(255,255,255,0.7)"
                style={styles.copyIcon}
              />
            </TouchableOpacity>

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
                  ? "rgb(47, 47, 47)"
                  : "rgb(255, 255, 255)",
                borderColor: isDarkMode
                  ? colors.border
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
              <TouchableOpacity
                style={styles.dataRow}
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      pipValueInAccountCurrency,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    `${accountCurrency.code} per pip value`
                  )
                }
              >
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {accountCurrency.code}
                </Text>
                <View style={styles.valueWithCopyContainer}>
                  <Text
                    style={[styles.dataValue, { color: colors.primary }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                  >
                    {hasLargeValues
                      ? `${accountCurrency.symbol}${formatLargeNumber(
                          pipValueInAccountCurrency
                        )}`
                      : formatPipValue(
                          pipValueInAccountCurrency,
                          accountCurrency.code,
                          accountCurrency.symbol
                        )}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={colors.primary + "70"}
                    style={styles.smallCopyIcon}
                  />
                </View>
              </TouchableOpacity>

              <View
                style={[
                  styles.dataDivider,
                  { backgroundColor: colors.border + "30" },
                ]}
              />

              <TouchableOpacity
                style={styles.dataRow}
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      pipValueInQuoteCurrency,
                      quoteCurrencyCode,
                      quoteCurrencySymbol
                    ),
                    `${quoteCurrencyCode} per pip value`
                  )
                }
              >
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {quoteCurrencyCode}
                </Text>
                <View style={styles.valueWithCopyContainer}>
                  <Text
                    style={[styles.dataValue, { color: colors.text }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                  >
                    {hasLargeValues
                      ? `${quoteCurrencySymbol}${formatLargeNumber(
                          pipValueInQuoteCurrency
                        )}`
                      : formatPipValue(
                          pipValueInQuoteCurrency,
                          quoteCurrencyCode,
                          quoteCurrencySymbol
                        )}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={colors.text + "70"}
                    style={styles.smallCopyIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Value Card */}
          <View
            style={[
              styles.dataCard,
              {
                backgroundColor: isDarkMode
                  ? "rgb(47, 47, 47)"
                  : "rgb(255, 255, 255)",
                borderColor: isDarkMode
                  ? colors.border
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
              <TouchableOpacity
                style={styles.dataRow}
                onPress={() =>
                  copyToClipboard(
                    formatCurrencyValue(
                      totalValueInAccountCurrency,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    `${accountCurrency.code} total value`
                  )
                }
              >
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {accountCurrency.code}
                </Text>
                <View style={styles.valueWithCopyContainer}>
                  <Text
                    style={[
                      styles.dataValue,
                      { color: colors.primary, fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                  >
                    {hasLargeValues
                      ? `${accountCurrency.symbol}${formatLargeNumber(
                          totalValueInAccountCurrency
                        )}`
                      : formatCurrencyValue(
                          totalValueInAccountCurrency,
                          accountCurrency.code,
                          accountCurrency.symbol
                        )}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={colors.primary + "70"}
                    style={styles.smallCopyIcon}
                  />
                </View>
              </TouchableOpacity>

              <View
                style={[
                  styles.dataDivider,
                  { backgroundColor: colors.border + "30" },
                ]}
              />
              <TouchableOpacity
                style={styles.dataRow}
                onPress={() =>
                  copyToClipboard(
                    formatCurrencyValue(
                      totalValueInQuoteCurrency,
                      quoteCurrencyCode,
                      quoteCurrencySymbol
                    ),
                    `${quoteCurrencyCode} total value`
                  )
                }
              >
                <Text style={[styles.dataLabel, { color: colors.subtext }]}>
                  {quoteCurrencyCode}
                </Text>
                <View style={styles.valueWithCopyContainer}>
                  <Text
                    style={[styles.dataValue, { color: colors.text }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                  >
                    {hasLargeValues
                      ? `${quoteCurrencySymbol}${formatLargeNumber(
                          totalValueInQuoteCurrency
                        )}`
                      : formatCurrencyValue(
                          totalValueInQuoteCurrency,
                          quoteCurrencyCode,
                          quoteCurrencySymbol
                        )}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={colors.text + "70"}
                    style={styles.smallCopyIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Exchange rate info - glassmorphism design */}
        <View
          style={[
            styles.exchangeRateContainer,
            {
              backgroundColor: isDarkMode
                ? "rgb(47, 47, 47)"
                : "rgb(255, 255, 255)",
              borderColor: isDarkMode
                ? colors.border
                : "rgba(230, 235, 240, 0.9)",
            },
          ]}
        >
          <View style={styles.exchangeRateContent}>
            <View style={styles.exchangeRateHeader}>
              <TouchableOpacity
                style={[
                  styles.refreshButton,
                  isRefreshing && { backgroundColor: colors.primary + "15" },
                ]}
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
              {isRefreshing && (
                <Text
                  style={[styles.refreshingLabel, { color: colors.primary }]}
                >
                  Updating...
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => copyToClipboard(exchangeRateText, "Exchange rate")}
              style={styles.valueWithCopyContainer}
            >
              <Text
                style={[styles.exchangeRateValue, { color: colors.primary }]}
              >
                {exchangeRateText}
              </Text>
              <MaterialIcons
                name="content-copy"
                size={14}
                color={colors.primary + "70"}
                style={styles.smallCopyIcon}
              />
            </TouchableOpacity>
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
                    ? "rgb(47, 47, 47)"
                    : "rgb(255, 255, 255)",
                  borderColor: isDarkMode
                    ? colors.border
                    : "rgba(230, 235, 240, 0.9)",
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
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      standardPipValues.accountValue,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    "Standard lot pip value"
                  )
                }
                style={styles.lotSizeValueContainer}
              >
                <Text
                  style={[styles.lotSizeValue, { color: colors.primary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.5}
                >
                  {standardPipValues.accountValue > 10000
                    ? `${accountCurrency.symbol}${formatLargeNumber(
                        standardPipValues.accountValue
                      )}`
                    : formatPipValue(
                        standardPipValues.accountValue,
                        accountCurrency.code,
                        accountCurrency.symbol
                      )}
                </Text>
                <MaterialIcons
                  name="content-copy"
                  size={12}
                  color={colors.primary + "70"}
                  style={styles.lotSizeCopyIcon}
                />
              </TouchableOpacity>
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
                    ? "rgb(47, 47, 47)"
                    : "rgb(255, 255, 255)",
                  borderColor: isDarkMode
                    ? colors.border
                    : "rgba(230, 235, 240, 0.9)",
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
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      miniPipValues.accountValue,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    "Mini lot pip value"
                  )
                }
                style={styles.lotSizeValueContainer}
              >
                <Text
                  style={[styles.lotSizeValue, { color: colors.primary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.5}
                >
                  {miniPipValues.accountValue > 10000
                    ? `${accountCurrency.symbol}${formatLargeNumber(
                        miniPipValues.accountValue
                      )}`
                    : formatPipValue(
                        miniPipValues.accountValue,
                        accountCurrency.code,
                        accountCurrency.symbol
                      )}
                </Text>
                <MaterialIcons
                  name="content-copy"
                  size={12}
                  color={colors.primary + "70"}
                  style={styles.lotSizeCopyIcon}
                />
              </TouchableOpacity>
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
                    ? "rgb(47, 47, 47)"
                    : "rgb(255, 255, 255)",
                  borderColor: isDarkMode
                    ? colors.border
                    : "rgba(230, 235, 240, 0.9)",
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
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      microPipValues.accountValue,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    "Micro lot pip value"
                  )
                }
                style={styles.lotSizeValueContainer}
              >
                <Text
                  style={[styles.lotSizeValue, { color: colors.primary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.5}
                >
                  {microPipValues.accountValue > 10000
                    ? `${accountCurrency.symbol}${formatLargeNumber(
                        microPipValues.accountValue
                      )}`
                    : formatPipValue(
                        microPipValues.accountValue,
                        accountCurrency.code,
                        accountCurrency.symbol
                      )}
                </Text>
                <MaterialIcons
                  name="content-copy"
                  size={12}
                  color={colors.primary + "70"}
                  style={styles.lotSizeCopyIcon}
                />
              </TouchableOpacity>
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
                    ? "rgb(47, 47, 47)"
                    : "rgb(255, 255, 255)",
                  borderColor: isDarkMode
                    ? colors.border
                    : "rgba(230, 235, 240, 0.9)",
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
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    formatPipValue(
                      nanoPipValues.accountValue,
                      accountCurrency.code,
                      accountCurrency.symbol
                    ),
                    "Nano lot pip value"
                  )
                }
                style={styles.lotSizeValueContainer}
              >
                <Text
                  style={[styles.lotSizeValue, { color: colors.primary }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.5}
                >
                  {nanoPipValues.accountValue > 10000
                    ? `${accountCurrency.symbol}${formatLargeNumber(
                        nanoPipValues.accountValue
                      )}`
                    : formatPipValue(
                        nanoPipValues.accountValue,
                        accountCurrency.code,
                        accountCurrency.symbol
                      )}
                </Text>
                <MaterialIcons
                  name="content-copy"
                  size={12}
                  color={colors.primary + "70"}
                  style={styles.lotSizeCopyIcon}
                />
              </TouchableOpacity>
              <Text style={[styles.lotSizePerPip, { color: colors.subtext }]}>
                per pip
              </Text>
            </View>
          </View>
        </View>

        {/* Save as PDF Button */}
        <View style={styles.saveButtonContainer}>
          <View style={styles.saveButtonsRow}>
            <TouchableOpacity
              style={[
                styles.saveAsPdfButtonWrapper,
                styles.historyButtonWrapper,
              ]}
              onPress={handleSaveToHistory}
            >
              <LinearGradient
                colors={[
                  "rgba(100, 120, 200, 0.85)",
                  "rgba(50, 80, 150, 0.85)",
                ]}
                start={getGradient("secondary").start}
                end={getGradient("secondary").end}
                style={styles.saveAsPdfButton}
              >
                <MaterialIcons name="history" size={18} color="#fff" />
                <Text style={styles.saveAsPdfButtonText}>Save to History</Text>
              </LinearGradient>
            </TouchableOpacity>

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
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  pipDecimalPlacesLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 3,
  },
  heroValueContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "85%",
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
    flexShrink: 1,
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
    maxWidth: "30%",
  },
  dataValue: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
    maxWidth: "90%",
  },
  dataDivider: {
    height: 1,
    marginVertical: 3,
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
    textAlign: "center",
    flexShrink: 1,
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
  },
  saveButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveAsPdfButtonWrapper: {
    flex: 0.55,
    borderRadius: 12,
    overflow: "hidden",
  },
  historyButtonWrapper: {
    marginRight: 8,
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
  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    borderRadius: 28,
  },
  refreshingText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  refreshingLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  infoButtonInner: {
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  copyableValue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  copyIcon: {
    marginLeft: 8,
    opacity: 0.7,
  },
  valueWithCopyContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "65%",
    justifyContent: "flex-end",
  },
  smallCopyIcon: {
    marginLeft: 5,
    opacity: 0.7,
    flexShrink: 0,
  },
  lotSizeValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
    maxWidth: "90%",
  },
  lotSizeCopyIcon: {
    marginLeft: 5,
    opacity: 0.7,
  },
  currencyPairIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  heroIcon: {
    width: 40,
    height: 25,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  iconSeparator: {
    marginHorizontal: 10,
  },
});

export default ResultCard;
