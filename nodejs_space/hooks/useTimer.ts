import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  setDuration: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export const useTimer = (initialDuration: number = 60): UseTimerReturn => {
  const [duration, setDurationState] = useState(initialDuration);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlarm = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        // Web audio notification using oscillator
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          oscillator.start();
          // Play beep pattern: 3 beeps
          setTimeout(() => {
            oscillator.frequency.value = 1000;
          }, 200);
          setTimeout(() => {
            oscillator.frequency.value = 800;
          }, 400);
          setTimeout(() => oscillator.stop(), 600);
        } catch (webAudioError) {
          console.log('Web audio not available:', webAudioError);
        }
      } else {
        // Mobile: Use system audio through expo-av
        // Create a simple beep using Audio API
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });
          // Since we don't have an mp3 file, we'll just set up audio mode
          // The visual notification will be the primary indicator
          console.log('Timer complete - audio notification triggered');
        } catch (mobileAudioError) {
          console.log('Mobile audio setup failed:', mobileAudioError);
        }
      }
    } catch (error) {
      console.log('Could not play alarm sound:', error);
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setDuration = useCallback((seconds: number) => {
    const safeDuration = Math.max(0, seconds ?? 0);
    setDurationState(safeDuration);
    setTimeRemaining(safeDuration);
    setIsComplete(false);
  }, []);

  const start = useCallback(() => {
    if (timeRemaining <= 0) return;
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
  }, [timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (timeRemaining <= 0) return;
    setIsRunning(true);
    setIsPaused(false);
  }, [timeRemaining]);

  const reset = useCallback(() => {
    clearTimer();
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsPaused(false);
    setIsComplete(false);
  }, [duration, clearTimer]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            setIsComplete(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimer();
    };
  }, [isRunning, isPaused, clearTimer, playAlarm]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync?.();
    };
  }, []);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    isComplete,
    setDuration,
    start,
    pause,
    resume,
    reset,
  };
};
