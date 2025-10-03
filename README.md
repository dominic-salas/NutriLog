# CalorieScan

AI-powered food image recognition app for automatic calorie and nutrition tracking, available for Android (and iOS in the future).

## 🎯 Features

- 📷 **Image Capture**: Take photos or select from gallery
- 🤖 **AI Food Recognition**: Automatically identify food items
- 📊 **Nutrition Tracking**: Get detailed calorie and macronutrient information
- 📱 **Android Support**: Native Android application
- 🔮 **iOS Ready**: Architecture supports future iOS implementation

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Android Studio (for Android development)
- JDK 11 or higher
- Android SDK (API level 21+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dominic-salas/CalorieScan.git
cd CalorieScan
```

2. Install dependencies:
```bash
npm install
```

3. For Android development, ensure you have:
   - Android Studio installed
   - Android SDK configured
   - Android emulator or physical device connected

### Running the App

#### Android

1. Start Metro bundler:
```bash
npm start
```

2. In a new terminal, run the Android app:
```bash
npm run android
```

Or use the Android-specific command:
```bash
npx react-native run-android
```

## 📱 App Structure

```
CalorieScan/
├── android/                 # Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/        # Java/Kotlin source
│   │   │   ├── res/         # Android resources
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screen components
│   ├── services/            # Business logic & API services
│   │   └── foodRecognition.js
│   └── utils/               # Utility functions & data
│       └── nutritionDatabase.js
├── App.js                   # Main application component
├── index.js                 # Entry point
└── package.json             # Dependencies & scripts
```

## 🧠 AI Integration

The current implementation includes a simulated food recognition service. For production use, you can integrate with:

### Recommended AI/ML Services:

1. **TensorFlow Lite** - On-device ML for faster recognition
2. **Google Cloud Vision API** - Cloud-based food detection
3. **Clarifai Food Model** - Pre-trained food recognition
4. **AWS Rekognition** - Custom food classification
5. **Custom Models** - Train your own models on food datasets

### Nutrition Data APIs:

1. **USDA FoodData Central** - Comprehensive nutrition database
2. **Nutritionix API** - Restaurant and branded foods
3. **Edamam Nutrition API** - Recipe and ingredient analysis
4. **Open Food Facts** - Community-driven food database

## 🔧 Development

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## 📦 Key Dependencies

- **react-native**: Cross-platform mobile framework
- **react-native-image-picker**: Camera and gallery access
- Additional ML/AI libraries (to be integrated)

## 🎨 Features in Development

- [ ] Real AI model integration
- [ ] User authentication
- [ ] Meal history tracking
- [ ] Daily calorie goals
- [ ] Barcode scanning
- [ ] Portion size estimation
- [ ] iOS support
- [ ] Cloud sync
- [ ] Social sharing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- Integration with fitness trackers
- Meal planning suggestions
- Recipe recommendations
- Social features for sharing meals
- Advanced analytics and insights
- Multi-language support
- Offline mode with cached data
