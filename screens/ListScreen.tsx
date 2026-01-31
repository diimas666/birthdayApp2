import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Birthday, BirthdayWithAge } from '../types';
import {
  getBirthdays,
  deleteBirthday,
  updateBirthday,
  saveBirthday,
} from '../utils/storage';
import { enrichBirthday, formatDate } from '../utils/dateHelpers';
import { rescheduleAllNotifications } from '../utils/notifications';
import { BirthdayModal } from '../components/BirthdayModal';
import { EmptyState } from '../components/EmptyState';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

type SortType = 'date' | 'name' | 'age';

export const ListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const bg = isDark ? '#0a0a14' : '#F5F5F5';
  const cardBg = isDark ? '#2a2a3e' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const secondaryText = isDark ? '#a78bfa' : '#666';
  const sortTabBg = isDark ? '#2a2a3e' : '#eee';
  const listItemBg = isDark ? '#2a2a3e' : '#fff';
  const listItemBorder = isDark ? '#3a3a4e' : '#e8e8e8';
  const daysBadgeBg = isDark ? '#3a3a4e' : '#f0e6ff';
  const daysBadgeTextColor = isDark ? '#fff' : '#333';
  const [birthdays, setBirthdays] = useState<BirthdayWithAge[]>([]);
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);

  const loadBirthdays = async () => {
    const loaded = await getBirthdays();
    const enriched = loaded.map(enrichBirthday);
    enriched.sort((a, b) => a.daysUntil - b.daysUntil);
    setBirthdays(enriched);
  };

  const sortedBirthdays = React.useMemo(() => {
    const list = [...birthdays];
    if (sortBy === 'date') list.sort((a, b) => a.daysUntil - b.daysUntil);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'age') list.sort((a, b) => b.age - a.age);
    return list;
  }, [birthdays, sortBy]);

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert(
      t('deleteBirthday'),
      t('deleteConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteBirthday(id);
            const updated = birthdays.filter(b => b.id !== id);
            await rescheduleAllNotifications(updated);
            await loadBirthdays();
          },
        },
      ]
    );
  };

  const handleEdit = (birthday: BirthdayWithAge) => {
    setEditingBirthday(birthday);
    setModalVisible(true);
  };

  const handleSave = async (birthdayData: Omit<Birthday, 'id' | 'createdAt'>) => {
    if (editingBirthday) {
      await updateBirthday(editingBirthday.id, birthdayData);
    } else {
      const newBirthday: Birthday = {
        ...birthdayData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      await saveBirthday(newBirthday);
    }
    await loadBirthdays();
    const allBirthdays = await getBirthdays();
    await rescheduleAllNotifications(allBirthdays);
    setModalVisible(false);
    setEditingBirthday(null);
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>, item: BirthdayWithAge) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightAction}>
        <Animated.View style={[styles.deleteButton, { transform: [{ scale }] }]}>
          <TouchableOpacity
            style={styles.deleteButtonContent}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: BirthdayWithAge }) => {
    const getDaysText = () => {
      if (item.daysUntil === 0) return t('todayShort');
      if (item.daysUntil === 1) return t('tomorrow');
      return t('inDays', item.daysUntil);
    };

    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
        overshootRight={false}
      >
        <TouchableOpacity
          style={[styles.listItem, { backgroundColor: listItemBg, borderColor: listItemBorder }]}
          onPress={() => handleEdit(item)}
          activeOpacity={0.7}
        >
          <View style={styles.listItemContent}>
            <View style={styles.listItemLeft}>
              <Text style={[styles.listItemName, { color: textColor }]}>{item.name}</Text>
              <Text style={[styles.listItemDetails, { color: secondaryText }]}>
                {t('turns', item.age + 1)} • {formatDate(item.nextBirthday)}
              </Text>
              {item.note && (
                <Text style={styles.listItemNote}>{item.note}</Text>
              )}
            </View>
            <View style={styles.listItemRight}>
              <View style={[styles.daysBadge, { backgroundColor: item.daysUntil === 0 ? undefined : daysBadgeBg }, item.daysUntil === 0 && styles.daysBadgeToday]}>
                <Text style={[styles.daysBadgeText, { color: item.daysUntil === 0 ? '#fff' : daysBadgeTextColor }, item.daysUntil === 0 && styles.daysBadgeTextToday]}>{getDaysText()}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (birthdays.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} translucent={false} />
        <EmptyState message={t('noBirthdaysYet')} emoji="🎂" textColor={secondaryText} />
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabText}>🎂</Text>
        </TouchableOpacity>
        <BirthdayModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingBirthday(null);
          }}
          onSave={handleSave}
          editingBirthday={editingBirthday}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} translucent={false} />
      <View style={[styles.sortRow, { backgroundColor: cardBg }]}>
        <Text style={[styles.sortLabel, { color: secondaryText }]}>{t('sortBy')}:</Text>
        <View style={styles.sortTabs}>
          {(['date', 'name', 'age'] as const).map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.sortTab, { backgroundColor: sortTabBg }, sortBy === key && styles.sortTabActive]}
              onPress={() => setSortBy(key)}
            >
              <Text style={[styles.sortTabText, { color: daysBadgeTextColor }, sortBy === key && styles.sortTabTextActive]}>
                {key === 'date' ? t('sortByDate') : key === 'name' ? t('sortByName') : t('sortByAge')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={sortedBirthdays}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.fab} onPress={() => { setEditingBirthday(null); setModalVisible(true); }}>
        <Text style={styles.fabText}>🎂</Text>
      </TouchableOpacity>
      <BirthdayModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingBirthday(null);
        }}
        onSave={handleSave}
        editingBirthday={editingBirthday}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
  },
  sortLabel: { fontSize: 14, color: '#666' },
  sortTabs: { flexDirection: 'row', gap: 8 },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  sortTabActive: { backgroundColor: '#8b5cf6' },
  sortTabText: { fontSize: 12, color: '#333' },
  sortTabTextActive: { fontWeight: '600', color: '#fff' },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  fabText: { fontSize: 32 },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    overflow: 'hidden',
  },
  listItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  listItemLeft: {
    flex: 1,
  },
  listItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  listItemDetails: {
    fontSize: 14,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  listItemNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  listItemRight: {
    marginLeft: 16,
  },
  daysBadge: {
    backgroundColor: '#f0e6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysBadgeToday: {
    backgroundColor: '#8b5cf6',
  },
  daysBadgeText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  daysBadgeTextToday: {
    color: '#fff',
  },
  rightAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
