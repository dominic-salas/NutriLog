# Quick Start Guide for CalorieScan

This guide will help you get CalorieScan up and running quickly on your development machine.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Android Studio installed (with SDK)
- [ ] JDK 11+ installed
- [ ] Android device or emulator ready

## Quick Setup (5 minutes)

### 1. Clone and Install (2 minutes)

```bash
git clone https://github.com/dominic-salas/CalorieScan.git
cd CalorieScan
npm install
```

### 2. Android Setup (2 minutes)

Set environment variables (add to ~/.bashrc or ~/.zshrc):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 3. Run the App (1 minute)

**Terminal 1** - Start Metro bundler:
```bash
npm start
```

**Terminal 2** - Launch Android app:
```bash
npm run android
```

That's it! The app should now be running on your Android device/emulator.

## Verify Installation

Run these commands to verify everything is set up correctly:

```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version

# Check Android devices
adb devices  # Should list your device/emulator

# Run tests
npm test  # Should pass all tests

# Run linting
npm run lint  # Should show no errors
```

## Using the App

1. **Take Photo**: Tap "📷 Take Photo" to use your camera
2. **Select from Gallery**: Tap "🖼️ Choose from Gallery" to pick an existing image
3. **View Results**: The app will analyze the food and show nutrition information

## Troubleshooting

### Metro bundler won't start
```bash
npm start -- --reset-cache
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### App crashes on device
```bash
# View logs
npx react-native log-android
```

### Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill
```

## Next Steps

- Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development guide
- Read [README.md](./README.md) for feature overview
- Check [IOS_SUPPORT.md](./IOS_SUPPORT.md) for iOS implementation plans

## Need Help?

- Check existing GitHub issues
- Create a new issue with:
  - Your error message
  - Steps to reproduce
  - Environment details (OS, Node version, etc.)

## Development Commands

```bash
npm start           # Start Metro bundler
npm run android     # Run on Android
npm test           # Run tests
npm run lint       # Run linter
```

Happy coding! 🚀
