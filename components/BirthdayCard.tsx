import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BirthdayWithAge } from '../types';
import { formatDateShort } from '../utils/dateHelpers';
import { useTranslation } from '../hooks/useTranslation';

interface BirthdayCardProps {
  birthday: BirthdayWithAge;
  isToday?: boolean;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({ birthday, isToday = false }) => {
  const { t } = useTranslation();
  
  const getDaysText = () => {
    if (birthday.daysUntil === 0) return t('today');
    if (birthday.daysUntil === 1) return t('tomorrow');
    return t('inDays', birthday.daysUntil);
  };

  return (
    <View style={[styles.card, isToday && styles.cardToday]}>
      <View style={styles.cardContent}>
        <Text style={styles.name}>{birthday.name}</Text>
        <Text style={styles.age}>{t('turns', birthday.age + 1)}</Text>
        <Text style={styles.date}>{formatDateShort(birthday.nextBirthday)}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getDaysText()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    width: 280,
    minHeight: 180,
    borderWidth: 1,
    borderColor: '#3a3a4e',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardToday: {
    backgroundColor: '#3a2a5e',
    borderColor: '#8b5cf6',
    borderWidth: 2,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  age: {
    fontSize: 18,
    color: '#a78bfa',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 11,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
