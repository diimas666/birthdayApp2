import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, fontSize, borderRadius, moderateScale } from "../utils/scale";

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
      {/* <View style={styles.searchIconWrap}>
        <Ionicons name="search" size={22} color={iconColor} />
      </View> */}
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
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: "#8b5cf6",
    borderRadius: borderRadius.sm,
    backgroundColor: "#fff",
    position: "relative",
  },
  searchIconWrap: {
    position: "absolute",
    right: spacing.sm,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: moderateScale(12),
    paddingRight: moderateScale(44),
    fontSize: fontSize.base,
    color: "#000",
  },
});
