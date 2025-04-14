# Forex Pip Calculator

A professional-grade calculator for forex traders, with real-time exchange rates and accurate pip calculations.

## Features

- Account currency selection with a searchable modal
- Currency pair selection with grouping and search functionality
- Position size configuration with editable lot size values
- Pip value input with automatic decimal place adjustment
- Real-time calculations with exchange rate conversion
- Pull-to-refresh functionality to update exchange rates
- Dark and light theme support
- Educational content about pip calculations
- API key management for TraderMade API
- Caching for exchange rates
- Error handling for network connectivity issues

## Technical Details

- Built with React Native and Expo
- TypeScript for type safety
- React Navigation for screen management
- Context API for theme management
- AsyncStorage for user preferences
- TraderMade API for real-time exchange rates

## Future Work

### API Integration Enhancements
- Add support for more forex data providers
- Implement automatic fallback between different API providers
- Add rate limiting and quota management for API calls

### UI/UX Improvements
- Add animations for smoother transitions
- Implement a tutorial for first-time users
- Add more customization options for the calculator

### Advanced Features
- Add historical exchange rate data visualization
- Implement position risk calculator
- Add support for saving and loading calculation presets
- Implement push notifications for significant rate changes

### Performance Optimizations
- Optimize API calls to reduce data usage
- Improve caching strategy for offline use
- Implement background refresh for exchange rates

### Testing and Quality Assurance
- Add unit tests for calculation logic
- Add integration tests for API calls
- Implement error tracking and reporting

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
