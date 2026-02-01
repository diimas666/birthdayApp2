import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../contexts/ThemeContext";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Пошук дня народження",
}) => {
  const { isDark } = useTheme();
  const bg = isDark ? "#2a2a3e" : "#fff";
  const textColor = isDark ? "#fff" : "#000";
  const placeholderColor = isDark ? "#999" : "#999";
  const iconColor = isDark ? "#999" : "#666";
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: "#8b5cf6" },
      ]}
    >
      <View style={styles.searchIconWrap}>
        <Ionicons name="search" size={22} color={iconColor} />
      </View>
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
    borderColor: "#8b5cf6",
    borderRadius: 12,
    backgroundColor: "#fff",
    position: "relative",
  },
  searchIconWrap: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 44,
    fontSize: 16,
    color: "#000",
  },
});
