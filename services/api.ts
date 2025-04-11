import { Currency } from '../constants/currencies';

// Mock exchange rates for fallback
const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.78,
    JPY: 150.25,
    AUD: 1.52,
    CAD: 1.36,
    CHF: 0.89,
    NZD: 1.65,
    CNY: 7.24,
    HKD: 7.81,
    SGD: 1.35,
    SEK: 10.42,
    NOK: 10.68,
    MXN: 16.82,
    INR: 83.45,
    BRL: 5.16,
    ZAR: 18.35,
    RUB: 91.20,
    TRY: 32.15,
    PLN: 3.95,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.85,
    JPY: 163.35,
    AUD: 1.65,
    CAD: 1.48,
    CHF: 0.97,
    NZD: 1.79,
    CNY: 7.87,
    HKD: 8.49,
    SGD: 1.47,
    SEK: 11.32,
    NOK: 11.61,
    MXN: 18.28,
    INR: 90.72,
    BRL: 5.61,
    ZAR: 19.95,
    RUB: 99.15,
    TRY: 34.95,
    PLN: 4.29,
  },
  // Add more base currencies as needed
};

// Generate all possible currency pair combinations for mock data
Object.keys(mockExchangeRates).forEach(baseCurrency => {
  Object.keys(mockExchangeRates[baseCurrency]).forEach(quoteCurrency => {
    // Ensure the reverse pair exists
    if (!mockExchangeRates[quoteCurrency]) {
      mockExchangeRates[quoteCurrency] = {};
    }
    
    // Add the reverse rate if it doesn't exist
    if (mockExchangeRates[quoteCurrency][baseCurrency] === undefined) {
      mockExchangeRates[quoteCurrency][baseCurrency] = 1 / mockExchangeRates[baseCurrency][quoteCurrency];
    }
  });
});

// Fetch exchange rate from API or use mock data
export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    // In a real app, you would fetch from an API like this:
    // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    // const data = await response.json();
    // return data.rates[toCurrency];
    
    // For now, use mock data
    if (fromCurrency === toCurrency) {
      return 1;
    }
    
    if (mockExchangeRates[fromCurrency] && mockExchangeRates[fromCurrency][toCurrency]) {
      return mockExchangeRates[fromCurrency][toCurrency];
    }
    
    // If we don't have a direct rate, try to calculate via USD
    if (mockExchangeRates[fromCurrency]?.USD && mockExchangeRates.USD?.[toCurrency]) {
      return mockExchangeRates[fromCurrency].USD * mockExchangeRates.USD[toCurrency];
    }
    
    // Default fallback
    return 1;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1; // Default to 1 if there's an error
  }
};

// Fetch all exchange rates for a base currency
export const fetchAllExchangeRates = async (baseCurrency: string): Promise<Record<string, number>> => {
  try {
    // In a real app, you would fetch from an API
    // For now, use mock data
    return mockExchangeRates[baseCurrency] || {};
  } catch (error) {
    console.error('Error fetching all exchange rates:', error);
    return {}; // Return empty object if there's an error
  }
};