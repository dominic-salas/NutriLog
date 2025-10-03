# iOS Support (Future Implementation)

CalorieScan is designed with cross-platform support in mind. While the current version focuses on Android, the React Native architecture makes it straightforward to add iOS support in the future.

## Steps to Add iOS Support

1. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   ```

2. **Create iOS project structure**
   - Similar to android folder, create ios folder with Xcode project
   - Configure Info.plist with required permissions
   - Set up CocoaPods for dependency management

3. **Required iOS Permissions**
   Add to Info.plist:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>CalorieScan needs camera access to photograph food</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>CalorieScan needs photo library access to select food images</string>
   ```

4. **Build for iOS**
   ```bash
   npm run ios
   ```

## iOS-Specific Considerations

- **App Store Guidelines**: Follow Apple's guidelines for health/nutrition apps
- **Core ML Integration**: Consider using Core ML for on-device food recognition
- **HealthKit**: Potential integration with Apple Health for calorie tracking
- **Design Guidelines**: Follow iOS Human Interface Guidelines

## Development Requirements

- macOS with Xcode installed
- iOS Simulator or physical iOS device
- Apple Developer account (for device testing and App Store)
- CocoaPods for dependency management

The current codebase is iOS-ready. The JavaScript layer is platform-agnostic, requiring only the native iOS layer to be implemented.
