import { Currency, CurrencyPair } from "./currencies";

// Define interfaces for each asset type
export interface Index {
  code: string;
  name: string;
  countryCode: string;
  type: "index";
}

export interface Commodity {
  code: string;
  name: string;
  category: "energy" | "metals";
  countryCode: string; // Generic flag for commodities
  type: "commodity";
}

export interface Cryptocurrency {
  code: string;
  name: string;
  countryCode: string; // Generic crypto flag
  type: "crypto";
}

// Unified Asset interface
export interface Asset {
  code: string;
  name: string;
  type: "currency" | "index" | "commodity" | "crypto";
  countryCode: string;
  symbol?: string; // Optional symbol, mainly for currencies
}

// Asset pair interface to replace CurrencyPair for broader usage
export interface AssetPair {
  name: string;
  base: string;
  quote: string;
  baseType: "currency" | "index" | "commodity" | "crypto";
  quoteType: "currency";
  pipDecimalPlaces: number;
  group: string;
}

// List of Indices
export const indices: Index[] = [
  { code: "UK100", name: "FTSE 100", countryCode: "GB", type: "index" },
  { code: "GER30", name: "DAX 30", countryCode: "DE", type: "index" },
  { code: "SPX500", name: "S&P 500", countryCode: "US", type: "index" },
  { code: "FRA40", name: "CAC 40", countryCode: "FR", type: "index" },
  { code: "JPN225", name: "Nikkei 225", countryCode: "JP", type: "index" },
  { code: "ESP35", name: "IBEX 35", countryCode: "ES", type: "index" },
  { code: "NAS100", name: "NASDAQ 100", countryCode: "US", type: "index" },
  { code: "USA30", name: "Dow Jones 30", countryCode: "US", type: "index" },
  { code: "HKG33", name: "Hang Seng", countryCode: "HK", type: "index" },
  { code: "AUS200", name: "ASX 200", countryCode: "AU", type: "index" },
];

// List of Commodities
export const commodities: Commodity[] = [
  // Energy
  {
    code: "UKOIL",
    name: "Brent Crude Oil",
    category: "energy",
    countryCode: "GB",
    type: "commodity",
  },
  {
    code: "NATGAS",
    name: "Natural Gas",
    category: "energy",
    countryCode: "US",
    type: "commodity",
  },

  // Metals
  {
    code: "XAU",
    name: "Gold",
    category: "metals",
    countryCode: "US",
    type: "commodity",
  },
  {
    code: "XAG",
    name: "Silver",
    category: "metals",
    countryCode: "US",
    type: "commodity",
  },
  {
    code: "XPT",
    name: "Platinum",
    category: "metals",
    countryCode: "US",
    type: "commodity",
  },
  {
    code: "XPD",
    name: "Palladium",
    category: "metals",
    countryCode: "US",
    type: "commodity",
  },
];

// List of top Cryptocurrencies
export const cryptocurrencies: Cryptocurrency[] = [
  { code: "BTC", name: "Bitcoin", countryCode: "CRYPTO", type: "crypto" },
  { code: "ETH", name: "Ethereum", countryCode: "CRYPTO", type: "crypto" },
  { code: "ADA", name: "Cardano", countryCode: "CRYPTO", type: "crypto" },
  { code: "SOL", name: "Solana", countryCode: "CRYPTO", type: "crypto" },
  { code: "DOGE", name: "Dogecoin", countryCode: "CRYPTO", type: "crypto" },
  { code: "DOT", name: "Polkadot", countryCode: "CRYPTO", type: "crypto" },
  { code: "BNB", name: "Binance Coin", countryCode: "CRYPTO", type: "crypto" },
  { code: "XRP", name: "Ripple", countryCode: "CRYPTO", type: "crypto" },
  { code: "LTC", name: "Litecoin", countryCode: "CRYPTO", type: "crypto" },
  { code: "LINK", name: "Chainlink", countryCode: "CRYPTO", type: "crypto" },
];

// Create asset pairs from different combinations
export const createAssetPairs = (): AssetPair[] => {
  const pairs: AssetPair[] = [];

  // Add indices vs USD
  indices.forEach((index) => {
    pairs.push({
      name: `${index.code}/USD`,
      base: index.code,
      quote: "USD",
      baseType: "index",
      quoteType: "currency",
      pipDecimalPlaces: 2,
      group: "Indices",
    });
  });

  // Add commodities vs USD
  commodities.forEach((commodity) => {
    pairs.push({
      name: `${commodity.code}/USD`,
      base: commodity.code,
      quote: "USD",
      baseType: "commodity",
      quoteType: "currency",
      pipDecimalPlaces: commodity.category === "metals" ? 2 : 4,
      group: commodity.category === "metals" ? "Metals" : "Energy",
    });
  });

  // Add cryptocurrencies vs USD
  cryptocurrencies.forEach((crypto) => {
    pairs.push({
      name: `${crypto.code}/USD`,
      base: crypto.code,
      quote: "USD",
      baseType: "crypto",
      quoteType: "currency",
      pipDecimalPlaces: 2,
      group: "Crypto",
    });
  });

  return pairs;
};

// Getter functions
export const getAssetByCode = (
  code: string,
  type?: "currency" | "index" | "commodity" | "crypto"
): Asset | undefined => {
  // Search in appropriate asset type arrays based on the provided type
  if (!type || type === "currency") {
    const currency = require("./currencies").getCurrencyByCode(code);
    if (currency) return { ...currency, type: "currency" };
  }

  if (!type || type === "index") {
    const index = indices.find((idx) => idx.code === code);
    if (index) return index;
  }

  if (!type || type === "commodity") {
    const commodity = commodities.find((com) => com.code === code);
    if (commodity) return commodity;
  }

  if (!type || type === "crypto") {
    const crypto = cryptocurrencies.find((cry) => cry.code === code);
    if (crypto) return crypto;
  }

  return undefined;
};

// Filter asset pairs by search term
export const filterAssetPairs = (
  searchTerm: string,
  pairs: AssetPair[]
): AssetPair[] => {
  const term = searchTerm.toLowerCase();
  return pairs.filter(
    (pair) =>
      pair.name.toLowerCase().includes(term) ||
      pair.base.toLowerCase().includes(term) ||
      pair.quote.toLowerCase().includes(term) ||
      pair.group.toLowerCase().includes(term)
  );
};

// Get all available asset groups
export const getAssetPairGroups = (pairs: AssetPair[]): string[] => {
  const groups = new Set<string>();
  pairs.forEach((pair) => groups.add(pair.group));
  return Array.from(groups).sort();
};
