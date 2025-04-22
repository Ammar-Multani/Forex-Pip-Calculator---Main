import { Currency } from "../constants/currencies";
import { Platform } from "react-native";
import { isWeb } from "../utils/platform";
import env from "../config/env";

// Import NetInfo conditionally to avoid web issues
let NetInfo: any = null;
if (!isWeb) {
  NetInfo = require("@react-native-community/netinfo").default;
}

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
  } catch (error: any) {
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

// Check network connectivity with fallback for web
const checkNetworkConnectivity = async (): Promise<boolean> => {
  if (isWeb) {
    // For web, assume connected but can implement a ping test if needed
    return true;
  } else {
    try {
      const netInfoState = await NetInfo.fetch();
      return netInfoState.isConnected;
    } catch (error) {
      console.error("Error checking network connectivity:", error);
      return false;
    }
  }
};

// Core function to fetch exchange rate (used internally)
const fetchExchangeRateCore = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  // Check network connectivity
  const isConnected = await checkNetworkConnectivity();
  if (!isConnected) {
    throw new Error("No internet connection. Real-time rates unavailable.");
  }

  // If same currency, return 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    let apiUrl = "";

    // Use a CORS proxy for web requests
    if (isWeb) {
      // Using a CORS proxy service for web
      apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${fromCurrency}${toCurrency}`
      )}`;
    } else {
      apiUrl = `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${fromCurrency}${toCurrency}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `TraderMade API request failed with status ${response.status}`
      );
    }
    console.log("key", env.traderMadeApiKey);
    // Handle different response formats for CORS proxy vs direct
    let jsonData;
    if (isWeb) {
      const proxyResponse = await response.json();
      if (proxyResponse.contents) {
        jsonData = JSON.parse(proxyResponse.contents);
      } else {
        throw new Error("Invalid CORS proxy response format");
      }
    } else {
      jsonData = await response.json();
    }

    let rate: number | null = null;

    // Parse the response to get the exchange rate
    if (jsonData && jsonData.quotes && jsonData.quotes.length > 0) {
      const quote = jsonData.quotes[0];
      if (quote && (quote.mid || quote.price)) {
        rate = parseFloat(quote.mid || quote.price);
      }
    }

    if (rate === null) {
      throw new Error("Could not find exchange rate in API response");
    }

    return rate;
  } catch (error: any) {
    console.error(`Error fetching exchange rate from API: ${error.message}`);
    // Rethrow error since we're not using fallbacks anymore
    throw error;
  }
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
  const isConnected = await checkNetworkConnectivity();
  if (!isConnected) {
    throw new Error("No internet connection. Real-time rates unavailable.");
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

  try {
    let apiUrl = "";

    // Use a CORS proxy for web requests
    if (isWeb) {
      // Using a CORS proxy service for web
      apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${pairs}`
      )}`;
    } else {
      apiUrl = `https://marketdata.tradermade.com/api/v1/live?api_key=${env.traderMadeApiKey}&currency=${pairs}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `TraderMade API request failed with status ${response.status}`
      );
    }

    // Handle different response formats for CORS proxy vs direct
    let jsonData;
    if (isWeb) {
      const proxyResponse = await response.json();
      if (proxyResponse.contents) {
        jsonData = JSON.parse(proxyResponse.contents);
      } else {
        throw new Error("Invalid CORS proxy response format");
      }
    } else {
      jsonData = await response.json();
    }

    if (!jsonData || !jsonData.quotes || !Array.isArray(jsonData.quotes)) {
      throw new Error("Invalid response format from TraderMade API");
    }

    // Process the response
    const rates: Record<string, number> = {};

    jsonData.quotes.forEach((quote: any) => {
      if (!quote || !quote.currency) return;

      // Extract the target currency from the pair name (e.g., USDEUR -> EUR)
      const quoteCurrency = quote.currency.substring(baseCurrency.length);
      const rate = quote.mid || quote.price;

      if (quoteCurrency && rate) {
        rates[quoteCurrency] = parseFloat(rate);
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
  } catch (error: any) {
    console.error(`Error fetching all exchange rates: ${error.message}`);
    throw error;
  }
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
