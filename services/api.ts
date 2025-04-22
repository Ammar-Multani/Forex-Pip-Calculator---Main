import { Currency } from "../constants/currencies";
import NetInfo from "@react-native-community/netinfo";
import env from "../config/env";

// Cache to store recent exchange rates with timestamp
const rateCache: Record<string, { rate: number; timestamp: number }> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// API call throttling mechanism
let isApiCallInProgress = false;
const apiCallQueue: Array<() => Promise<void>> = [];

// Process the next API call in the queue
const processNextApiCall = async () => {
  if (apiCallQueue.length === 0 || isApiCallInProgress) {
    return;
  }

  isApiCallInProgress = true;
  const nextCall = apiCallQueue.shift();

  try {
    await nextCall?.();
  } catch (error) {
    console.error("Error in queued API call:", error);
  } finally {
    isApiCallInProgress = false;
    // Process the next call in the queue
    processNextApiCall();
  }
};

// Queue an API call and return a promise that resolves when the call completes
const queueApiCall = <T>(apiCallFn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    const wrappedCall = async () => {
      try {
        const result = await apiCallFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    apiCallQueue.push(wrappedCall);

    // Start processing the queue if it's not already in progress
    if (!isApiCallInProgress) {
      processNextApiCall();
    }
  });
};

// Check if a cached rate is still valid
const isCacheValid = (key: string): boolean => {
  if (!rateCache[key]) return false;
  const now = Date.now();
  return now - rateCache[key].timestamp < CACHE_EXPIRY;
};

// Core function to fetch exchange rate (used internally)
const fetchExchangeRateCore = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  // Check network connectivity
  const netInfoState = await NetInfo.fetch();
  if (!netInfoState.isConnected) {
    throw new Error("No internet connection. Real-time rates unavailable.");
  }

  // If same currency, return 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  // Check cache first
  const cacheKey = `${fromCurrency}-${toCurrency}`;
  if (isCacheValid(cacheKey)) {
    return rateCache[cacheKey].rate;
  }

  // Check if API key is available
  if (!env.traderMadeApiKey) {
    throw new Error(
      "TraderMade API key is not configured. Please add it in the settings."
    );
  }

  const response = await fetch(
    `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${fromCurrency}${toCurrency}`
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `TraderMade API request failed with status ${response.status}${
        errorText ? ": " + errorText : ""
      }`
    );
  }

  const data = await response.json();

  let rate: number | null = null;

  // Parse the response to get the exchange rate
  if (data && data.quotes && data.quotes.length > 0) {
    const quote = data.quotes[0];
    if (quote && (quote.mid || quote.price)) {
      rate = parseFloat(quote.mid || quote.price);
    }
  }

  if (rate === null) {
    throw new Error("Could not find exchange rate in API response");
  }

  // Cache the result
  rateCache[cacheKey] = { rate, timestamp: Date.now() };

  return rate;
};

// Public API for fetching a single exchange rate
export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    // If same currency, return 1 immediately (no need to queue)
    if (fromCurrency === toCurrency) {
      return 1;
    }

    // Check cache first before queuing
    const cacheKey = `${fromCurrency}-${toCurrency}`;
    if (isCacheValid(cacheKey)) {
      return rateCache[cacheKey].rate;
    }

    // Queue the actual API call
    return await queueApiCall(() =>
      fetchExchangeRateCore(fromCurrency, toCurrency)
    );
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
};

// Core function to fetch all exchange rates (used internally)
const fetchAllExchangeRatesCore = async (
  baseCurrency: string
): Promise<Record<string, number>> => {
  // Check network connectivity
  const netInfoState = await NetInfo.fetch();
  if (!netInfoState.isConnected) {
    throw new Error("No internet connection. Real-time rates unavailable.");
  }

  // Check if API key is available
  if (!env.traderMadeApiKey) {
    throw new Error(
      "TraderMade API key is not configured. Please add it in the settings."
    );
  }

  // TraderMade requires a list of currency pairs for live quotes
  const commonCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "NZD",
    "INR",
  ];

  // Remove base currency from the list if it's there
  const quoteCurrencies = commonCurrencies.filter(
    (curr) => curr !== baseCurrency
  );

  // Format pairs for TraderMade API
  const pairs = quoteCurrencies
    .map((curr) => `${baseCurrency}${curr}`)
    .join(",");

  const response = await fetch(
    `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${pairs}`
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `TraderMade API request failed with status ${response.status}${
        errorText ? ": " + errorText : ""
      }`
    );
  }

  const data = await response.json();

  if (!data || !data.quotes || !Array.isArray(data.quotes)) {
    throw new Error("Invalid response format from TraderMade API");
  }

  // Process the response
  const rates: Record<string, number> = {};

  data.quotes.forEach((quote: any) => {
    if (!quote || !quote.currency) return;

    // Extract the target currency from the pair name (e.g., USDEUR -> EUR)
    const quoteCurrency = quote.currency.substring(baseCurrency.length);
    const rate = quote.mid || quote.price;

    if (quoteCurrency && rate) {
      rates[quoteCurrency] = parseFloat(rate);

      // Also cache individual rates
      const cacheKey = `${baseCurrency}-${quoteCurrency}`;
      rateCache[cacheKey] = {
        rate: parseFloat(rate),
        timestamp: Date.now(),
      };
    }
  });

  if (Object.keys(rates).length === 0) {
    throw new Error("No valid exchange rates found in the response");
  }

  console.log(
    `Successfully fetched ${
      Object.keys(rates).length
    } rates for ${baseCurrency}`
  );
  return rates;
};

// Public API for fetching all exchange rates
export const fetchAllExchangeRates = async (
  baseCurrency: string
): Promise<Record<string, number>> => {
  try {
    // Queue the actual API call
    return await queueApiCall(() => fetchAllExchangeRatesCore(baseCurrency));
  } catch (error) {
    console.error("Error fetching all exchange rates:", error);
    throw error;
  }
};
