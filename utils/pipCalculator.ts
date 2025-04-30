import {
  CurrencyPair,
  getCurrencyByCode,
  getCurrencyPairByName,
} from "../constants/currencies";

/**
 * Calculate pip value in quote currency
 * This follows standard forex pip calculation used by professional trading platforms
 * and now supports cryptocurrency pairs
 */
export const calculatePipValueInQuoteCurrency = (
  currencyPair: CurrencyPair,
  positionSize: number,
  pipCount: number,
  pipDecimalPlaces?: number
): number => {
  const baseCurrency = getCurrencyByCode(currencyPair.base);
  const quoteCurrency = getCurrencyByCode(currencyPair.quote);

  // Use pipDecimalPlaces from pair definition if not explicitly provided
  // This ensures consistency with the defined decimal places in the currency pair
  const effectivePipDecimalPlaces =
    pipDecimalPlaces ?? currencyPair.pipDecimalPlaces;

  // For JPY pairs, pip value is different by default, but can be overridden
  const isJpyPair = currencyPair.quote === "JPY";

  // For crypto pairs we may want to use different pip decimal places
  const isCryptoPair = baseCurrency?.isCrypto || quoteCurrency?.isCrypto;

  // Calculate pip value based on decimal places
  let pipValue: number;

  if (pipDecimalPlaces === 0) {
    // Special case for 0th decimal place (whole units)
    pipValue = 1;
  } else {
    // For all other decimal places, calculate dynamically
    pipValue = Math.pow(10, -effectivePipDecimalPlaces);
  }

  // Calculate pip value in quote currency for a single pip
  const singlePipValue = positionSize * pipValue;

  // Return single pip value (we handle multiplying by pip count elsewhere)
  return singlePipValue;
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
 * Falls back to the pair's defined pipDecimalPlaces
 */
export const getPipDecimalPlaces = (currencyPairName: string): number => {
  const pair = getCurrencyPairByName(currencyPairName);
  if (pair) {
    return pair.pipDecimalPlaces;
  }

  // Legacy fallback behavior if pair not found
  const pairParts = currencyPairName.split("/");
  if (pairParts.length === 2) {
    const quoteCurrency = pairParts[1];
    const currency = getCurrencyByCode(quoteCurrency);

    // Crypto pairs typically use more decimal places
    if (currency?.isCrypto) {
      // Bitcoin uses 8 decimal places
      if (quoteCurrency === "BTC") return 8;
      // Most other cryptocurrencies use 6 decimal places
      return 6;
    }

    // JPY has 2 decimal places for pips by default, everything else has 4
    return quoteCurrency === "JPY" ? 2 : 4;
  }

  return 4; // Default fallback
};

/**
 * Format currency value for display with proper precision
 */
export const formatCurrencyValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  const currency = getCurrencyByCode(currencyCode);

  // Format with appropriate decimal places based on currency
  let decimalPlaces = 2; // Default for most currencies

  if (currencyCode === "JPY") {
    decimalPlaces = 0;
  } else if (currency?.isCrypto) {
    // Cryptocurrencies typically need more decimal places
    if (currencyCode === "BTC") {
      decimalPlaces = 8;
    } else {
      decimalPlaces = 6;
    }
  }

  // For very large values from 0th decimal place calculations, reduce decimal places
  if (value > 10000) {
    decimalPlaces = Math.min(decimalPlaces, 0);
  }

  // Format with commas for thousands while preserving decimal places
  return `${currencySymbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })}`;
};

/**
 * Format pip value for display with proper precision
 */
export const formatPipValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  const currency = getCurrencyByCode(currencyCode);

  // Format with appropriate precision for pip values
  let decimalPlaces = 2; // Default for most currencies

  if (currencyCode === "JPY") {
    decimalPlaces = 0;
  } else if (currency?.isCrypto) {
    // Cryptocurrencies typically need more decimal places
    if (currencyCode === "BTC") {
      decimalPlaces = 8;
    } else {
      decimalPlaces = 6;
    }
  }

  // For very large values from 0th decimal place calculations, reduce decimal places
  if (value > 10000) {
    decimalPlaces = Math.min(decimalPlaces, 0);
  } else if (value < 0.01 && value > 0) {
    // For very small values, show more decimal places
    decimalPlaces = Math.max(decimalPlaces, 4);

    // For cryptocurrencies with very small values, show even more precision
    if (currency?.isCrypto) {
      decimalPlaces = Math.max(decimalPlaces, 8);
    }
  }

  // Format with commas for thousands while preserving decimal places
  return `${currencySymbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })}`;
};
