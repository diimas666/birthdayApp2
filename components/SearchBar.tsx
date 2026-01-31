import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Пошук дня народження' }) => {
  const { isDark } = useTheme();
  const bg = isDark ? '#2a2a3e' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const placeholderColor = isDark ? '#999' : '#999';
  return (
    <View style={[styles.container, { backgroundColor: bg, borderColor: '#8b5cf6' }]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    fontSize: 20,
    zIndex: 1,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 44,
    fontSize: 16,
    color: '#000',
  },
});
