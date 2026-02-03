import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, fontSize, verticalScale, moderateScale } from '../utils/scale';

interface EmptyStateProps {
  message: string;
  emoji?: string;
  textColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, emoji = '🎈', textColor }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.message, textColor ? { color: textColor } : undefined]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emoji: {
    fontSize: fontSize.huge,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSize.lg,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
