/**
 * Fetch exchange rate from base to target currency
 * Use a fallback value if API call fails
 */
export const fetchExchangeRate = async (
  baseCurrency: string,
  targetCurrency: string
): Promise<number> => {
  try {
    // If currencies are the same, return 1:1 exchange rate
    if (baseCurrency === targetCurrency) {
      return 1;
    }

    // Use a free exchange rate API (replace with your preferred provider)
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${targetCurrency}`
    );
    const data = await response.json();

    if (data && data.rates && data.rates[targetCurrency]) {
      return data.rates[targetCurrency];
    } else {
      console.error("Invalid exchange rate data:", data);
      return getFallbackExchangeRate(baseCurrency, targetCurrency);
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return getFallbackExchangeRate(baseCurrency, targetCurrency);
  }
};

/**
 * Get fallback exchange rate for major currency pairs
 * Used when API call fails
 */
const getFallbackExchangeRate = (
  baseCurrency: string,
  targetCurrency: string
): number => {
  // Common exchange rates as fallbacks (very approximate)
  const fallbackRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92,
      GBP: 0.79,
      JPY: 150.0,
      AUD: 1.51,
      CAD: 1.35,
      CHF: 0.9,
      NZD: 1.64,
    },
    EUR: {
      USD: 1.09,
      GBP: 0.86,
      JPY: 164.0,
      AUD: 1.65,
      CAD: 1.47,
      CHF: 0.98,
      NZD: 1.78,
    },
    GBP: {
      USD: 1.27,
      EUR: 1.17,
      JPY: 191.0,
      AUD: 1.92,
      CAD: 1.71,
      CHF: 1.14,
      NZD: 2.08,
    },
    JPY: {
      USD: 0.0067,
      EUR: 0.0061,
      GBP: 0.0052,
      AUD: 0.01,
      CAD: 0.009,
      CHF: 0.006,
      NZD: 0.0109,
    },
  };

  // Try to get the fallback rate
  if (
    fallbackRates[baseCurrency] &&
    fallbackRates[baseCurrency][targetCurrency]
  ) {
    return fallbackRates[baseCurrency][targetCurrency];
  }

  // If reverse rate exists, use inverse
  if (
    fallbackRates[targetCurrency] &&
    fallbackRates[targetCurrency][baseCurrency]
  ) {
    return 1 / fallbackRates[targetCurrency][baseCurrency];
  }

  // Default fallback is 1:1 (not accurate but prevents crashes)
  return 1;
};
