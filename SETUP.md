# Forex Pip Calculator - Setup Guide

This document provides detailed instructions for setting up the Forex Pip Calculator app for development, testing, and production deployment.

## Development Environment Setup

### System Requirements

- **Node.js**: v14.0.0 or later
- **npm**: v6.0.0 or later (comes with Node.js)
- **Yarn**: v1.22.0 or later (optional but recommended)
- **Expo CLI**: v4.0.0 or later
- **Git**: Any recent version

### Setting Up the Development Environment

1. **Install Node.js and npm**:

   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation with:
     ```bash
     node --version
     npm --version
     ```

2. **Install Yarn** (optional but recommended):

   ```bash
   npm install -g yarn
   ```

3. **Install Expo CLI**:

   ```bash
   npm install -g expo-cli
   ```

   or

   ```bash
   yarn global add expo-cli
   ```

4. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/forex-pip-calculator.git
   cd forex-pip-calculator
   ```

5. **Install Dependencies**:

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```

6. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` file and add your API keys:
     ```
     API_KEY=your_exchange_rate_api_key
     API_URL=https://api.example.com
     ```

## Running the Application

### Development Mode

1. **Start the Development Server**:

   ```bash
   yarn start
   ```

   or

   ```bash
   npm start
   ```

2. **Running on a Physical Device**:

   - Install the Expo Go app on your iOS or Android device
   - Scan the QR code displayed in the terminal or browser

3. **Running on an Emulator/Simulator**:
   - Press `a` in the terminal to run on an Android emulator (must be running)
   - Press `i` in the terminal to run on an iOS simulator (macOS only)

### Testing

Run the test suite:

```bash
yarn test
```

or

```bash
npm test
```

## Building for Production

### Prerequisites for Building

- For iOS:
  - macOS with Xcode installed
  - Apple Developer account
- For Android:
  - JDK 11
  - Android Studio with SDK tools

### Building for Android

1. **Configure app.json**:

   - Update the `android` section with your package name and version code
   - Configure adaptive icons and splash screen

2. **Build the APK/AAB**:
   ```bash
   expo build:android
   ```
3. **Choose the build type**:

   - APK for direct installation
   - AAB for Google Play Store

4. **Follow the prompts** to complete the build process

### Building for iOS

1. **Configure app.json**:

   - Update the `ios` section with your bundle identifier
   - Configure icons and splash screen

2. **Build the IPA**:

   ```bash
   expo build:ios
   ```

3. **Choose the build type**:

   - Archive for App Store
   - Simulator for testing

4. **Follow the prompts** to complete the build process

## API Configuration

### Exchange Rate API Setup

The app requires an API key for fetching exchange rates. Currently supported providers:

1. **[ExchangeRatesAPI](https://exchangeratesapi.io/)**:

   - Sign up for a free account
   - Copy your API key
   - Add it to the `.env` file

2. **Alternative Free APIs**:
   - [Open Exchange Rates](https://openexchangerates.org/)
   - [Fixer.io](https://fixer.io/)

### API Key Management

Users can add their own API keys through the app's settings screen:

1. Navigate to the Settings screen
2. Select "API Key Management"
3. Enter the API key provided by your exchange rate service
4. Save the changes

## Troubleshooting

### Common Issues

- **Metro Bundler fails to start**:

  ```bash
  rm -rf node_modules
  yarn install
  yarn start --reset-cache
  ```

- **Expo Go app can't connect to development server**:

  - Ensure both devices are on the same network
  - Try using tunnel connection: `yarn start --tunnel`

- **Build fails on Expo servers**:
  - Check if your account has valid credentials
  - Verify app.json configuration
  - Consult Expo build logs for specific errors

## Additional Configuration

### Custom Themes

To customize the app's themes, edit the theme configuration in:

```
contexts/ThemeContext.tsx
```

### Default Values

To change default values for lots, currencies, or other settings, modify:

```
constants/currencies.ts
constants/lotSizes.ts
```
