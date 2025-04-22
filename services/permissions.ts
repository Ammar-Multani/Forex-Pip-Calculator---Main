import { Platform } from "react-native";
import { isWeb, isAndroid, isIOS } from "../utils/platform";

// Permission result types
export enum PermissionResult {
  GRANTED = "granted",
  DENIED = "denied",
  NEVER_ASK_AGAIN = "never_ask_again",
}

// Web permissions
export const requestWebPermission = async (
  name: PermissionName
): Promise<PermissionResult> => {
  if (!navigator.permissions) {
    console.warn("Permissions API not supported in this browser");
    return PermissionResult.GRANTED; // Assume granted for older browsers
  }

  try {
    const result = await navigator.permissions.query({ name: name as any });

    switch (result.state) {
      case "granted":
        return PermissionResult.GRANTED;
      case "denied":
        return PermissionResult.DENIED;
      case "prompt":
        // The browser will prompt the user
        return PermissionResult.GRANTED;
      default:
        return PermissionResult.DENIED;
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
    return PermissionResult.DENIED;
  }
};

// Check storage permission across platforms
export const checkStoragePermission = async (): Promise<boolean> => {
  try {
    if (isWeb) {
      // Web doesn't need storage permission for most operations
      return true;
    } else if (isAndroid) {
      const { PermissionsAndroid } = require("react-native");
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return result;
    } else if (isIOS) {
      // iOS handles permissions differently
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking storage permission:", error);
    return false;
  }
};

// Request storage permission across platforms
export const requestStoragePermission = async (): Promise<boolean> => {
  try {
    if (isWeb) {
      // Web doesn't need explicit storage permission
      return true;
    } else if (isAndroid) {
      const { PermissionsAndroid } = require("react-native");
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } else if (isIOS) {
      // iOS handles permissions differently
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting storage permission:", error);
    return false;
  }
};
