import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type FilterType = 'today' | 'week' | 'month' | 'year';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  const tabs: { key: FilterType; label: string }[] = [
    { key: 'today', label: 'Сьогодні' },
    { key: 'week', label: 'Тиждень' },
    { key: 'month', label: 'Місяць' },
    { key: 'year', label: 'Рік' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeFilter === tab.key && styles.activeTab]}
          onPress={() => onFilterChange(tab.key)}
        >
          <Text style={[styles.tabText, activeFilter === tab.key && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
});
