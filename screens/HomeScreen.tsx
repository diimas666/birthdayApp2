import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Birthday, BirthdayWithAge } from '../types';
import { getBirthdays, saveBirthday } from '../utils/storage';
import { getBirthdaysByFilter, getTodaysBirthdays, enrichBirthday } from '../utils/dateHelpers';
import { rescheduleAllNotifications } from '../utils/notifications';
import { getLastConfettiDate, setLastConfettiDate } from '../utils/settingsStorage';
import { FestiveBirthdayCard } from '../components/FestiveBirthdayCard';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { BirthdayModal } from '../components/BirthdayModal';
import { EmptyState } from '../components/EmptyState';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadBirthdays = async () => {
    const loaded = await getBirthdays();
    setBirthdays(loaded);

    const todayList = getTodaysBirthdays(loaded);
    if (todayList.length > 0) {
      const todayStr = new Date().toDateString();
      const lastConfetti = await getLastConfettiDate();
      if (lastConfetti !== todayStr) {
        await setLastConfettiDate(todayStr);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  const filteredBirthdays = useMemo(() => {
    let filtered = getBirthdaysByFilter(birthdays, activeFilter);
    if (selectedTag) {
      filtered = filtered.filter(b => b.tags?.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(query) ||
        (b.note && b.note.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [birthdays, activeFilter, searchQuery, selectedTag]);

  const currentDate = useMemo(() => t('currentDateFormatted') as string, [t]);

  const stats = useMemo(() => {
    const enriched = birthdays.map(enrichBirthday).sort((a, b) => a.daysUntil - b.daysUntil);
    const countThisYear = enriched.length;
    const nearest = enriched[0] ?? null;
    return { countThisYear, nearest };
  }, [birthdays]);

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [])
  );

  const handleSave = async (birthdayData: Omit<Birthday, 'id' | 'createdAt'>) => {
    const newBirthday: Birthday = {
      ...birthdayData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    await saveBirthday(newBirthday);
    await rescheduleAllNotifications([...birthdays, newBirthday]);
    await loadBirthdays();
  };

  const renderBirthdayCard = ({ item }: { item: BirthdayWithAge }) => {
    return <FestiveBirthdayCard birthday={item} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" translucent={false} />
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: 0 }}
          fadeOut={true}
        />
      )}
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{t('greeting')}</Text>
            <Text style={styles.greetingSubtext}>{t('greetingSubtext')}</Text>
          </View>
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={t('searchPlaceholder')} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <View style={styles.tagRow}>
          <TouchableOpacity
            style={[styles.tagChip, !selectedTag && styles.tagChipActive]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[styles.tagChipText, !selectedTag && styles.tagChipTextActive]}>{t('allTags')}</Text>
          </TouchableOpacity>
          {[t('tagFamily'), t('tagFriends'), t('tagWork'), t('tagOther')].map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagChip, selectedTag === tag && styles.tagChipActive]}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Text style={[styles.tagChipText, selectedTag === tag && styles.tagChipTextActive]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.dateText}>{currentDate}</Text>

        <View style={styles.statsBlock}>
          <Text style={styles.statsTitle}>{t('statistics')}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>{t('statsThisYear')}:</Text>
            <Text style={styles.statsValue}>{stats.countThisYear}</Text>
          </View>
          {stats.nearest && (
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>{t('statsNearest')}:</Text>
              <Text style={styles.statsValue}>{stats.nearest.name} — {stats.nearest.daysUntil === 0 ? t('todayShort') : stats.nearest.daysUntil === 1 ? t('tomorrow') : t('inDays', stats.nearest.daysUntil)}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBirthdays.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'today' ? t('todaysBirthdays') : t('sectionBirthdays')}
            </Text>
            {filteredBirthdays.map((item) => (
              <FestiveBirthdayCard key={item.id} birthday={item} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <EmptyState
              message={searchQuery ? t('noResults') : t('noBirthdaysInPeriod')}
              emoji="🎂"
            />
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>🎂</Text>
      </TouchableOpacity>

      <BirthdayModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  tagChipActive: { backgroundColor: '#8b5cf6' },
  tagChipText: { fontSize: 12, color: '#333' },
  tagChipTextActive: { color: '#fff', fontWeight: '600' },
  dateText: {
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  statsBlock: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  statsTitle: { fontSize: 14, fontWeight: '600', color: '#8b5cf6', marginBottom: 8 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 },
  statsLabel: { fontSize: 12, color: '#666', marginRight: 6 },
  statsValue: { fontSize: 12, color: '#000', fontWeight: '500' },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 20,
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
  fabText: {
    fontSize: 32,
  },
});
