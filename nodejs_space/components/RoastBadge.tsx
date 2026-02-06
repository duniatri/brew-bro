import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, getRoastColor } from '../theme';

interface RoastBadgeProps {
  roastLevel: string;
  size?: 'small' | 'medium' | 'large';
}

export const RoastBadge: React.FC<RoastBadgeProps> = ({
  roastLevel,
  size = 'medium',
}) => {
  const displayLevel = roastLevel ?? 'Unknown';
  const roastColor = getRoastColor(displayLevel);

  const sizeStyles = {
    small: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, fontSize: 12 },
    medium: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 14 },
    large: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 18 },
  };

  const currentSize = sizeStyles[size] ?? sizeStyles.medium;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: roastColor,
          paddingHorizontal: currentSize.paddingHorizontal,
          paddingVertical: currentSize.paddingVertical,
        },
      ]}
      accessibilityLabel={`Roast level: ${displayLevel}`}
    >
      <Text
        style={[
          styles.text,
          { fontSize: currentSize.fontSize },
        ]}
      >
        {displayLevel.charAt(0).toUpperCase() + displayLevel.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
