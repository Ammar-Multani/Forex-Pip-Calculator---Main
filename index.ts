// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works on web.
import "@expo/metro-runtime";
import { registerRootComponent } from "expo";
import { Platform } from "react-native";

// Import web polyfills if on web platform
if (Platform.OS === "web") {
  require("./react-native-web-polyfill");
}

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
