# Forex Pip Calculator - Features

## Core Features

### Pip Value Calculator

The central functionality of this app is calculating pip values for forex trading positions. It provides:

- **Real-time pip value calculations** in both quote currency and account currency
- **Support for all major currency pairs** including EUR/USD, GBP/USD, USD/JPY, etc.
- **Support for exotic pairs** with automatic pip size adjustment (standard 0.0001 or 0.01 for JPY pairs)
- **Clear and intuitive results** showing both per-pip values and total position values

### Lot Size Management

The app offers comprehensive lot size management features:

- **Multiple lot size types**:
  - Standard Lot (100,000 units)
  - Mini Lot (10,000 units)
  - Micro Lot (1,000 units)
  - Nano Lot (100 units)
  - Custom Units (user-defined)
- **Lot count selection** allowing users to calculate values for multiple lots
- **Custom unit definition** for precise position sizing
- **Lot size editor** to customize the unit values for each lot type

### Account Currency Settings

Users can select their account currency, which affects pip value calculations:

- **Support for major currencies** as account base (USD, EUR, GBP, JPY, etc.)
- **Automatic exchange rate fetching** between account currency and quote currency
- **Persistent account currency setting** across app sessions

## User Experience Features

### Theme Support

The app provides a comfortable viewing experience in all conditions:

- **Light and dark themes** with automatic system preference detection
- **Theme toggle** in the app settings
- **Theme-aware components** that adjust their appearance based on the selected theme
- **Navigation bar and status bar theming** for a consistent experience throughout the app

### Data Persistence

User preferences and settings are automatically saved:

- **AsyncStorage integration** for local data storage
- **Persistent settings** including:
  - Account currency
  - Selected currency pair
  - Lot size configuration
  - Lot type and count
  - Pip count value
  - Theme preference

### User Interface

The app features a modern, intuitive user interface:

- **Responsive design** adapting to various screen sizes
- **Smooth animations** for modal transitions
- **Easy-to-use selectors** for currencies and currency pairs
- **Clear results display** with color-coded positive/negative values
- **Pull-to-refresh** for updating exchange rates

## Technical Features

### Exchange Rate API Integration

The app fetches real-time exchange rates:

- **API integration** with forex exchange rate providers
- **Fallback mechanisms** for handling API unavailability
- **Error handling** with user-friendly error messages

### Performance Optimization

The app is designed for smooth performance:

- **Efficient rendering** with React Native components
- **Memoized calculations** to prevent unnecessary recalculations
- **Optimized storage** of user preferences

## Educational Features

### Information Screen

The app includes educational content:

- **Explanation of pip calculation** formulas and concepts
- **Forex trading terminology** definitions
- **Usage examples** for different trading scenarios
- **FAQ section** addressing common questions

## Settings and Customization

### Settings Screen

Users can customize their experience through the settings screen:

- **API key management** for exchange rate services
- **Theme selection**
- **Default values configuration**
- **App information and version**
