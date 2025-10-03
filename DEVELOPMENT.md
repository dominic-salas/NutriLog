# CalorieScan Development Guide

## Setup Instructions

### Android Development Setup

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API 34 or higher)
   - Install Android SDK Build-Tools
   - Install Android SDK Platform-Tools

2. **Configure Environment Variables**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Install Java Development Kit (JDK)**
   - JDK 11 or higher is required
   - Set JAVA_HOME environment variable

### Running on Physical Device

1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `adb devices` to verify connection
5. Run: `npm run android`

### Running on Emulator

1. Open Android Studio
2. Open AVD Manager (Tools > Device Manager)
3. Create a new Virtual Device or start existing one
4. Run: `npm run android`

## Project Architecture

### React Native Components

- **App.js**: Main application entry point with core UI
- **src/components/**: Reusable UI components (to be added)
- **src/screens/**: Full screen components (to be added)
- **src/services/**: Business logic and external service integrations
- **src/utils/**: Helper functions and data structures

### Android Native Layer

- **MainApplication.java**: React Native bridge initialization
- **MainActivity.java**: Main Android activity
- **AndroidManifest.xml**: App permissions and configuration
- **build.gradle**: Build configuration and dependencies

## Adding AI/ML Integration

### Option 1: TensorFlow Lite (On-Device)

1. Install dependencies:
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
```

2. Download a pre-trained food classification model
3. Integrate model loading and inference in `foodRecognition.js`

### Option 2: Cloud API (Clarifai Example)

1. Sign up for Clarifai API
2. Install SDK:
```bash
npm install clarifai
```

3. Update `foodRecognition.js`:
```javascript
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: 'YOUR_API_KEY'
});

export const recognizeFood = async (imageUri) => {
  const response = await app.models.predict(
    Clarifai.FOOD_MODEL,
    imageUri
  );
  // Process response and return nutrition data
};
```

## Camera Permissions

The app requests camera permissions at runtime. Ensure your manifest includes:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## Debugging

### Enable Debug Mode

```bash
adb shell input keyevent 82  # Opens dev menu
```

### View Logs

```bash
npx react-native log-android
```

Or use Android Studio's Logcat.

## Building Release APK

1. Generate signing key:
```bash
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing in `android/app/build.gradle`

3. Build release:
```bash
cd android
./gradlew assembleRelease
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## Common Issues

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Gradle Build Issues
```bash
cd android
./gradlew clean
```

### Dependency Issues
```bash
rm -rf node_modules
npm install
```
