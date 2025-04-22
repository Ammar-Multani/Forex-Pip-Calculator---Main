import { Platform } from "react-native";

export const isWeb = Platform.OS === "web";
export const isNative = !isWeb;
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

/**
 * Helper function to handle features that are only available on native platforms
 * @param nativeImplementation Function to run on native platforms
 * @param webFallback Optional function to run on web as a fallback
 */
export const withPlatform = <T>(
  nativeImplementation: () => T,
  webFallback?: () => T
): T => {
  if (isWeb) {
    if (webFallback) {
      return webFallback();
    }
    // If no web fallback is provided, return a default value or null
    return null as T;
  }
  return nativeImplementation();
};

/**
 * Safely imports a module that might not be available on web
 * @param moduleName The name of the module to import
 * @param fallbackModule Optional fallback module for web
 */
export const safeImport = async (moduleName: string, fallbackModule?: any) => {
  if (isWeb) {
    return fallbackModule || {};
  }

  try {
    return await import(moduleName);
  } catch (error) {
    console.warn(`Module ${moduleName} could not be loaded`, error);
    return fallbackModule || {};
  }
};
