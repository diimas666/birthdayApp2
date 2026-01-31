import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    paddingVertical: 60,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
