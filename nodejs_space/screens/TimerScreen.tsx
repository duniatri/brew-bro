import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Surface, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { RootStackParamList, TemperatureRange } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useBrewHistory } from '../contexts/BrewHistoryContext';
import { TimerControls } from '../components/TimerControls';
import { RoastBadge } from '../components/RoastBadge';
import { formatTime } from '../utils/imageUtils';

type TimerRouteProp = RouteProp<RootStackParamList, 'Timer'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Timer'>;

const PRESET_TIMES = [
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
  { label: '2:30', seconds: 150 },
  { label: '3:00', seconds: 180 },
];

export const TimerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TimerRouteProp>();
  const { addSession } = useBrewHistory();
  
  const params = route?.params ?? {};
  const initialBeanName = params?.beanName ?? '';
  const roastLevel = params?.roastLevel ?? '';
  const temperature: TemperatureRange = params?.temperature ?? { celsius: '', fahrenheit: '' };

  const [beanName, setBeanName] = useState(initialBeanName);
  const [equipment, setEquipment] = useState('Aeropress');
  const [tasteNotes, setTasteNotes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(90); // Default 1:30
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    timeRemaining,
    isRunning,
    isPaused,
    isComplete,
    setDuration,
    start,
    pause,
    resume,
    reset,
  } = useTimer(selectedPreset);

  // Track total brew time for saving
  const [totalBrewTime, setTotalBrewTime] = useState(selectedPreset);

  useEffect(() => {
    setDuration(selectedPreset);
    setTotalBrewTime(selectedPreset);
  }, [selectedPreset, setDuration]);

  const handlePresetSelect = (seconds: number) => {
    if (isRunning || isPaused) return;
    setSelectedPreset(seconds);
    setCustomMinutes('');
    setCustomSeconds('');
  };

  const handleCustomTimeSet = () => {
    const mins = parseInt(customMinutes ?? '0', 10) || 0;
    const secs = parseInt(customSeconds ?? '0', 10) || 0;
    const totalSeconds = mins * 60 + secs;
    if (totalSeconds > 0 && totalSeconds <= 3600) {
      setSelectedPreset(totalSeconds);
    } else {
      Alert.alert('Invalid Time', 'Please enter a time between 1 second and 60 minutes.');
    }
  };

  const handleSaveBrew = async () => {
    if (!beanName?.trim()) {
      Alert.alert('Bean Name Required', 'Please enter a name for your coffee beans.');
      return;
    }

    setIsSaving(true);
    try {
      await addSession({
        beanName: beanName.trim(),
        roastLevel: roastLevel || 'Unknown',
        temperature: temperature || { celsius: 'N/A', fahrenheit: 'N/A' },
        brewTime: totalBrewTime,
        equipment: equipment?.trim() || undefined,
        tasteNotes: tasteNotes?.trim() || undefined,
      });
      Alert.alert('Brew Saved', 'Your brew session has been saved to history.', [
        { text: 'OK', onPress: () => navigation?.navigate?.('Home') },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save brew session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayTime = formatTime(timeRemaining);
  const hasRoastInfo = !!roastLevel && roastLevel !== 'Unknown';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Bean Name Input */}
          <Surface style={styles.card} elevation={2}>
            <Text style={styles.sectionTitle}>Bean Name</Text>
            <TextInput
              mode="outlined"
              placeholder="e.g., Ethiopian Yirgacheffe"
              value={beanName}
              onChangeText={setBeanName}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              disabled={isRunning}
              accessibilityLabel="Bean name input"
            />
          </Surface>

          {/* Equipment Input */}
          <Surface style={styles.card} elevation={2}>
            <Text style={styles.sectionTitle}>Brewing Equipment</Text>
            <TextInput
              mode="outlined"
              placeholder="e.g., Aeropress, V60, French Press"
              value={equipment}
              onChangeText={setEquipment}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              disabled={isRunning}
              accessibilityLabel="Equipment input"
            />
          </Surface>

          {/* Roast Info (if available) */}
          {hasRoastInfo && (
            <Surface style={styles.card} elevation={2}>
              <View style={styles.roastInfoHeader}>
                <Text style={styles.sectionTitle}>Roast Analysis</Text>
                <RoastBadge roastLevel={roastLevel} />
              </View>
              {(temperature?.celsius || temperature?.fahrenheit) && (
                <View style={styles.tempInfo}>
                  <Ionicons name="thermometer" size={20} color={colors.primary} />
                  <Text style={styles.tempText}>
                    Recommended: {temperature?.celsius ?? 'N/A'}°C / {temperature?.fahrenheit ?? 'N/A'}°F
                  </Text>
                </View>
              )}
            </Surface>
          )}

          {/* Timer Display */}
          <Surface style={styles.timerCard} elevation={3}>
            <Text
              style={[
                styles.timerDisplay,
                isComplete && styles.timerComplete,
              ]}
              accessibilityLabel={`Time remaining: ${displayTime}`}
            >
              {displayTime}
            </Text>
            {isComplete && (
              <View style={styles.completeMessage}>
                <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                <Text style={styles.completeText}>Brew Complete!</Text>
              </View>
            )}
          </Surface>

          {/* Preset Times */}
          {!isRunning && !isPaused && (
            <Surface style={styles.card} elevation={2}>
              <Text style={styles.sectionTitle}>Brew Time</Text>
              <View style={styles.presetContainer}>
                {PRESET_TIMES.map((preset) => (
                  <Chip
                    key={preset.seconds}
                    mode={selectedPreset === preset.seconds ? 'flat' : 'outlined'}
                    selected={selectedPreset === preset.seconds}
                    onPress={() => handlePresetSelect(preset.seconds)}
                    style={[
                      styles.presetChip,
                      selectedPreset === preset.seconds && styles.presetChipSelected,
                    ]}
                    textStyle={[
                      styles.presetChipText,
                      selectedPreset === preset.seconds && styles.presetChipTextSelected,
                    ]}
                    accessibilityLabel={`Set timer to ${preset.label}`}
                  >
                    {preset.label}
                  </Chip>
                ))}
              </View>

              <Text style={styles.customTimeLabel}>Or set custom time:</Text>
              <View style={styles.customTimeContainer}>
                <TextInput
                  mode="outlined"
                  placeholder="Min"
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="number-pad"
                  style={styles.timeInput}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  maxLength={2}
                  accessibilityLabel="Minutes"
                />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Sec"
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  keyboardType="number-pad"
                  style={styles.timeInput}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  maxLength={2}
                  accessibilityLabel="Seconds"
                />
                <Button
                  mode="contained"
                  onPress={handleCustomTimeSet}
                  buttonColor={colors.secondary}
                  compact
                  accessibilityLabel="Set custom time"
                >
                  Set
                </Button>
              </View>
            </Surface>
          )}

          {/* Timer Controls */}
          <View style={styles.controlsContainer}>
            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
            />
          </View>

          {/* Taste Notes - shown after brew complete */}
          {isComplete && (
            <Surface style={styles.card} elevation={2}>
              <Text style={styles.sectionTitle}>Taste Notes</Text>
              <TextInput
                mode="outlined"
                placeholder="How does the coffee taste? e.g., fruity, nutty, smooth, bitter..."
                value={tasteNotes}
                onChangeText={setTasteNotes}
                style={styles.multilineInput}
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                multiline
                numberOfLines={3}
                accessibilityLabel="Taste notes input"
              />
            </Surface>
          )}

          {/* Save Button */}
          {isComplete && (
            <Button
              mode="contained"
              onPress={handleSaveBrew}
              style={styles.saveButton}
              buttonColor={colors.primary}
              icon="content-save"
              loading={isSaving}
              disabled={isSaving}
              accessibilityLabel="Save brew session"
            >
              Save Brew
            </Button>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
  },
  multilineInput: {
    backgroundColor: colors.surface,
    minHeight: 80,
  },
  roastInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tempInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tempText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerCard: {
    padding: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerComplete: {
    color: colors.success,
  },
  completeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  completeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.success,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetChip: {
    backgroundColor: colors.surfaceVariant,
  },
  presetChipSelected: {
    backgroundColor: colors.primary,
  },
  presetChipText: {
    color: colors.text,
  },
  presetChipTextSelected: {
    color: colors.textLight,
  },
  customTimeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  customTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeInput: {
    width: 70,
    backgroundColor: colors.surface,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  controlsContainer: {
    marginBottom: spacing.lg,
  },
  saveButton: {
    borderRadius: 12,
  },
});
