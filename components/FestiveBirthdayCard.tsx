import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform, ActionSheetIOS } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BirthdayWithAge } from '../types';
import { formatDate } from '../utils/dateHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { GreetingModal } from './GreetingModal';

interface FestiveBirthdayCardProps {
  birthday: BirthdayWithAge;
  onPress?: () => void;
  onGiftPress?: (name: string) => void;
}

const openTelegram = (phone: string, errorMsg: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned.length) return;
  const url = `https://t.me/+${cleaned}`;
  Linking.openURL(url).catch(() => Alert.alert('', errorMsg));
};

const openCall = (phone: string, errorMsg: string) => {
  const url = `tel:${phone.trim()}`;
  Linking.openURL(url).catch(() => Alert.alert('', errorMsg));
};

const openGiftSearch = (searchQuery: string) => {
  const q = encodeURIComponent(searchQuery);
  Linking.openURL(`https://www.google.com/search?q=${q}`).catch(() => {});
};

const getCardGradientColor = (daysUntil: number): string => {
  if (daysUntil === 0) return '#6d28d9';
  if (daysUntil <= 7) return '#7c3aed';
  return '#8b5cf6';
};

export const FestiveBirthdayCard: React.FC<FestiveBirthdayCardProps> = ({ birthday, onPress, onGiftPress }) => {
  const { t } = useTranslation();
  const [greetingVisible, setGreetingVisible] = useState(false);
  const hasPhone = Boolean(birthday.phone?.trim());
  const cardColor = getCardGradientColor(birthday.daysUntil);

  const getDaysText = () => {
    if (birthday.daysUntil === 0) return { text: '0', label: t('todayShort') };
    if (birthday.daysUntil === 1) return { text: '1', label: t('tomorrow') };
    return { text: birthday.daysUntil.toString(), label: t('inDays', birthday.daysUntil) };
  };

  const ageWord = t('yearWord', birthday.age) as string;
  const daysInfo = getDaysText();

  const handleLongPress = () => {
    if (!hasPhone) return;
    if (Platform.OS === 'ios' && ActionSheetIOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('cancel'), t('call')],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) openCall(birthday.phone!, t('openCallFailed'));
        }
      );
    } else {
      Alert.alert(t('call'), birthday.phone!, [
        { text: t('cancel'), style: 'cancel' },
        { text: t('call'), onPress: () => openCall(birthday.phone!, t('openCallFailed')) },
      ]);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.92}
    >
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
        <View style={styles.patternCircle3} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.nameSection}>
            {birthday.isImportant && (
              <Text style={styles.pinBadge}>⭐</Text>
            )}
            <Text style={styles.name}>{birthday.name}</Text>
            <Text style={styles.date}>{formatDate(birthday.nextBirthday)}</Text>
            <Text style={styles.age}>{t('ageLabel')}: {birthday.age} {ageWord}</Text>
          </View>
          <View style={styles.daysBadge}>
            <Text style={styles.daysNumber}>{daysInfo.text}</Text>
            <Text style={styles.daysLabel}>{daysInfo.label}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setGreetingVisible(true)}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🎂</Text>
            </View>
            <Text style={styles.actionLabel}>{t('greeting')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => hasPhone && openTelegram(birthday.phone!, t('openTelegramFailed'))}
            disabled={!hasPhone}
          >
            <View style={[styles.actionIcon, !hasPhone && styles.actionIconDisabled]}>
              <Ionicons name="send" size={24} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>{t('telegram')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => (onGiftPress ? onGiftPress(birthday.name) : openGiftSearch(t('giftSearchQuery')))}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🎁</Text>
            </View>
            <Text style={styles.actionLabel}>{t('sendGift')}</Text>
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
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 172,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pinBadge: {
    fontSize: 14,
    marginBottom: 2,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  patternCircle1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    top: -50,
    right: -50,
  },
  patternCircle2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    bottom: -25,
    left: -25,
  },
  patternCircle3: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    top: '45%',
    right: 24,
  },
  content: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  nameSection: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.92,
    marginBottom: 2,
  },
  age: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.82,
  },
  daysBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: 76,
  },
  daysNumber: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  daysLabel: {
    fontSize: 11,
    color: '#fff',
    marginTop: 3,
    opacity: 0.95,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconDisabled: {
    opacity: 0.5,
  },
  actionIconText: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
  },
});
