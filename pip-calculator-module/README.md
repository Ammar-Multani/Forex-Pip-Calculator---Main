# Forex Pip Calculator Module

A modular, customizable Forex Pip Calculator component for React Native applications.

## Overview

This package provides a complete, self-contained pip calculator module for forex trading applications. It allows traders to calculate the value of price movements in currency pairs, supporting various lot sizes and customization options.

## Features

- Calculate pip values for any currency pair
- Support for standard, mini, micro, nano, and custom lot sizes
- Account for different pip decimal places (especially for JPY pairs)
- Adapt to light and dark themes
- Show values in both quote currency and account currency
- Automatic exchange rate conversion
- Responsive and customizable UI

## Installation

This module is designed to be added to your React Native project as a folder.

1. Copy the `pip-calculator-module` folder into your project's source directory
2. Make sure you have the required dependencies:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-native": "^0.69.0",
    "@expo/vector-icons": "^13.0.0",
    "expo-linear-gradient": "^12.0.0"
  }
}
```

## Usage

### Basic Usage

```jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { PipCalculator } from "./pip-calculator-module";

export default function ForexCalculatorScreen() {
  return (
    <View style={styles.container}>
      <PipCalculator
        theme="light" // or "dark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
});
```

### Props

The main `PipCalculator` component accepts the following props:

| Prop             | Type                         | Default     | Description                          |
| ---------------- | ---------------------------- | ----------- | ------------------------------------ |
| `theme`          | `"light"` \| `"dark"`        | `"light"`   | The theme to use for the calculator  |
| `onThemeChange`  | `(theme: ThemeType) => void` | `undefined` | Optional callback when theme changes |
| `containerStyle` | `ViewStyle`                  | `undefined` | Additional styles for the container  |

## Customization

You can also import individual components and utilities to create your own custom calculator:

```jsx
import {
  CurrencySelector,
  ResultCard,
  PipInput,
  calculatePipValueInQuoteCurrency,
  currencies,
  getColors,
} from "./pip-calculator-module";
```

## License

MIT
