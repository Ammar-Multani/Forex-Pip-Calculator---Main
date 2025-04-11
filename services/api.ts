import { Currency } from "../constants/currencies";
import NetInfo from "@react-native-community/netinfo";
import env from "../config/env";

// Cache to store recent exchange rates with timestamp
const rateCache: Record<string, { rate: number; timestamp: number }> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// API key - hardcoded for reliability, should match env
const TRADER_MADE_API_KEY = "ixh2QN-O4kmYz52jg3kd";

// Check if a cached rate is still valid
const isCacheValid = (key: string): boolean => {
  if (!rateCache[key]) return false;
  const now = Date.now();
  return now - rateCache[key].timestamp < CACHE_EXPIRY;
};

// Fetch exchange rate from API
export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
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

    // Make API call to TraderMade
    console.log(`Calling TraderMade API for ${fromCurrency}/${toCurrency}`);

    const response = await fetch(
      `https://marketdata.tradermade.com/api/v1/live?api_key=${TRADER_MADE_API_KEY}&currency=${fromCurrency}${toCurrency}`
    );

    if (!response.ok) {
      throw new Error(
        `TraderMade API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    console.log("TraderMade response:", JSON.stringify(data));

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

    console.log(
      `TraderMade API returned rate: ${rate} for ${fromCurrency}/${toCurrency}`
    );

    // Cache the result
    rateCache[cacheKey] = { rate, timestamp: Date.now() };

    return rate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
};

// Fetch all exchange rates for a base currency
export const fetchAllExchangeRates = async (
  baseCurrency: string
): Promise<Record<string, number>> => {
  try {
    // Check network connectivity
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      throw new Error("No internet connection. Real-time rates unavailable.");
    }

    console.log(`Fetching all rates for ${baseCurrency} from TraderMade`);

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
      `https://marketdata.tradermade.com/api/v1/live?api_key=${TRADER_MADE_API_KEY}&currency=${pairs}`
    );

    if (!response.ok) {
      throw new Error(
        `TraderMade API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    console.log("TraderMade response for all rates:", JSON.stringify(data));

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
  } catch (error) {
    console.error("Error fetching all exchange rates:", error);
    throw error;
  }
};
