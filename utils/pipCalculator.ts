import { CurrencyPair } from "../constants/currencies";

/**
 * Calculate pip value in quote currency
 * This follows standard forex pip calculation used by professional trading platforms
 */
export const calculatePipValueInQuoteCurrency = (
  currencyPair: CurrencyPair,
  positionSize: number,
  pipCount: number
): number => {
  // For JPY pairs, pip value is different
  const isJpyPair = currencyPair.quote === "JPY";
  const pipValue = isJpyPair ? 0.01 : 0.0001;

  // Calculate pip value in quote currency
  return positionSize * pipValue * pipCount;
};

/**
 * Calculate pip value in account currency
 * Handles all possible currency pair and account currency combinations
 * Updated to match reference app calculation logic
 */
export const calculatePipValueInAccountCurrency = (
  pipValueInQuoteCurrency: number,
  quoteCurrency: string,
  accountCurrency: string,
  exchangeRate: number
): number => {
  // If quote currency is the same as account currency, no conversion needed
  if (quoteCurrency === accountCurrency) {
    return pipValueInQuoteCurrency;
  }

  // Use direct multiplication - this is how most forex calculators work
  // Professional trading platforms use direct multiplication by the exchange rate
  return pipValueInQuoteCurrency * exchangeRate;
};

/**
 * Get the number of decimal places to use for a specific currency in pip calculations
 */
export const getPipDecimalPlaces = (currencyCode: string): number => {
  // JPY has 2 decimal places for pips, everything else has 4
  return currencyCode === "JPY" ? 2 : 4;
};

/**
 * Format currency value for display with proper precision
 */
export const formatCurrencyValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  // Format with 2 decimal places for most currencies, 0 for JPY
  const decimalPlaces = currencyCode === "JPY" ? 0 : 3;

  return `${currencySymbol}${value.toFixed(decimalPlaces)}`;
};

/**
 * Format pip value for display with proper precision
 */
export const formatPipValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  // Format with more precision for pip values, matching professional trading platforms
  const decimalPlaces = currencyCode === "JPY" ? 0 : 3;

  return `${currencySymbol}${value.toFixed(decimalPlaces)}`;
};
