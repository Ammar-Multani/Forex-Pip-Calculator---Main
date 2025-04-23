// List of major currencies and currency pairs
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode: string; // ISO country code for flags
}

export interface CurrencyPair {
  name: string;
  base: string;
  quote: string;
  pipDecimalPlaces: number;
  group: string;
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", countryCode: "US" },
  { code: "EUR", name: "Euro", symbol: "€", countryCode: "EU" },
  { code: "GBP", name: "British Pound", symbol: "£", countryCode: "GB" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", countryCode: "JP" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", countryCode: "AU" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", countryCode: "CA" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", countryCode: "CH" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", countryCode: "NZ" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", countryCode: "CN" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", countryCode: "HK" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", countryCode: "SG" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", countryCode: "SE" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", countryCode: "NO" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$", countryCode: "MX" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", countryCode: "IN" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", countryCode: "BR" },
  { code: "ZAR", name: "South African Rand", symbol: "R", countryCode: "ZA" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", countryCode: "RU" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", countryCode: "TR" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", countryCode: "PL" },
];

export const currencyPairs: CurrencyPair[] = [
  // Major Pairs
  {
    name: "EUR/USD",
    base: "EUR",
    quote: "USD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
  {
    name: "GBP/USD",
    base: "GBP",
    quote: "USD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
  {
    name: "USD/JPY",
    base: "USD",
    quote: "JPY",
    pipDecimalPlaces: 2,
    group: "Major",
  },
  {
    name: "USD/CHF",
    base: "USD",
    quote: "CHF",
    pipDecimalPlaces: 4,
    group: "Major",
  },
  {
    name: "USD/CAD",
    base: "USD",
    quote: "CAD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
  {
    name: "AUD/USD",
    base: "AUD",
    quote: "USD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
  {
    name: "NZD/USD",
    base: "NZD",
    quote: "USD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find((currency) => currency.code === code);
};

export const getCurrencyPairByName = (
  name: string
): CurrencyPair | undefined => {
  return currencyPairs.find((pair) => pair.name === name);
};

export const getCurrencyPairGroups = (): string[] => {
  const groups = new Set(currencyPairs.map((pair) => pair.group));
  return Array.from(groups);
};

export const getCurrencyPairsByGroup = (group: string): CurrencyPair[] => {
  return currencyPairs.filter((pair) => pair.group === group);
};

export const filterCurrencies = (searchTerm: string): Currency[] => {
  const term = searchTerm.toLowerCase();
  return currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term)
  );
};

export const filterCurrencyPairs = (searchTerm: string): CurrencyPair[] => {
  const term = searchTerm.toLowerCase();
  return currencyPairs.filter((pair) => pair.name.toLowerCase().includes(term));
}; 