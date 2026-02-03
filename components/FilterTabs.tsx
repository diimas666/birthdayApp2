import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "../hooks/useTranslation";
import { useTheme } from "../contexts/ThemeContext";
import { spacing, fontSize, borderRadius, moderateScale } from "../utils/scale";

type FilterType = "today" | "week" | "month" | "year";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const tabTextColor = isDark ? "#fff" : "#000";
  const tabs: { key: FilterType; label: string }[] = [
    { key: "today", label: t("filterToday") },
    { key: "week", label: t("filterWeek") },
    { key: "month", label: t("filterMonth") },
    { key: "year", label: t("filterYear") },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeFilter === tab.key && styles.activeTab]}
          onPress={() => onFilterChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              { color: tabTextColor },
              activeFilter === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: "#f3f3f3",
    minWidth: moderateScale(70),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#8b5cf6",
  },
  tabText: {
    fontSize: fontSize.md,
    color: "#000",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});
