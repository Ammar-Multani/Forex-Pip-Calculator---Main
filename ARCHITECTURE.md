# Forex Pip Calculator - Technical Architecture

This document outlines the technical architecture of the Forex Pip Calculator application, describing the key architectural decisions, component structure, data flow, and technology choices.

## Technology Stack

### Core Technologies

- **React Native**: Cross-platform mobile app framework
- **Expo**: Development toolkit and platform for React Native
- **TypeScript**: Strongly typed programming language for JavaScript
- **AsyncStorage**: Persistence library for local storage

### Key Libraries

- **React Navigation**: Navigation and routing
- **Expo Vector Icons**: Icon library
- **React Native Paper**: Material Design component library
- **React Native Modal**: Modal component
- **React Native Reanimated**: Animation library
- **Expo Haptics**: Haptic feedback
- **Expo Navigation Bar**: Navigation bar control
- **Expo Status Bar**: Status bar control
- **Expo Linear Gradient**: Gradient effects

## Application Architecture

The app follows a component-based architecture with functional React components, React Hooks, and Context API for state management.

### Architectural Overview

```
┌─────────────────────────────────────────────┐
│                                             │
│                 App Component               │
│                                             │
└───────────────────────┬─────────────────────┘
                        │
┌───────────────────────┼─────────────────────┐
│                       │                     │
│   ThemeContext        │     Navigation      │
│                       │                     │
└───────────────┬───────┴─────────┬───────────┘
                │                 │
    ┌───────────┴───┐         ┌───┴───────────┐
    │               │         │               │
┌───▼───┐       ┌───▼───┐ ┌───▼───┐       ┌───▼───┐
│Screen1│       │Screen2│ │Screen3│       │Screen4│
└───┬───┘       └───┬───┘ └───┬───┘       └───┬───┘
    │               │         │               │
┌───▼───┐       ┌───▼───┐ ┌───▼───┐       ┌───▼───┐
│ Comp1 │       │ Comp2 │ │ Comp3 │       │ Comp4 │
└───────┘       └───┬───┘ └───────┘       └───────┘
                    │
                ┌───▼───┐
                │ Comp5 │
                └───────┘
```

### Directory Structure

```
forex-pip-calculator/
├── app/                # Main application code
├── assets/             # Images, fonts, and other static files
├── components/         # Reusable UI components
├── constants/          # Application constants
├── contexts/           # React context providers
├── screens/            # Main application screens
├── services/           # API and external services
├── utils/              # Helper functions and utilities
├── App.tsx             # Main application component
└── app.json            # Expo configuration
```

## Component Architecture

### Core Components

- **App.tsx**: Main entry point, sets up providers and navigation
- **ThemeContext.tsx**: Manages theme state (light/dark)
- **CalculatorScreen.tsx**: Main screen for pip calculations
- **InfoScreen.tsx**: Educational content screen
- **SettingsScreen.tsx**: Configuration screen

### UI Components

- **Header.tsx**: App header with navigation buttons
- **CurrencySelector.tsx**: Account currency selection
- **CurrencyPairSelector.tsx**: Currency pair selection
- **LotSizeSelector.tsx**: Lot size type and count selection
- **PipInput.tsx**: Input for pip count
- **ResultCard.tsx**: Displays calculation results
- **Modal Components**: Various modal dialogs for selections

## Data Flow Architecture

### State Management

The app uses a combination of local component state with React's `useState` hook for component-specific state and React Context API for application-wide state like theme settings.

#### Local State

Used for component-specific states like:

- Input values
- Modal visibility
- Form validation states

#### Context API

Used for global application state:

- Theme settings (ThemeContext)

### Data Persistence

The app uses AsyncStorage for persisting user preferences:

- Account currency
- Selected currency pair
- Lot sizes configuration
- Lot type and count
- Theme preference

### API Integration

The app interacts with external exchange rate APIs:

- **fetchExchangeRate**: Fetches current exchange rates between currencies
- **ApiKeyManager**: Manages user's API keys for exchange rate services

## Business Logic Architecture

### Pip Value Calculation

The core business logic resides in utility functions:

- **calculatePipValueInQuoteCurrency**: Calculates pip value in the quote currency
- **calculatePipValueInAccountCurrency**: Converts pip value to account currency
- **Lot Size Utilities**: Functions for calculating position sizes

### Type System

The app uses TypeScript interfaces for type safety:

- **Currency**: Interface for currency objects
- **CurrencyPair**: Interface for currency pair objects
- **LotSize**: Interface for lot size configuration
- **LotType**: Union type for lot size types

## User Interface Architecture

### Theming

The app implements a theming system:

- **Light and Dark Themes**: Complete color schemes for light and dark modes
- **Theme Context**: React context for theme state and switching
- **Adaptive Components**: Components that adjust to theme changes

### Navigation

The app uses React Navigation for screen management:

- **Stack Navigator**: For main screen navigation
- **Screen Options**: Custom animation and styling for transitions

## Performance Considerations

### Optimization Techniques

- **Memoization**: Using React.memo and useCallback to prevent unnecessary re-renders
- **Lazy Loading**: Implementing lazy loading for heavy components
- **Debouncing**: Implementing debounce for input handlers to prevent excessive calculations

### Memory Management

- **Cleanup Functions**: Proper cleanup in useEffect hooks
- **Limited Storage**: Efficient use of AsyncStorage

## Testing Architecture

- **Jest**: Testing framework
- **React Native Testing Library**: UI testing

## Security Considerations

- **API Key Storage**: Secure storage of API keys
- **Input Validation**: Validation of user inputs
- **Error Handling**: Comprehensive error handling

## Evolution and Maintenance

- **Versioning**: Semantic versioning for the application
- **Updates**: Process for updates and new feature addition
- **Deprecation**: Strategy for deprecating features
