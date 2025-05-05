# iOS Build Preparation Guide

This document outlines the steps needed to build this app for iOS. Since you're currently on Windows, these steps will need to be completed on a macOS machine when you're ready to build for iOS.

## Prerequisites

To build for iOS, you'll need:

1. A Mac computer (macOS)
2. Xcode (latest version recommended)
3. An Apple Developer account
4. Node.js and Yarn installed on your Mac
5. Expo CLI installed (`npm install -g eas-cli`)

## Setup Steps for iOS Build

When you have access to a Mac, follow these steps:

### 1. Clone and Setup the Repository

```bash
# Clone the repository
git clone [your-repo-url]

# Install dependencies
yarn install
```

### 2. Update Apple Developer Account Information

Edit the `eas.json` file with your actual Apple Developer account information:

- `appleId`: Your Apple ID email
- `ascAppId`: Your App Store Connect App ID
- `appleTeamId`: Your Apple Developer Team ID

### 3. Configure iOS Certificates and Provisioning Profiles

```bash
# Login to your Expo account
eas login

# Configure iOS credentials
eas credentials
```

### 4. Build for iOS Development (Simulator)

```bash
eas build --platform ios --profile development
```

### 5. Build for iOS Testing (Internal Distribution)

```bash
eas build --platform ios --profile preview
```

### 6. Build for App Store Submission

```bash
eas build --platform ios --profile production
```

## iOS-Specific Considerations

1. **App Store Assets**:

   - Prepare app screenshots in required sizes
   - Create App Store promotional text and description
   - Design an App Store icon (1024×1024 pixels)

2. **Privacy Requirements**:

   - Prepare a privacy policy URL
   - Be ready to answer App Store privacy questions
   - Document any data collection in your app

3. **App Store Guidelines**:
   - Review Apple's [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
   - Ensure your app meets all requirements

## Troubleshooting

If you encounter issues during the iOS build process:

1. Check Expo documentation: https://docs.expo.dev/build/setup/
2. Verify your Apple Developer account is in good standing
3. Ensure your app bundle identifier is unique
4. Check that all native iOS dependencies are properly configured

## Important Notes

- iOS builds can only be created on macOS
- You'll need to pay for an Apple Developer Program membership ($99/year) to distribute your app
- TestFlight can be used for beta testing before App Store submission
