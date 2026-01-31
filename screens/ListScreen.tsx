import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
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

type SortType = 'date' | 'name' | 'age';

export const ListScreen: React.FC = () => {
  const { t } = useTranslation();
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
          style={styles.listItem}
          onPress={() => handleEdit(item)}
          activeOpacity={0.7}
        >
          <View style={styles.listItemContent}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text style={styles.listItemDetails}>
                {t('turns', item.age + 1)} • {formatDate(item.nextBirthday)}
              </Text>
              {item.note && (
                <Text style={styles.listItemNote}>{item.note}</Text>
              )}
            </View>
            <View style={styles.listItemRight}>
              <View style={[styles.daysBadge, item.daysUntil === 0 && styles.daysBadgeToday]}>
                <Text style={styles.daysBadgeText}>{getDaysText()}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  if (birthdays.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <EmptyState message={t('noBirthdaysYet')} emoji="🎂" />
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>{t('sortBy')}:</Text>
        <View style={styles.sortTabs}>
          {(['date', 'name', 'age'] as const).map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.sortTab, sortBy === key && styles.sortTabActive]}
              onPress={() => setSortBy(key)}
            >
              <Text style={[styles.sortTabText, sortBy === key && styles.sortTabTextActive]}>
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
    backgroundColor: '#0a0a14',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  sortLabel: { fontSize: 14, color: '#999' },
  sortTabs: { flexDirection: 'row', gap: 8 },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#2a2a3e',
  },
  sortTabActive: { backgroundColor: '#8b5cf6' },
  sortTabText: { fontSize: 12, color: '#fff' },
  sortTabTextActive: { fontWeight: '600' },
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
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a4e',
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
    color: '#fff',
    marginBottom: 4,
  },
  listItemDetails: {
    fontSize: 14,
    color: '#a78bfa',
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
    backgroundColor: '#3a3a4e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysBadgeToday: {
    backgroundColor: '#8b5cf6',
  },
  daysBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
