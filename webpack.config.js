const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Customize the build for web:
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          // Add any modules that need transpiling
          "react-native-vector-icons",
          "react-native-share",
          "react-native-fs",
          "react-native-html-to-pdf",
          "jspdf",
          "html2canvas",
        ],
      },
    },
    argv
  );

  // Add module aliases to provide web alternatives for native modules
  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native-share": path.resolve(__dirname, "services/share.ts"),
    "react-native-html-to-pdf": path.resolve(__dirname, "services/pdf.ts"),
    // React and React DOM should match versions
    react: path.resolve(__dirname, "node_modules/react"),
    "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
  };

  // Configure JSX runtime
  if (config.resolve.alias) {
    config.resolve.alias["react/jsx-runtime"] = path.resolve(
      __dirname,
      "node_modules/react/jsx-runtime"
    );
    config.resolve.alias["react/jsx-dev-runtime"] = path.resolve(
      __dirname,
      "node_modules/react/jsx-dev-runtime"
    );
  }

  // Add fallbacks for Node.js modules that might be used by some dependencies
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    stream: false,
    zlib: false,
    crypto: false,
    canvas: false,
  };

  // Add jsPDF related loader rules
  config.module.rules.push({
    test: /canvg|svg\.node/,
    use: "null-loader",
  });

  // Customize the config before returning it
  return config;
};
