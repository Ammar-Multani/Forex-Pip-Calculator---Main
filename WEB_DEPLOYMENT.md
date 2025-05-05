# Forex Pip Calculator Web Deployment Guide

This guide explains how to deploy the Forex Pip Calculator web app to various hosting services.

## Prerequisites

- Node.js and npm/yarn installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- [EAS CLI](https://docs.expo.dev/eas-update/getting-started/) for EAS deployment (optional)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) for Netlify deployment (optional)

## Configuration

The app is configured for web deployment in `app.json`:

```json
"web": {
  "favicon": "./assets/favicon.png",
  "output": "static",
  "bundler": "metro"
}
```

## Deployment Methods

### Using the Deployment Script (Recommended)

We've created a deployment script that handles the building and provides deployment options:

```bash
# Run the deployment script
npm run deploy:web
```

This will:

1. Build the web project
2. Start a local server for testing
3. Guide you through deployment options

### Manual Build and Deploy

#### 1. Build the Web App

```bash
# Build the web app
npm run build:web
```

This will create a production-ready build in the `dist` directory.

#### 2. Test Locally (Optional)

```bash
# Serve the built web app locally
npm run serve:web
```

Visit http://localhost:8081 to test your web app.

### Deployment Options

#### Option 1: EAS Hosting (Recommended)

EAS Hosting is the easiest option for Expo apps with the best compatibility:

```bash
# Build for web
npx eas build -p web

# Deploy to EAS Hosting
npx eas deploy -p web
```

#### Option 2: Netlify

Netlify provides a simple way to deploy static sites:

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Deploy to Netlify (draft)
npm run deploy:netlify

# Deploy to Netlify (production)
npm run deploy:netlify -- --prod
```

#### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel dist
```

#### Option 4: GitHub Pages

1. Push your `dist` directory to a GitHub repository
2. Enable GitHub Pages in the repository settings
3. Set the source to the branch containing your `dist` directory

#### Option 5: Manual FTP Upload

Upload the contents of the `dist` directory to your web server using FTP.

## Web-Specific Features and Limitations

### Features Working on Web

- Currency selection and calculations
- Theme support (light/dark/system)
- Responsive layout
- Onboarding flow
- History screen with back navigation

### Web-Specific Implementations

- PDF generation opens in a new tab with print option
- Web-compatible shadow styling using `boxShadow`
- Platform-specific imports for native modules
- Enhanced navigation with web-specific back button styling
- Responsive container layouts for better desktop experience

## Troubleshooting

### Common Issues

- **Missing Assets**: Make sure all assets referenced in your app are available in the `assets` directory.
- **Routing Issues**: If routes don't work, verify the `_redirects` file is in the `public` directory with:

  ```
  /*    /index.html   200
  ```

- **Build Errors**: Check console errors during build. You may need to conditionally import native modules.

### Getting Help

If you encounter issues, refer to:

- [Expo Web documentation](https://docs.expo.dev/workflow/web/)
- [EAS Hosting documentation](https://docs.expo.dev/eas-hosting/introduction/)
- [Netlify docs](https://docs.netlify.com/)
