import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Birthday, BirthdayWithAge } from '../types';
import { getBirthdays, saveBirthday } from '../utils/storage';
import { getBirthdaysByFilter, getTodaysBirthdays, enrichBirthday } from '../utils/dateHelpers';
import { rescheduleAllNotifications } from '../utils/notifications';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadBirthdays = async () => {
    const loaded = await getBirthdays();
    setBirthdays(loaded);
    
    const today = getTodaysBirthdays(loaded);
    if (today.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const filteredBirthdays = useMemo(() => {
    let filtered = getBirthdaysByFilter(birthdays, activeFilter);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(query) ||
        (b.note && b.note.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [birthdays, activeFilter, searchQuery]);

  const currentDate = useMemo(() => {
    const today = new Date();
    const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const months = [
      'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
      'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    return `${today.getDate()}.${months[today.getMonth()]} ${days[today.getDay()]}`;
  }, []);

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
            <Text style={styles.greeting}>Привіт,</Text>
            <Text style={styles.greetingSubtext}>Ось оновлення на сьогодні:</Text>
          </View>
        </View>
        
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBirthdays.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeFilter === 'today' ? t('todaysBirthdays') : 'Дні народження'}
            </Text>
            {filteredBirthdays.map((item) => (
              <FestiveBirthdayCard key={item.id} birthday={item} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <EmptyState 
              message={searchQuery ? 'Нічого не знайдено' : 'У цей період немає днів народження'} 
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
  dateText: {
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
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
