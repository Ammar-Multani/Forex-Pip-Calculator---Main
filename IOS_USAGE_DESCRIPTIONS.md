# iOS App Store Usage Descriptions Guide

When submitting your app to the Apple App Store, you need to provide usage descriptions for any permissions your app requests. These descriptions appear in the permission dialogs shown to users and are required by Apple for app submission.

## Current Configuration

Your app.json already includes the following usage descriptions:

```json
"infoPlist": {
  "UIBackgroundModes": [],
  "NSCameraUsageDescription": "This app does not use your camera",
  "NSPhotoLibraryUsageDescription": "This app does not access your photos",
  "NSPhotoLibraryAddUsageDescription": "This app does not save photos to your library",
  "NSMicrophoneUsageDescription": "This app does not use your microphone",
  "NSLocationWhenInUseUsageDescription": "This app does not use your location",
  "ITSAppUsesNonExemptEncryption": false
}
```

## Common Usage Descriptions

If your app uses any of the following features, you'll need to update the usage descriptions in your app.json:

### Camera

```json
"NSCameraUsageDescription": "This app uses your camera to [explain why]"
```

### Photo Library

```json
"NSPhotoLibraryUsageDescription": "This app accesses your photos to [explain why]"
```

### Adding Photos to Library

```json
"NSPhotoLibraryAddUsageDescription": "This app saves photos to your library to [explain why]"
```

### Microphone

```json
"NSMicrophoneUsageDescription": "This app uses your microphone to [explain why]"
```

### Location

```json
"NSLocationWhenInUseUsageDescription": "This app uses your location to [explain why]"
```

### Background Location

```json
"NSLocationAlwaysAndWhenInUseUsageDescription": "This app uses your location in the background to [explain why]"
```

### Contacts

```json
"NSContactsUsageDescription": "This app accesses your contacts to [explain why]"
```

### Calendar

```json
"NSCalendarsUsageDescription": "This app accesses your calendar to [explain why]"
```

### Reminders

```json
"NSRemindersUsageDescription": "This app accesses your reminders to [explain why]"
```

### Bluetooth

```json
"NSBluetoothPeripheralUsageDescription": "This app uses Bluetooth to [explain why]"
```

### Motion

```json
"NSMotionUsageDescription": "This app accesses motion data to [explain why]"
```

### Speech Recognition

```json
"NSSpeechRecognitionUsageDescription": "This app uses speech recognition to [explain why]"
```

### Face ID

```json
"NSFaceIDUsageDescription": "This app uses Face ID to [explain why]"
```

## Privacy Manifests

Your app also includes privacy manifests for certain API usages:

```json
"privacyManifests": {
  "NSPrivacyAccessedAPITypes": [
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
      "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
    },
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryFileTimestamp",
      "NSPrivacyAccessedAPITypeReasons": ["C617.1"]
    },
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryDiskSpace",
      "NSPrivacyAccessedAPITypeReasons": ["C617.1"]
    }
  ]
}
```

These privacy manifests explain why your app uses certain system APIs:

- **UserDefaults (CA92.1)**: Required for storing app preferences
- **FileTimestamp (C617.1)**: Required for file management
- **DiskSpace (C617.1)**: Required for checking storage availability

## What to Do If App Store Review Requests Additional Usage Descriptions

If Apple rejects your app during review and requests additional usage descriptions:

1. Identify which permission is being requested
2. Update your app.json to include the appropriate usage description
3. Ensure the description clearly explains why your app needs this permission
4. Resubmit your app for review

Remember that all usage descriptions should be user-friendly and explain the benefit to the user for granting the permission.
