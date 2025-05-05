# Web Build Compatibility Changes

This document summarizes the changes made to make the Forex Pip Calculator app compatible with web builds.

## 1. Shadow Styling for Web

React Native's shadow properties (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`) work on iOS but not on web. We fixed this by using platform-specific styling:

### Before:

```javascript
style={{
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 2,
}}
```

### After:

```javascript
style={[
  Platform.OS === 'web'
    ? { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)' }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
      }
]}
```

Components fixed:

- `CurrencySelector`
- `CurrencyPairSelector`
- `CurrencyModal`
- `CurrencyPairModal`
- `LotSizeSelector`
- `OnboardingScreen` (Continue button)

## 2. Native Module Handling

### PDF Generation and Sharing

The app previously used native-only modules for PDF generation and sharing, which caused errors on web:

- `react-native-html-to-pdf` (not available on web)
- `react-native-share` (not available on web)

We implemented platform-specific solutions:

#### Before:

```javascript
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";

// Generate PDF
const file = await RNHTMLtoPDF.convert(options);
// Share PDF
await Share.open(shareOptions);
```

#### After:

```javascript
// Only import native modules when on native platforms
let RNHTMLtoPDF: any = null;
let Share: any = null;

if (Platform.OS !== "web") {
  RNHTMLtoPDF = require("react-native-html-to-pdf").default;
  Share = require("react-native-share").default;
}

export const generatePdf = async (
  options: GeneratePdfOptions
): Promise<string | null> => {
  // For web platform, use the web implementation
  if (Platform.OS === "web") {
    return generateWebPdf(options);
  }

  // Native implementation continues...
};
```

For web, we created a browser-based solution that:

- Opens a new window with the content
- Includes CSS styling to match the app design
- Adds a print button to leverage the browser's built-in PDF capabilities

## 3. Platform-Specific Error Handling

We added platform-specific error handling to provide appropriate user feedback:

```javascript
try {
  // Operation logic
} catch (error) {
  console.error("Error:", error);
  Alert.alert(
    "Error",
    Platform.OS === "web"
      ? "An error occurred. Please try using this feature on our mobile app for better support."
      : "An error occurred. Please try again.",
    [{ text: "OK" }]
  );
}
```

## 4. Best Practices Implemented

1. **Conditional Imports**: Native modules are only imported on native platforms.
2. **Feature Detection**: Using `Platform.OS` to determine available features.
3. **Graceful Degradation**: Providing alternative implementations on web.
4. **User Feedback**: Clear messaging when functionality differs between platforms.
5. **Web-Specific UI**: Custom web interface for browser environment.

## 5. Testing

For thorough testing of these changes, you should:

1. Build the web version using `expo start --web`
2. Test the PDF generation and export functionality
3. Verify all UI components render correctly with shadows
4. Confirm proper error handling and user guidance on web

## 6. Future Considerations

When adding new native features:

1. Always check for platform compatibility
2. Wrap native module imports in platform checks
3. Create web fallbacks for essential features
4. Consider using web-compatible libraries when available

## 7. Improved Web Interaction

Several interaction issues were fixed for web:

1. **Onboarding Continue Button**: Fixed interaction issues on the onboarding screen:

   - Added proper `boxShadow` styling for web
   - Added small timing delay for smoother scrolling transitions on web
   - Added proper accessibility attributes for web focus handling

2. **FlatList Scrolling**: Optimized FlatList configuration for better scrolling behavior on web:

   - Added `scrollEventThrottle` for smoother scrolling
   - Set `removeClippedSubviews={Platform.OS !== "web"}` to prevent rendering issues
   - Adjusted `decelerationRate="fast"` for better scroll snapping
   - Optimized render performance with appropriate `initialNumToRender` and `windowSize`

3. **Touch Handling**: Added explicit `activeOpacity` and proper accessibility attributes to ensure consistent behavior across platforms.
