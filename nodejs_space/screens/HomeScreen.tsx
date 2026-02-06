import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleAnalyzeBeans = () => {
    navigation?.navigate?.('CameraAnalysis');
  };

  const handleStartTimer = () => {
    navigation?.navigate?.('Timer', undefined);
  };

  const handleViewHistory = () => {
    navigation?.navigate?.('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header / Branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="cafe" size={64} color={colors.primary} />
          </View>
          <Text style={styles.title}>Brew Bro</Text>
          <Text style={styles.subtitle}>Your Coffee Roast Analyzer</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <Surface style={styles.actionCard} elevation={2}>
            <Button
              mode="contained"
              onPress={handleAnalyzeBeans}
              style={styles.primaryButton}
              buttonColor={colors.primary}
              contentStyle={styles.buttonContent}
              icon={({ size, color }) => (
                <Ionicons name="camera" size={size} color={color} />
              )}
              accessibilityLabel="Analyze coffee beans"
              accessibilityHint="Opens camera to capture and analyze coffee beans"
            >
              Analyze Coffee Beans
            </Button>
            <Text style={styles.actionDescription}>
              Take a photo of your coffee beans to get roast analysis and brewing recommendations
            </Text>
          </Surface>

          <View style={styles.secondaryActions}>
            <Surface style={styles.secondaryCard} elevation={1}>
              <Button
                mode="outlined"
                onPress={handleStartTimer}
                style={styles.secondaryButton}
                textColor={colors.primary}
                contentStyle={styles.secondaryButtonContent}
                icon={({ size, color }) => (
                  <Ionicons name="timer-outline" size={size} color={color} />
                )}
                accessibilityLabel="Start brewing timer"
              >
                Start Timer
              </Button>
            </Surface>

            <Surface style={styles.secondaryCard} elevation={1}>
              <Button
                mode="outlined"
                onPress={handleViewHistory}
                style={styles.secondaryButton}
                textColor={colors.primary}
                contentStyle={styles.secondaryButtonContent}
                icon={({ size, color }) => (
                  <Ionicons name="time-outline" size={size} color={color} />
                )}
                accessibilityLabel="View brew history"
              >
                View History
              </Button>
            </Surface>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ☕ Perfect brew starts with knowing your beans
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  actionCard: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  actionDescription: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  secondaryButton: {
    borderColor: colors.primary,
    borderRadius: 8,
  },
  secondaryButtonContent: {
    paddingVertical: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
