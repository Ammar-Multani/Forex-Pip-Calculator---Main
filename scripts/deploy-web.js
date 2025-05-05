const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

// Log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Main deployment function
async function deployWeb() {
  try {
    // Create scripts directory if it doesn't exist
    const scriptsDir = path.join(__dirname);
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    // Ensure public directory exists with redirects
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Create redirects file if it doesn't exist
    const redirectsPath = path.join(publicDir, "_redirects");
    if (!fs.existsSync(redirectsPath)) {
      fs.writeFileSync(redirectsPath, "/*    /index.html   200\n");
      log("✓ Created _redirects file for SPA routing", colors.green);
    }

    // Step 1: Export web project
    log("\n🚀 Step 1/3: Building the web project...", colors.cyan);
    execSync("npx expo export -p web", { stdio: "inherit" });
    log("✓ Web build completed successfully", colors.green);

    // Step 2: Serve locally for testing (optional)
    log("\n🌐 Step 2/3: Serving locally for testing...", colors.cyan);
    log("Opening http://localhost:8081 for preview", colors.yellow);
    log(
      "Press Ctrl+C to stop the server and continue deployment",
      colors.yellow
    );

    // Use spawn to allow user to interrupt with Ctrl+C
    try {
      execSync("npx expo serve", { stdio: "inherit" });
    } catch (error) {
      // User likely interrupted with Ctrl+C, which is fine
      log("\n✓ Local server stopped", colors.green);
    }

    // Step 3: Deployment options
    log("\n📤 Step 3/3: Deployment options", colors.cyan);
    log(
      "\nYour website is ready for deployment! Choose one of these options:",
      colors.reset
    );

    log("\n1. EAS Hosting (Recommended):", colors.blue);
    log("   Run: npx eas build -p web", colors.yellow);
    log("   Then: npx eas deploy -p web", colors.yellow);

    log("\n2. Netlify CLI:", colors.blue);
    log("   Run: npx netlify deploy --dir dist", colors.yellow);
    log(
      "   For production: npx netlify deploy --dir dist --prod",
      colors.yellow
    );

    log("\n3. Manual deployment:", colors.blue);
    log(
      '   Upload the contents of the "dist" folder to your hosting provider',
      colors.yellow
    );

    log("\nYour compiled web app is available in:", colors.reset);
    log(`   ${path.join(process.cwd(), "dist")}`, colors.green);
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the deployment script
deployWeb().catch((error) => {
  log(`\n❌ Error: ${error.message}`, colors.red);
  process.exit(1);
});
