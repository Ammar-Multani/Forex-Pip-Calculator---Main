import { CurrencyPair } from '../constants/currencies';

// Calculate pip value in quote currency
export const calculatePipValueInQuoteCurrency = (
  currencyPair: CurrencyPair,
  positionSize: number,
  pipCount: number
): number => {
  // For JPY pairs, pip value is different
  const isJpyPair = currencyPair.quote === 'JPY';
  const pipValue = isJpyPair ? 0.01 : 0.0001;
  
  // Calculate pip value in quote currency
  return positionSize * pipValue * pipCount;
};

// Calculate pip value in account currency
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
  
  // Convert pip value to account currency
  return pipValueInQuoteCurrency * exchangeRate;
};

// Format currency value for display
export const formatCurrencyValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  // Format with 2 decimal places for most currencies, 0 for JPY
  const decimalPlaces = currencyCode === 'JPY' ? 0 : 2;
  
  return `${currencySymbol}${value.toFixed(decimalPlaces)}`;
};

// Format pip value for display
export const formatPipValue = (
  value: number,
  currencyCode: string,
  currencySymbol: string
): string => {
  // Format with more precision for pip values
  const decimalPlaces = currencyCode === 'JPY' ? 2 : 4;
  
  return `${currencySymbol}${value.toFixed(decimalPlaces)}`;
};