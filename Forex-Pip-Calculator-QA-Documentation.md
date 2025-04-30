# Forex Pip Calculator - QA Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [How the App Works](#how-the-app-works)
3. [Calculation Logic](#calculation-logic)
4. [Non-Technical Explanation of Calculations](#non-technical-explanation-of-calculations)
5. [Input Fields](#input-fields)
6. [App Workflow](#app-workflow)
7. [Key Formulas](#key-formulas)
8. [Currency and Exchange Rate Handling](#currency-and-exchange-rate-handling)
9. [Technical Implementation](#technical-implementation)
10. [Testing Guidelines](#testing-guidelines)

## Project Overview

The Forex Pip Calculator is a mobile application designed for forex traders to quickly calculate pip values and position sizes across various currency pairs. A "pip" (percentage in point) is the standard unit of change in a currency pair's price, typically representing the fourth decimal place in most forex quotes (or second decimal for JPY pairs).

**Core Functionality:**

- Calculate pip values for major, minor, and exotic currency pairs
- Support multiple account currencies
- Provide various lot size options (Standard, Mini, Micro, Nano, Custom)
- Save user preferences for future sessions
- Support both light and dark themes
- Deliver responsive design for all device sizes

## How the App Works

The app allows users to:

1. **Select their account currency**: The currency in which their trading account is denominated
2. **Choose a currency pair**: The forex pair they're trading (e.g., EUR/USD, USD/JPY)
3. **Set position size**: Using standard lot sizes or custom units
4. **Enter pip count**: The number of pips they want to calculate
5. **View results**: Showing pip value in both quote currency and account currency

The app performs real-time calculations, converting between currencies as needed, and saving user settings for convenience.

## Calculation Logic

### Pip Value Calculation

The app uses two primary calculations:

1. **Pip Value in Quote Currency**:

   ```
   Pip Value in Quote Currency = Pip Size × Position Size
   ```

2. **Pip Value in Account Currency**:
   ```
   Pip Value in Account Currency = Pip Value in Quote Currency × Exchange Rate
   ```

Where:

- **Pip Size**: Typically 0.0001 for most pairs (0.01 for JPY pairs)
- **Position Size**: Determined by lot type and count
- **Exchange Rate**: Current rate between quote currency and account currency

## Non-Technical Explanation of Calculations

### What is a Pip?

In forex trading, a "pip" is a tiny price movement in the exchange rate between two currencies. Think of it as the smallest step a currency pair's price can take:

- For most currency pairs, a pip is the fourth decimal place (0.0001)
- For Japanese Yen pairs, a pip is the second decimal place (0.01)

For example:

- If EUR/USD moves from 1.1050 to 1.1051, that's a 1 pip movement
- If USD/JPY moves from 115.45 to 115.46, that's a 1 pip movement

### How Lot Sizes Work in Plain Language

A "lot" in forex trading is simply a standardized quantity of currency:

- **Standard Lot**: 100,000 units of the base currency
- **Mini Lot**: 10,000 units
- **Micro Lot**: 1,000 units
- **Nano Lot**: 100 units

Think of lots like buying in bulk — the more units you trade (bigger lot), the more value each pip movement has.

### Step-by-Step App Calculation Flow

Here's exactly how the calculation works in the app:

#### Step 1: Calculate Position Size

First, the app determines how many units of currency you're trading based on your lot selection:

```
If using standard lot types (Standard, Mini, Micro, Nano):
    Position Size = Lot Size Value × Lot Count
If using Custom lot:
    Position Size = Custom Units value
```

**Example:**

- 2 Standard Lots = 100,000 × 2 = 200,000 units
- 5 Micro Lots = 1,000 × 5 = 5,000 units
- Custom 50,000 units = 50,000 units

#### Step 2: Determine Pip Size

The app identifies what value represents 1 pip for the selected currency pair:

```
For most currency pairs: 0.0001 (4th decimal place)
For JPY pairs: 0.01 (2nd decimal place)
Custom decimal places: 10^(-decimal places)
```

**Example:**

- EUR/USD uses 0.0001
- USD/JPY uses 0.01
- If custom decimal places = 3, pip size = 0.001

#### Step 3: Calculate Pip Value in Quote Currency

Next, the app calculates what a single pip is worth in the quote currency:

```
Pip Value in Quote Currency = Position Size × Pip Size
```

**Example:**

- EUR/USD with 1 Standard Lot:

  - Position Size = 100,000
  - Pip Size = 0.0001
  - Pip Value = 100,000 × 0.0001 = $10 per pip

- USD/JPY with 1 Mini Lot:
  - Position Size = 10,000
  - Pip Size = 0.01
  - Pip Value = 10,000 × 0.01 = ¥100 per pip

#### Step 4: Convert to Account Currency (if needed)

If your account currency differs from the quote currency, the app converts the pip value:

```
If Account Currency = Quote Currency:
    Pip Value in Account Currency = Pip Value in Quote Currency
    (no conversion needed, exchange rate = 1)

Otherwise:
    Fetch exchange rate from Quote Currency to Account Currency
    Pip Value in Account Currency = Pip Value in Quote Currency × Exchange Rate
```

**Example:**

- Trading EUR/USD (where USD is quote currency) with USD account:

  - No conversion needed, pip value = $10 per pip

- Trading EUR/USD with EUR account:
  - Pip Value in Quote Currency = $10 per pip
  - Exchange Rate (USD to EUR) = 0.85
  - Pip Value in Account Currency = $10 × 0.85 = €8.50 per pip

#### Step 5: Calculate Total Values

Finally, the app multiplies the pip values by your pip count to get total values:

```
Total Value in Quote Currency = Pip Value in Quote Currency × Pip Count
Total Value in Account Currency = Pip Value in Account Currency × Pip Count
```

**Example:**

- If pip count = 15:
  - Total Value in Quote Currency = $10 × 15 = $150
  - Total Value in Account Currency = €8.50 × 15 = €127.50

### Real-world Examples

#### Example 1: Trading EUR/USD with USD Account

- Account Currency: USD
- Currency Pair: EUR/USD
- Lot Type: Standard (100,000 units)
- Lot Count: 1
- Pip Count: 10

**Calculation:**

1. Position Size = 100,000 units
2. Pip Size = 0.0001
3. Pip Value in USD = 100,000 × 0.0001 = $10 per pip
4. Account Currency is USD (same as quote currency), so no conversion needed
5. Total Value = $10 × 10 pips = $100

#### Example 2: Trading USD/JPY with EUR Account

- Account Currency: EUR
- Currency Pair: USD/JPY
- Lot Type: Mini (10,000 units)
- Lot Count: 2
- Pip Count: 5

**Calculation:**

1. Position Size = 10,000 × 2 = 20,000 units
2. Pip Size = 0.01 (JPY pair)
3. Pip Value in JPY = 20,000 × 0.01 = ¥200 per pip
4. Account Currency (EUR) differs from quote currency (JPY)
5. App fetches JPY/EUR exchange rate, e.g., 0.0075
6. Pip Value in EUR = ¥200 × 0.0075 = €1.50 per pip
7. Total Value = €1.50 × 5 pips = €7.50

#### Example 3: Trading GBP/USD with GBP Account

- Account Currency: GBP
- Currency Pair: GBP/USD
- Lot Type: Micro (1,000 units)
- Lot Count: 3
- Pip Count: 20

**Calculation:**

1. Position Size = 1,000 × 3 = 3,000 units
2. Pip Size = 0.0001
3. Pip Value in USD = 3,000 × 0.0001 = $0.30 per pip
4. Account Currency (GBP) differs from quote currency (USD)
5. App fetches USD/GBP exchange rate, e.g., 0.75
6. Pip Value in GBP = $0.30 × 0.75 = £0.225 per pip
7. Total Value = £0.225 × 20 pips = £4.50

### Edge Cases and Special Scenarios

#### Custom Decimal Places

Some traders may consider different decimal places as a pip (fractional pips):

- 5th decimal place (0.00001) - sometimes called a "pipette" or "fractional pip"
- 2nd decimal place (0.01) for non-JPY pairs
- 0th decimal place (1) for very large calculations

The app accommodates these by allowing decimal place selection.

#### API Unavailability

If exchange rate API is unavailable:

1. App shows error message
2. Calculation cannot proceed without fresh rates
3. This is intentional for trading accuracy

The calculator handles all these conversions automatically, allowing you to focus on your trading decisions rather than complex calculations.

## Input Fields

The application has several key input fields that affect calculations:

### 1. Account Currency

- This is the base currency of the user's trading account
- Affects final pip value calculation (conversion to account currency)
- Selected from a list of supported currencies in `constants/currencies.ts`

### 2. Currency Pair

- The forex trading pair (e.g., EUR/USD, USD/JPY)
- Consists of base currency and quote currency
- The pip value is calculated in the quote currency first
- Defined in `constants/currencies.ts`

```97:104:constants/currencies.ts
  // Major Pairs
  {
    name: "EUR/USD",
    base: "EUR",
    quote: "USD",
    pipDecimalPlaces: 4,
    group: "Major",
  },
```

### 3. Lot Size Selection

- Standard lot sizes are defined in `constants/lotSizes.ts`
- Users can select from:
  - Standard: 100,000 units
  - Mini: 10,000 units
  - Micro: 1,000 units
  - Nano: 100 units
  - Custom: User-defined units

```7:16:constants/lotSizes.ts
export type LotType = 'Standard' | 'Mini' | 'Micro' | 'Nano' | 'Custom';

export const defaultLotSizes: Record<string, LotSize> = {
  Standard: { name: 'Standard', value: 100000, editable: true },
  Mini: { name: 'Mini', value: 10000, editable: true },
  Micro: { name: 'Micro', value: 1000, editable: true },
  Nano: { name: 'Nano', value: 100, editable: true },
  Custom: { name: 'Custom', value: 1, editable: true },
};
```

### 4. Pip Count

- Number of pips to calculate the value for
- User can enter any number, including decimals
- The app validates input to ensure only valid numbers are entered

### 5. Pip Decimal Places

- Controls which decimal place is considered a pip
- Standard is 4 decimal places (or 2 for JPY pairs)
- Can be adjusted for different calculation requirements

## App Workflow

The main calculation workflow is implemented in the CalculatorScreen component:

```223:275:screens/CalculatorScreen.tsx
  // Calculate pip values
  const calculatePipValues = async () => {
    try {
      // Reset error message
      setErrorMessage(null);

      // Get position size
      const positionSize = calculateTotalUnits(
        lotType,
        lotCount,
        customUnits,
        lotSizes
      );

      // Get pip count as number
      const pipCountNum = parseFloat(pipCount) || 0;

      // Calculate pip value in quote currency with the selected decimal place
      const pipValueQuote = calculatePipValueInQuoteCurrency(
        selectedPair,
        positionSize,
        pipCountNum,
        pipDecimalPlaces
      );
      setPipValueInQuoteCurrency(pipValueQuote);

      try {
        // Get exchange rate between quote currency and account currency
        // Professional trading platforms use this direct approach

        // If quote currency is the same as account currency
        if (selectedPair.quote === accountCurrency.code) {
          const rate = 1;
          setExchangeRate(rate);

          const pipValueAccount = calculatePipValueInAccountCurrency(
            pipValueQuote,
            selectedPair.quote,
            accountCurrency.code,
            rate
          );
          setPipValueInAccountCurrency(pipValueAccount);
          setTotalValueInQuoteCurrency(pipValueQuote * pipCountNum);
          setTotalValueInAccountCurrency(pipValueAccount * pipCountNum);
        }
        // For all other cases, get direct rate from quote to account currency
        else {
          // Get direct exchange rate from quote currency to account currency
          // This matches professional trading platforms' calculation logic
          const rate = await fetchExchangeRate(
            selectedPair.quote,
            accountCurrency.code
          );
          setExchangeRate(rate);

          const pipValueAccount = calculatePipValueInAccountCurrency(
            pipValueQuote,
            selectedPair.quote,
            accountCurrency.code,
            rate
          );
          setPipValueInAccountCurrency(pipValueAccount);
          setTotalValueInQuoteCurrency(pipValueQuote * pipCountNum);
          setTotalValueInAccountCurrency(pipValueAccount * pipCountNum);
        }
      } catch (error) {
        // Handle specific API errors
        // ...
      }
    } catch (error) {
      // ...
    }
  };
```

## Key Formulas

### 1. Position Size Calculation

```18:26:constants/lotSizes.ts
// Calculate total units based on lot type and count
export const calculateTotalUnits = (
  lotType: LotType,
  lotCount: number,
  customUnits: number,
  lotSizes: Record<string, LotSize>
): number => {
  if (lotType === 'Custom') {
    return customUnits;
  }
  return lotSizes[lotType].value * lotCount;
};
```

### 2. Pip Size Determination

Pip size is typically:

- 0.0001 (1/10,000) for most currency pairs
- 0.01 (1/100) for JPY pairs
- Custom values for special scenarios

### 3. Exchange Rate Handling

The app fetches real-time exchange rates to convert pip values from quote currency to account currency:

```106:143:services/api.ts
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
```

## Currency and Exchange Rate Handling

### Currency Support

The app supports a wide range of currencies as defined in `constants/currencies.ts`, including:

- Major currencies (USD, EUR, GBP, JPY, etc.)
- Minor currencies (AUD, CAD, CHF, NZD, etc.)
- Exotic currencies (SGD, ZAR, TRY, etc.)

### Currency Pairs

The app provides pre-defined currency pairs organized by groups:

- Major pairs (EUR/USD, GBP/USD, USD/JPY, etc.)
- EUR pairs (EUR/GBP, EUR/JPY, etc.)
- GBP pairs (GBP/JPY, GBP/CHF, etc.)
- Other cross pairs

### Exchange Rate API

Real-time exchange rates are fetched using the TraderMade API:

```73:93:services/api.ts
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
```

## Technical Implementation

### State Management

The application uses React's useState and useEffect hooks to manage state. Key states include:

```47:80:screens/CalculatorScreen.tsx
  // State for currency selection
  const [accountCurrency, setAccountCurrency] = useState<Currency>(
    currencies[0]
  );
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    currencyPairs[0]
  );

  // State for modals
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [lotSizeEditorVisible, setLotSizeEditorVisible] = useState(false);
  const [pipCalculatorVisible, setPipCalculatorVisible] = useState(false);

  // State for lot size
  const [lotSizes, setLotSizes] =
    useState<Record<string, LotSize>>(defaultLotSizes);
  const [lotType, setLotType] = useState<LotType>("Standard");
  const [lotCount, setLotCount] = useState(1);
  const [customUnits, setCustomUnits] = useState(1);

  // State for pip input
  const [pipCount, setPipCount] = useState("10");
  const [pipDecimalPlaces, setPipDecimalPlaces] = useState(4);

  // State for calculation results and errors
  const [pipValueInQuoteCurrency, setPipValueInQuoteCurrency] = useState(0);
  const [pipValueInAccountCurrency, setPipValueInAccountCurrency] = useState(0);
  const [totalValueInQuoteCurrency, setTotalValueInQuoteCurrency] = useState(0);
  const [totalValueInAccountCurrency, setTotalValueInAccountCurrency] =
    useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

### Data Persistence

User preferences are saved using AsyncStorage:

```84:142:screens/CalculatorScreen.tsx
  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load account currency
        const savedAccountCurrency = await AsyncStorage.getItem(
          ACCOUNT_CURRENCY_KEY
        );
        if (savedAccountCurrency) {
          const parsedCurrency = JSON.parse(savedAccountCurrency);
          setAccountCurrency(parsedCurrency);
        }

        // Load currency pair
        const savedCurrencyPair = await AsyncStorage.getItem(CURRENCY_PAIR_KEY);
        if (savedCurrencyPair) {
          const parsedPair = JSON.parse(savedCurrencyPair);
          setSelectedPair(parsedPair);
        }

        // Load lot sizes
        const savedLotSizes = await AsyncStorage.getItem(LOT_SIZES_KEY);
        if (savedLotSizes) {
          const parsedLotSizes = JSON.parse(savedLotSizes);
          setLotSizes(parsedLotSizes);
        }

        // Load lot type
        const savedLotType = await AsyncStorage.getItem(LOT_TYPE_KEY);
        if (savedLotType) {
          setLotType(savedLotType as LotType);
        }

        // Load lot count
        const savedLotCount = await AsyncStorage.getItem(LOT_COUNT_KEY);
        if (savedLotCount) {
          setLotCount(parseInt(savedLotCount));
        }

        // Load custom units
        const savedCustomUnits = await AsyncStorage.getItem(CUSTOM_UNITS_KEY);
        if (savedCustomUnits) {
          setCustomUnits(parseInt(savedCustomUnits));
        }

        // Load pip count
        const savedPipCount = await AsyncStorage.getItem(PIP_COUNT_KEY);
        if (savedPipCount) {
          setPipCount(savedPipCount);
        }

        // Load pip decimal places
        const savedPipDecimalPlaces = await AsyncStorage.getItem(
          PIP_DECIMAL_PLACES_KEY
        );
        if (savedPipDecimalPlaces) {
          setPipDecimalPlaces(parseInt(savedPipDecimalPlaces));
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);
```

## Testing Guidelines

### Functional Testing Areas

1. **Currency Selection**

   - Test selecting different account currencies
   - Test selecting different currency pairs
   - Verify UI updates correctly with selections

2. **Lot Size Handling**

   - Test all predefined lot sizes (Standard, Mini, Micro, Nano)
   - Test custom lot size input
   - Verify lot count input works correctly

3. **Pip Count Input**

   - Test integer values
   - Test decimal values
   - Test invalid inputs (negative numbers, non-numeric characters)

4. **Calculation Accuracy**

   - Verify pip value calculations match expected results for:
     - Different currency pairs
     - Different lot sizes
     - Different pip counts
   - Cross-verify results with other pip calculators

5. **Exchange Rate Functionality**

   - Test when quote currency matches account currency
   - Test with different quote and account currencies
   - Test handling of API errors or connectivity issues

6. **Data Persistence**

   - Verify preferences are saved correctly
   - Test app restart behavior with saved preferences

7. **Theme Testing**
   - Test light and dark themes
   - Verify UI components adapt properly to theme changes

### Test Cases for Pip Calculation

1. **EUR/USD with Standard Lot**

   - Account Currency: USD
   - Currency Pair: EUR/USD
   - Lot Type: Standard (100,000 units)
   - Lot Count: 1
   - Pip Count: 10
   - Expected Result: $10 per pip, $100 total

2. **USD/JPY with Mini Lot**

   - Account Currency: USD
   - Currency Pair: USD/JPY
   - Lot Type: Mini (10,000 units)
   - Lot Count: 1
   - Pip Count: 10
   - Expected Result: ¥1,000 per pip, converted to USD based on exchange rate

3. **Cross-Currency Test**
   - Account Currency: EUR
   - Currency Pair: USD/CAD
   - Lot Type: Micro (1,000 units)
   - Lot Count: 5
   - Pip Count: 20
   - Expected Result: 0.5 CAD per pip, converted to EUR based on exchange rate
