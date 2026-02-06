import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { colors, spacing } from '../theme';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      {!isRunning && !isPaused && (
        <Button
          mode="contained"
          onPress={onStart}
          style={styles.mainButton}
          buttonColor={colors.primary}
          icon="play"
          accessibilityLabel="Start timer"
        >
          Start
        </Button>
      )}

      {isRunning && (
        <Button
          mode="contained"
          onPress={onPause}
          style={styles.mainButton}
          buttonColor={colors.warning}
          icon="pause"
          accessibilityLabel="Pause timer"
        >
          Pause
        </Button>
      )}

      {isPaused && (
        <View style={styles.pausedControls}>
          <Button
            mode="contained"
            onPress={onResume}
            style={styles.resumeButton}
            buttonColor={colors.success}
            icon="play"
            accessibilityLabel="Resume timer"
          >
            Resume
          </Button>
          <IconButton
            icon="refresh"
            mode="contained"
            onPress={onReset}
            containerColor={colors.textSecondary}
            iconColor={colors.textLight}
            size={28}
            accessibilityLabel="Reset timer"
          />
        </View>
      )}

      {(isRunning || isPaused) && !isPaused && (
        <IconButton
          icon="refresh"
          mode="contained"
          onPress={onReset}
          containerColor={colors.textSecondary}
          iconColor={colors.textLight}
          size={28}
          style={styles.resetButton}
          accessibilityLabel="Reset timer"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  mainButton: {
    minWidth: 140,
  },
  pausedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resumeButton: {
    minWidth: 120,
  },
  resetButton: {
    marginLeft: spacing.sm,
  },
});
