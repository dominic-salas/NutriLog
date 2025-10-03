import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { recognizeFood } from './src/services/foodRecognition';

const App = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const handleImageCapture = async (useCamera = true) => {
    setLoading(true);
    setNutritionData(null);

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    try {
      const result = useCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (!result.didCancel && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);

        // Recognize food in the image
        const data = await recognizeFood(uri);
        setNutritionData(data);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>CalorieScan</Text>
          <Text style={styles.subtitle}>
            AI-Powered Food Recognition & Calorie Tracking
          </Text>
        </View>

        <View style={styles.content}>
          {!imageUri && (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Take a photo or select from gallery to analyze food
              </Text>
            </View>
          )}

          {imageUri && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Analyzing food...</Text>
            </View>
          )}

          {nutritionData && (
            <View style={styles.nutritionCard}>
              <Text style={styles.foodName}>{nutritionData.name}</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Calories:</Text>
                <Text style={styles.nutritionValue}>
                  {nutritionData.calories} kcal
                </Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Protein:</Text>
                <Text style={styles.nutritionValue}>
                  {nutritionData.protein}g
                </Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Carbs:</Text>
                <Text style={styles.nutritionValue}>{nutritionData.carbs}g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fat:</Text>
                <Text style={styles.nutritionValue}>{nutritionData.fat}g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Serving Size:</Text>
                <Text style={styles.nutritionValue}>
                  {nutritionData.servingSize}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImageCapture(true)}
              disabled={loading}>
              <Text style={styles.buttonText}>📷 Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleImageCapture(false)}
              disabled={loading}>
              <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  placeholder: {
    backgroundColor: '#ffffff',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  nutritionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#757575',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
