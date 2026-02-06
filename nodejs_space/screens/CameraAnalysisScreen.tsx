import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Platform, Alert } from 'react-native';
import { Text, Button, Surface, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { RootStackParamList, AnalysisResult, TemperatureRange } from '../types';
import { apiService } from '../services/api';
import { convertImageToBase64 } from '../utils/imageUtils';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { RoastBadge } from '../components/RoastBadge';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CameraAnalysis'>;

export const CameraAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleTakePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        if (photo?.uri) {
          setImageUri(photo.uri);
          setImageBase64(photo.base64 ?? null);
          setShowCamera(false);
          setAnalysisResult(null);
          setError(null);
        }
      }
    } catch (e) {
      console.error('Error taking photo:', e);
      setError('Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 ?? null);
        setShowCamera(false);
        setAnalysisResult(null);
        setError(null);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      setError('Failed to select image. Please try again.');
    }
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in settings to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setShowCamera(true);
    setImageUri(null);
    setImageBase64(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Use stored base64 if available, otherwise convert from URI
      let base64 = imageBase64;
      if (!base64) {
        base64 = await convertImageToBase64(imageUri);
      }
      
      if (!base64) {
        throw new Error('Could not process image');
      }

      const response = await apiService.analyzeRoast(base64);

      if (response?.success === true) {
        setAnalysisResult({
          roastLevel: response.roastLevel ?? 'unknown',
          temperature: response.temperature ?? { celsius: 'N/A', fahrenheit: 'N/A' },
          description: response.description ?? 'No description available.',
          imageUri,
        });
      } else {
        setError(response?.error ?? 'Analysis failed. Please try again.');
      }
    } catch (e) {
      console.error('Analysis error:', e);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAndBrew = () => {
    if (!analysisResult) return;

    navigation?.navigate?.('Timer', {
      beanName: '',
      roastLevel: analysisResult.roastLevel ?? '',
      temperature: analysisResult.temperature ?? { celsius: 'N/A', fahrenheit: 'N/A' },
    });
  };

  const handleRetake = () => {
    setImageUri(null);
    setAnalysisResult(null);
    setError(null);
  };

  // Camera view
  if (showCamera) {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <Button
                mode="contained"
                onPress={() => setShowCamera(false)}
                buttonColor={colors.textSecondary}
                style={styles.cameraButton}
                accessibilityLabel="Cancel"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleTakePhoto}
                buttonColor={colors.primary}
                style={styles.captureButton}
                accessibilityLabel="Take photo"
                icon="camera"
              >
                Capture
              </Button>
            </View>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LoadingOverlay visible={isAnalyzing} message="Analyzing your coffee beans..." />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Selection / Preview */}
        {!imageUri ? (
          <Surface style={styles.selectionCard} elevation={2}>
            <View style={styles.iconContainer}>
              <Ionicons name="cafe-outline" size={80} color={colors.accent} />
            </View>
            <Text style={styles.instructionText}>
              Take a photo or select an image of your coffee beans to analyze
            </Text>
            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                onPress={handleOpenCamera}
                style={styles.selectionButton}
                buttonColor={colors.primary}
                icon="camera"
                accessibilityLabel="Take a photo"
              >
                Take Photo
              </Button>
              <Button
                mode="outlined"
                onPress={handlePickImage}
                style={styles.selectionButton}
                textColor={colors.primary}
                icon="image"
                accessibilityLabel="Select from gallery"
              >
                From Gallery
              </Button>
            </View>
          </Surface>
        ) : (
          <View style={styles.previewContainer}>
            <Surface style={styles.imageCard} elevation={2}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
                accessibilityLabel="Selected coffee beans image"
              />
            </Surface>

            {/* Analysis Result */}
            {analysisResult ? (
              <Surface style={styles.resultCard} elevation={2}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Analysis Complete</Text>
                  <RoastBadge roastLevel={analysisResult.roastLevel ?? 'unknown'} size="large" />
                </View>

                <Card style={styles.temperatureCard}>
                  <Card.Content>
                    <Text style={styles.tempLabel}>Recommended Water Temperature</Text>
                    <View style={styles.tempValues}>
                      <View style={styles.tempItem}>
                        <Text style={styles.tempValue}>
                          {analysisResult.temperature?.celsius ?? 'N/A'}°C
                        </Text>
                        <Text style={styles.tempUnit}>Celsius</Text>
                      </View>
                      <View style={styles.tempDivider} />
                      <View style={styles.tempItem}>
                        <Text style={styles.tempValue}>
                          {analysisResult.temperature?.fahrenheit ?? 'N/A'}°F
                        </Text>
                        <Text style={styles.tempUnit}>Fahrenheit</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>

                <Text style={styles.descriptionTitle}>Bean Description</Text>
                <Text style={styles.descriptionText}>
                  {analysisResult.description ?? 'No description available.'}
                </Text>

                <Button
                  mode="contained"
                  onPress={handleSaveAndBrew}
                  style={styles.brewButton}
                  buttonColor={colors.primary}
                  icon="timer"
                  accessibilityLabel="Save and start brewing"
                >
                  Save & Start Brewing
                </Button>
              </Surface>
            ) : (
              <View style={styles.actionButtons}>
                {error && (
                  <Surface style={styles.errorCard} elevation={1}>
                    <Ionicons name="alert-circle" size={24} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                  </Surface>
                )}
                <Button
                  mode="contained"
                  onPress={handleAnalyze}
                  style={styles.analyzeButton}
                  buttonColor={colors.primary}
                  icon="flask"
                  accessibilityLabel="Analyze coffee beans"
                  disabled={isAnalyzing}
                >
                  Analyze Beans
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleRetake}
                  style={styles.retakeButton}
                  textColor={colors.textSecondary}
                  icon="refresh"
                  accessibilityLabel="Select different image"
                >
                  Choose Different Image
                </Button>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cameraButton: {
    minWidth: 100,
  },
  captureButton: {
    minWidth: 140,
  },
  selectionCard: {
    padding: spacing.xl,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  instructionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.md,
  },
  selectionButton: {
    borderRadius: 12,
  },
  previewContainer: {
    gap: spacing.lg,
  },
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  previewImage: {
    width: '100%',
    height: 250,
  },
  actionButtons: {
    gap: spacing.md,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
  },
  analyzeButton: {
    borderRadius: 12,
  },
  retakeButton: {
    borderRadius: 12,
    borderColor: colors.textSecondary,
  },
  resultCard: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  temperatureCard: {
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.lg,
  },
  tempLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tempValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  tempValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tempUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tempDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  brewButton: {
    borderRadius: 12,
  },
});
