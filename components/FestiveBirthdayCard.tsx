import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { BirthdayWithAge } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { GreetingModal } from './GreetingModal';

interface FestiveBirthdayCardProps {
  birthday: BirthdayWithAge;
  onPress?: () => void;
}

const openWhatsApp = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleaned}`;
  Linking.openURL(url).catch(() => Alert.alert('', 'Не вдалося відкрити WhatsApp'));
};

const openCall = (phone: string) => {
  const url = `tel:${phone.trim()}`;
  Linking.openURL(url).catch(() => Alert.alert('', 'Не вдалося відкрити дзвінок'));
};

const openGiftSearch = () => {
  Linking.openURL('https://www.google.com/search?q=ідеї+подарунків').catch(() => {});
};

export const FestiveBirthdayCard: React.FC<FestiveBirthdayCardProps> = ({ birthday, onPress }) => {
  const { t } = useTranslation();
  const [greetingVisible, setGreetingVisible] = useState(false);
  const hasPhone = Boolean(birthday.phone?.trim());

  const getDaysText = () => {
    if (birthday.daysUntil === 0) return { text: '0', label: t('todayShort') };
    if (birthday.daysUntil === 1) return { text: '1', label: t('tomorrow') };
    return { text: birthday.daysUntil.toString(), label: t('inDays', birthday.daysUntil) };
  };

  const ageWord = t('yearWord', birthday.age) as string;

  const daysInfo = getDaysText();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
        <View style={styles.patternCircle3} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{birthday.name}</Text>
            <Text style={styles.date}>{formatDate(birthday.nextBirthday)}</Text>
            <Text style={styles.age}>{t('ageLabel')}: {birthday.age} {ageWord}</Text>
          </View>
          <View style={styles.daysBadge}>
            <Text style={styles.daysNumber}>{daysInfo.text}</Text>
            <Text style={styles.daysLabel}>{daysInfo.label}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setGreetingVisible(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e040fb' }]}>
              <Text style={styles.actionIconText}>🎂</Text>
            </View>
            <Text style={styles.actionLabel}>{t('greeting')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => hasPhone && openWhatsApp(birthday.phone!)}
            disabled={!hasPhone}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#25D366', opacity: hasPhone ? 1 : 0.5 }]}>
              <Text style={styles.actionIconText}>💬</Text>
            </View>
            <Text style={styles.actionLabel}>{t('whatsApp')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={openGiftSearch}>
            <View style={[styles.actionIcon, { backgroundColor: '#8b5cf6' }]}>
              <Text style={styles.actionIconText}>🎁</Text>
            </View>
            <Text style={styles.actionLabel}>{t('sendGift')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => hasPhone && openCall(birthday.phone!)}
            disabled={!hasPhone}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#0084FF', opacity: hasPhone ? 1 : 0.5 }]}>
              <Text style={styles.actionIconText}>📞</Text>
            </View>
            <Text style={styles.actionLabel}>{t('call')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GreetingModal
        visible={greetingVisible}
        birthday={birthday}
        onClose={() => setGreetingVisible(false)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    minHeight: 180,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  patternCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    top: -40,
    right: -40,
  },
  patternCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    bottom: -20,
    left: -20,
  },
  patternCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    top: '50%',
    right: 20,
  },
  content: {
    padding: 16,
    position: 'relative',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  age: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  daysBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    minWidth: 70,
  },
  daysNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  daysLabel: {
    fontSize: 11,
    color: '#fff',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
});
