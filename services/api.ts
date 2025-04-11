import { Currency } from "../constants/currencies";
import NetInfo from "@react-native-community/netinfo";

// Fetch exchange rate from API
export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    // Check network connectivity
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      throw new Error("No internet connection");
    }

    // If same currency, return 1
    if (fromCurrency === toCurrency) {
      return 1;
    }

    // Try to use Forex API (higher reliability)
    // First try with Alpha Vantage API (has good forex data)
    try {
      const API_KEY = "demo"; // Replace with your Alpha Vantage API key in production
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        if (
          data["Realtime Currency Exchange Rate"] &&
          data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        ) {
          return parseFloat(
            data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        }
      }
    } catch (alphaError) {
      console.log("Alpha Vantage API error, trying backup API:", alphaError);
    }

    // Fallback to ExchangeRate-API
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Check if the API returned an error
    if (data.error) {
      throw new Error(data.error);
    }

    // Check if we have rates and the specific currency
    if (!data.rates || !data.rates[toCurrency]) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} to ${toCurrency}`
      );
    }

    return data.rates[toCurrency];
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
      throw new Error("No internet connection");
    }

    // Use ExchangeRate-API (free tier)
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${baseCurrency}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Check if the API returned an error
    if (data.error) {
      throw new Error(data.error);
    }

    // Check if we have rates
    if (!data.rates) {
      throw new Error(`Exchange rates not available for ${baseCurrency}`);
    }

    return data.rates;
  } catch (error) {
    console.error("Error fetching all exchange rates:", error);
    throw error;
  }
};
