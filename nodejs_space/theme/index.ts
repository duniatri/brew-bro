import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';

export const colors = {
  primary: '#6F4E37', // Coffee brown
  primaryDark: '#4A3423', // Dark coffee
  accent: '#D4A574', // Caramel
  secondary: '#8B7355', // Medium brown
  background: '#FDF5E6', // Old lace / cream
  surface: '#FFFFFF',
  surfaceVariant: '#F5EBE0', // Light cream
  text: '#3C2415', // Dark brown text
  textSecondary: '#6B5344', // Secondary text
  textLight: '#FFFFFF',
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FF9800',
  disabled: '#BDBDBD',
  border: '#E0D5C5',
  // Roast level colors
  roastLight: '#C4A77D',
  roastLightMedium: '#A67C52',
  roastMedium: '#8B5A2B',
  roastMediumDark: '#654321',
  roastDark: '#3B2314',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const fontConfig = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.surfaceVariant,
    secondary: colors.secondary,
    secondaryContainer: colors.accent,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    background: colors.background,
    error: colors.error,
    onPrimary: colors.textLight,
    onSecondary: colors.textLight,
    onSurface: colors.text,
    onBackground: colors.text,
    outline: colors.border,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 12,
};

export const getRoastColor = (roastLevel: string): string => {
  const level = roastLevel?.toLowerCase?.() ?? '';
  if (level.includes('light-medium') || level.includes('light medium')) {
    return colors.roastLightMedium;
  }
  if (level.includes('medium-dark') || level.includes('medium dark')) {
    return colors.roastMediumDark;
  }
  if (level.includes('light')) {
    return colors.roastLight;
  }
  if (level.includes('dark')) {
    return colors.roastDark;
  }
  if (level.includes('medium')) {
    return colors.roastMedium;
  }
  return colors.roastMedium;
};
