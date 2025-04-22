import "dotenv/config";

export default {
  name: "Forex Pip Calculator",
  slug: "forex-pip-calculator",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash-icon-dark.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.enacton.forexpipcalculator",
    buildNumber: "1.0.0",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.enacton.forexpipcalculator",
    versionCode: 1,
    permissions: [],
  },
  web: {
    favicon: "./assets/favicon.png",
    name: "Forex Pip Calculator",
    shortName: "Forex Calc",
    lang: "en-US",
    backgroundColor: "#FFFFFF",
    themeColor: "#000000",
    scope: "/",
    startUrl: "/",
    bundler: "webpack",
  },
  extra: {
    // API Keys
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    FIXER_API_KEY: process.env.FIXER_API_KEY,
    CURRENCY_LAYER_API_KEY: process.env.CURRENCY_LAYER_API_KEY,
    EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,

    // API Priority
    API_PRIORITY: process.env.API_PRIORITY,

    // Environment
    NODE_ENV: process.env.NODE_ENV,

    // EAS
    eas: {
      projectId: "11aba8bb-8399-4c4b-b8dd-1c547005748f",
    },
  },
};
