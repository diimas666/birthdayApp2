import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BirthdayWithAge } from '../types';
import { formatDateShort } from '../utils/dateHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { spacing, fontSize, borderRadius, moderateScale, verticalScale } from '../utils/scale';

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
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.sm,
    width: moderateScale(280),
    minHeight: verticalScale(180),
    borderWidth: 1,
    borderColor: '#3a3a4e',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(8),
    elevation: 5,
  },
  cardToday: {
    backgroundColor: '#3a2a5e',
    borderColor: '#8b5cf6',
    borderWidth: 2,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(12),
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: spacing.sm,
  },
  age: {
    fontSize: fontSize.lg,
    color: '#a78bfa',
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: fontSize.base,
    color: '#999',
    marginBottom: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
