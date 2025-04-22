import { registerRootComponent } from "expo";
import React from "react";
import { AppRegistry } from "react-native";
import App from "./App";

// Register the app
if (module.hot) {
  module.hot.accept();
}

AppRegistry.registerComponent("main", () => App);

// Create the web specific setup
if (typeof document !== "undefined") {
  const rootTag =
    document.getElementById("root") || document.getElementById("main");
  if (rootTag) {
    AppRegistry.runApplication("main", { rootTag });
  }
}

// This is needed for Expo
registerRootComponent(App);
