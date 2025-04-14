# Forex Pip Calculator

A comprehensive mobile application for forex traders to quickly calculate pip values and position sizes across various currency pairs.

![Forex Pip Calculator App](./assets/icon.png)

## Features

- 🔄 Calculate pip values for major, minor, and exotic currency pairs
- 💰 Support for multiple account currencies
- 📊 Various lot size options (Standard, Mini, Micro, Nano, Custom)
- 💾 Persistent storage of user preferences
- 🌓 Light and dark theme support
- 📱 Responsive design for all device sizes

## Installation

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Expo CLI

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/forex-pip-calculator.git
   cd forex-pip-calculator
   ```

2. Install dependencies:

   ```
   yarn install
   ```

   or

   ```
   npm install
   ```

3. Start the development server:

   ```
   yarn start
   ```

   or

   ```
   npm run start
   ```

4. Follow the Expo instructions to run on a physical device or emulator.

## Building for Production

### Android

```
yarn android
```

### iOS

```
yarn ios
```

### Web

```
yarn web
```

## Project Structure

```
forex-pip-calculator/
├── app/                   # Main application code
├── assets/                # Images, fonts, and other static files
├── components/            # Reusable UI components
│   ├── CurrencyModal.tsx
│   ├── CurrencyPairModal.tsx
│   ├── Header.tsx
│   ├── LotSizeEditorModal.tsx
│   ├── LotSizeSelector.tsx
│   ├── PipInput.tsx
│   └── ResultCard.tsx
├── constants/             # Application constants
├── contexts/              # React context providers
├── screens/               # Main application screens
│   ├── CalculatorScreen.tsx
│   ├── InfoScreen.tsx
│   └── SettingsScreen.tsx
├── services/              # API and external services
├── utils/                 # Helper functions and utilities
├── App.tsx                # Main application component
├── app.json               # Expo configuration
└── package.json           # Project dependencies
```

## Key Functionality

### Pip Value Calculation

The app calculates pip values using the following formulas:

1. Pip Value in Quote Currency = Pip Size × Position Size
2. Pip Value in Account Currency = Pip Value in Quote Currency × Exchange Rate

Where:

- Pip Size is typically 0.0001 for most pairs (0.01 for JPY pairs)
- Position Size is determined by the selected lot type and count
- Exchange Rate is the current rate between the quote currency and account currency

### Lot Sizes

The app supports various standard lot sizes:

- Standard: 100,000 units
- Mini: 10,000 units
- Micro: 1,000 units
- Nano: 100 units
- Custom: User-defined units

## Technologies Used

- React Native / Expo for cross-platform mobile development
- TypeScript for type-safe code
- AsyncStorage for local data persistence
- React Navigation for screen navigation
- Expo Vector Icons for UI icons
- React Native Paper for UI components

## API Integration

The app uses exchange rate APIs to fetch current currency conversion rates for accurate pip value calculations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the forex traders who provided feedback during development
- Expo team for the excellent cross-platform development tools
