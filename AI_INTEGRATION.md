# AI Model Integration Examples

This document provides code examples for integrating real AI/ML models into CalorieScan for food recognition.

## Option 1: TensorFlow Lite (On-Device)

### Installation
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
npm install react-native-fs  # For loading model files
```

### Implementation

```javascript
// src/services/foodRecognitionTFLite.js
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'react-native-fs';

let model = null;

export const initializeModel = async () => {
  // Load TensorFlow.js
  await tf.ready();
  
  // Load your pre-trained model
  // You can use models from: https://tfhub.dev/
  model = await tf.loadGraphModel(
    bundleResourceIO(require('../assets/model/model.json'), 'model.json')
  );
};

export const recognizeFood = async (imageUri) => {
  if (!model) {
    await initializeModel();
  }

  // Preprocess image
  const imageData = await preprocessImage(imageUri);
  
  // Run inference
  const predictions = await model.predict(imageData);
  
  // Get top prediction
  const topPrediction = getTopPrediction(predictions);
  
  // Map to nutrition data
  return await mapToNutritionData(topPrediction);
};

const preprocessImage = async (imageUri) => {
  // Convert image to tensor
  // Resize to model input size (e.g., 224x224)
  // Normalize pixel values
  // Return tensor
};

const getTopPrediction = (predictions) => {
  // Process model output
  // Return food item with highest confidence
};
```

## Option 2: Clarifai Food Model

### Installation
```bash
npm install clarifai
```

### Implementation

```javascript
// src/services/foodRecognitionClarifai.js
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

export const recognizeFood = async (imageUri) => {
  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);
    
    // Call Clarifai Food Model
    const response = await app.models.predict(
      Clarifai.FOOD_MODEL,
      base64Image
    );
    
    // Extract predictions
    const concepts = response.outputs[0].data.concepts;
    const topFood = concepts[0];
    
    // Get nutrition data
    return await getNutritionData(topFood.name);
  } catch (error) {
    console.error('Clarifai error:', error);
    throw error;
  }
};

const imageToBase64 = async (imageUri) => {
  // Convert image to base64 format
};

const getNutritionData = async (foodName) => {
  // Query nutrition API or database
};
```

## Option 3: Google Cloud Vision API

### Installation
```bash
npm install @google-cloud/vision
```

### Implementation

```javascript
// src/services/foodRecognitionGoogle.js
import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'path/to/service-account-key.json'
});

export const recognizeFood = async (imageUri) => {
  try {
    // Read image file
    const imageBuffer = await readImageFile(imageUri);
    
    // Perform label detection
    const [result] = await client.labelDetection({
      image: { content: imageBuffer.toString('base64') }
    });
    
    const labels = result.labelAnnotations;
    
    // Filter for food items
    const foodLabels = labels.filter(label => 
      isFoodRelated(label.description)
    );
    
    // Get top food item
    const topFood = foodLabels[0];
    
    // Get nutrition data
    return await getNutritionData(topFood.description);
  } catch (error) {
    console.error('Google Vision error:', error);
    throw error;
  }
};
```

## Option 4: Custom Model with ML Kit (Android)

### Create Native Module

```java
// android/app/src/main/java/com/caloriescan/FoodRecognitionModule.java
package com.caloriescan;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.label.ImageLabeling;
import com.google.mlkit.vision.label.ImageLabeler;

public class FoodRecognitionModule extends ReactContextBaseJavaModule {
    private ImageLabeler labeler;
    
    public FoodRecognitionModule(ReactApplicationContext context) {
        super(context);
        labeler = ImageLabeling.getClient();
    }
    
    @Override
    public String getName() {
        return "FoodRecognition";
    }
    
    @ReactMethod
    public void recognizeFood(String imagePath, Promise promise) {
        try {
            InputImage image = InputImage.fromFilePath(getReactApplicationContext(), 
                Uri.parse(imagePath));
            
            labeler.process(image)
                .addOnSuccessListener(labels -> {
                    // Process labels and return nutrition data
                    promise.resolve(processLabels(labels));
                })
                .addOnFailureListener(e -> {
                    promise.reject("RECOGNITION_ERROR", e);
                });
        } catch (Exception e) {
            promise.reject("FILE_ERROR", e);
        }
    }
}
```

## Option 5: Nutritionix API for Nutrition Data

### Installation
```bash
npm install axios
```

### Implementation

```javascript
// src/services/nutritionixApi.js
import axios from 'axios';

const NUTRITIONIX_API_ID = process.env.NUTRITIONIX_API_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

export const getNutritionData = async (foodName) => {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query: foodName },
      {
        headers: {
          'x-app-id': NUTRITIONIX_API_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const food = response.data.foods[0];
    
    return {
      name: food.food_name,
      calories: food.nf_calories,
      protein: food.nf_protein,
      carbs: food.nf_total_carbohydrate,
      fat: food.nf_total_fat,
      servingSize: `${food.serving_qty} ${food.serving_unit}`
    };
  } catch (error) {
    console.error('Nutritionix API error:', error);
    throw error;
  }
};
```

## Environment Configuration

Create a `.env` file in the project root:

```env
# Clarifai
CLARIFAI_API_KEY=your_api_key_here

# Google Cloud Vision
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_KEY_FILE=path/to/key.json

# Nutritionix
NUTRITIONIX_API_ID=your_app_id
NUTRITIONIX_API_KEY=your_api_key
```

Install dotenv:
```bash
npm install react-native-dotenv
```

## Choosing the Right Option

### TensorFlow Lite
- ✅ Works offline
- ✅ Fast inference
- ✅ Privacy-friendly (no data sent to cloud)
- ❌ Requires model training or finding pre-trained model
- ❌ Larger app size

### Cloud APIs (Clarifai, Google Vision)
- ✅ Highly accurate
- ✅ No model training needed
- ✅ Regular updates
- ❌ Requires internet connection
- ❌ API costs
- ❌ Privacy concerns

### Custom Native Module
- ✅ Best performance
- ✅ Platform-specific optimizations
- ❌ More complex implementation
- ❌ Requires native coding skills

## Next Steps

1. Choose your AI/ML approach
2. Sign up for necessary API keys
3. Replace the simulated `foodRecognition.js` with your chosen implementation
4. Test with real images
5. Optimize for performance and accuracy

## Resources

- [TensorFlow Lite Models](https://www.tensorflow.org/lite/models)
- [Clarifai Food Model](https://www.clarifai.com/models/food-image-recognition-model)
- [Google Cloud Vision](https://cloud.google.com/vision)
- [Nutritionix API](https://www.nutritionix.com/business/api)
- [USDA FoodData Central](https://fdc.nal.usda.gov/)
