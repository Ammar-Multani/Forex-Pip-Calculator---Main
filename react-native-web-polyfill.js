/**
 * This file provides polyfills for React Native functionality in the web environment
 */

// Handle missing APIs
if (typeof window !== "undefined") {
  // Patch navigator for web
  if (!window.navigator.share) {
    window.navigator.share = async (data) => {
      console.log("Web Share API not available, fallback to window.open");
      if (data.url) {
        window.open(data.url, "_blank");
        return true;
      }
      return false;
    };
  }

  // Mock missing RN APIs
  if (!window.ReactNativeWebView) {
    window.ReactNativeWebView = {
      postMessage: (msg) => console.log("WebView message:", msg),
    };
  }
}
