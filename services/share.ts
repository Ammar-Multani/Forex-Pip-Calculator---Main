import { Platform } from "react-native";
import { isWeb } from "../utils/platform";

// Define types for the share options
interface ShareOptions {
  message?: string;
  title?: string;
  url?: string;
}

/**
 * Share content across platforms (web & native)
 */
export const share = async (options: ShareOptions): Promise<boolean> => {
  try {
    if (isWeb) {
      return await webShare(options);
    } else {
      // Native implementation
      const RNShare = await import("react-native-share").then((m) => m.default);
      await RNShare.open(options);
      return true;
    }
  } catch (error) {
    console.error("Error sharing content:", error);
    return false;
  }
};

/**
 * Web implementation using the Web Share API
 */
const webShare = async (options: ShareOptions): Promise<boolean> => {
  if (!navigator.share) {
    console.warn("Web Share API not supported on this browser");

    // Fallback to copy to clipboard or open in new tab
    if (options.url) {
      window.open(options.url, "_blank");
      return true;
    }
    return false;
  }

  try {
    await navigator.share({
      title: options.title,
      text: options.message,
      url: options.url,
    });
    return true;
  } catch (error) {
    console.error("Error using Web Share API:", error);
    return false;
  }
};
