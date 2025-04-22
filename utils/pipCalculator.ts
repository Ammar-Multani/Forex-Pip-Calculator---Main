import { CurrencyPair } from "../constants/currencies";
import { AssetPair } from "../constants/assetTypes";

/**
 * Calculate pip value in quote currency
 * This follows standard forex pip calculation used by professional trading platforms
 * Updated to handle different asset types
 */
export const calculatePipValueInQuoteCurrency = (
  pair: CurrencyPair | AssetPair,
  positionSize: number,
  pipCount: number,
  pipDecimalPlaces: number = 4
): number => {
  // For JPY pairs, pip value is different by default, but can be overridden
  const isJpyPair = pair.quote === "JPY";

  // If pipDecimalPlaces is provided, use that, otherwise use default for the currency/asset
  let pipValue: number;

  // Handle different asset types
  if ("baseType" in pair) {
    switch (pair.baseType) {
      case "crypto":
        // Crypto typically uses 8 decimal places unless specified
        pipValue = pipDecimalPlaces === 0 ? 1 : Math.pow(10, -pipDecimalPlaces);
        break;
      case "index":
        // Indices typically use 2 decimal places unless specified
        pipValue = pipDecimalPlaces === 0 ? 1 : Math.pow(10, -pipDecimalPlaces);
        break;
      case "commodity":
        // Commodities use different decimal places based on type
        if (pair.base.startsWith("XAU") || pair.base.startsWith("XAG")) {
          // Precious metals typically use 2 decimal places
          pipValue =
            pipDecimalPlaces === 0 ? 1 : Math.pow(10, -pipDecimalPlaces);
        } else {
          // Other commodities use 4 decimal places by default
          pipValue =
            pipDecimalPlaces === 0 ? 1 : Math.pow(10, -pipDecimalPlaces);
        }
        break;
      default:
        // Handle currency pairs as before
        if (isJpyPair && pipDecimalPlaces === 4) {
          pipValue = 0.01; // Default for JPY pairs
        } else if (pipDecimalPlaces === 0) {
          pipValue = 1;
        } else {
          pipValue = Math.pow(10, -pipDecimalPlaces);
        }
    }
  } else {
    // Legacy support for CurrencyPair type
    if (isJpyPair && pipDecimalPlaces === 4) {
      pipValue = 0.01;
    } else if (pipDecimalPlaces === 0) {
      pipValue = 1;
    } else {
      pipValue = Math.pow(10, -pipDecimalPlaces);
    }
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
 */
export const getPipDecimalPlaces = (currencyCode: string): number => {
  // JPY has 2 decimal places for pips by default, everything else has 4
  return currencyCode === "JPY" ? 2 : 4;
};

/**
 * Format currency value with appropriate decimal places
 */
export const formatCurrencyValue = (
  value: number,
  currencyCode: string
): string => {
  // JPY typically shows no decimal places
  const decimalPlaces = currencyCode === "JPY" ? 0 : 2;
  return value.toFixed(decimalPlaces);
};

/**
 * Format pip value with appropriate decimal places based on asset type
 */
export const formatPipValue = (
  value: number,
  assetCode: string,
  assetType: string = "currency"
): string => {
  let decimalPlaces = 2; // Default

  switch (assetType) {
    case "crypto":
      decimalPlaces = 8; // Most cryptos use 8 decimal places
      break;
    case "index":
      decimalPlaces = 2; // Indices typically use 2 decimal places
      break;
    case "commodity":
      // Precious metals use 2, others use 4
      decimalPlaces =
        assetCode.startsWith("XAU") || assetCode.startsWith("XAG") ? 2 : 4;
      break;
    default:
      // For currencies, JPY pairs use 2 decimals, others use 4
      decimalPlaces = assetCode === "JPY" ? 2 : 4;
  }

  return value.toFixed(decimalPlaces);
};
