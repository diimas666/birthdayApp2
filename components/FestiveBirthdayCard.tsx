import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Platform, ActionSheetIOS } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BirthdayWithAge } from '../types';
import { formatDate, formatDateShort } from '../utils/dateHelpers';
import { getZodiacSign } from '../utils/zodiac';
import { useTranslation } from '../hooks/useTranslation';
import { GreetingModal } from './GreetingModal';
import { spacing, fontSize, borderRadius, moderateScale, verticalScale } from '../utils/scale';

const DOUBLE_TAP_DELAY_MS = 350;

interface FestiveBirthdayCardProps {
  birthday: BirthdayWithAge;
  onPress?: () => void;
  onGiftPress?: (name: string) => void;
  /** Два тапи — позначка «Привітав» (зелена рамка + галочка). */
  onGreetedToggle?: (id: string) => void;
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
  Linking.openURL(`https://www.google.com/search?q=${q}`).catch(() => { });
};

const getCardGradientColor = (daysUntil: number): string => {
  if (daysUntil === 0) return '#6d28d9';
  if (daysUntil <= 7) return '#7c3aed';
  return '#8b5cf6';
};

export const FestiveBirthdayCard: React.FC<FestiveBirthdayCardProps> = ({ birthday, onPress, onGiftPress, onGreetedToggle }) => {
  const { t } = useTranslation();
  const [greetingVisible, setGreetingVisible] = useState(false);
  const lastTapRef = useRef<number>(0);
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPhone = Boolean(birthday.phone?.trim());
  const isGreeted = Boolean(birthday.greetedAt);
  const cardColor = isGreeted ? '#15803d' : getCardGradientColor(birthday.daysUntil);
  const zodiac = getZodiacSign(new Date(birthday.dateOfBirth));

  const handlePress = () => {
    if (onGreetedToggle) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY_MS) {
        if (singleTapTimerRef.current) {
          clearTimeout(singleTapTimerRef.current);
          singleTapTimerRef.current = null;
        }
        onGreetedToggle(birthday.id);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
      singleTapTimerRef.current = setTimeout(() => {
        singleTapTimerRef.current = null;
        onPress?.();
      }, DOUBLE_TAP_DELAY_MS);
    } else {
      onPress?.();
    }
  };

  const getDaysText = () => {
    if (birthday.daysUntil === 0) return { text: '0', label: t('todayShort') };
    if (birthday.daysUntil === 1) return { text: '1', label: t('tomorrow') };
    return { text: birthday.daysUntil.toString(), label: t('inDays', birthday.daysUntil) };
  };

  const ageWord = t('yearWord', birthday.age) as string;
  const daysInfo = getDaysText();
  const showAge = !birthday.hideYear;
  const dateDisplay = birthday.hideYear ? formatDateShort(birthday.nextBirthday) : formatDate(birthday.nextBirthday);

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
      style={[
        styles.card,
        { backgroundColor: cardColor },
        isGreeted && styles.cardGreeted,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.92}
    >
      {isGreeted && (
        <View style={styles.greetedCheckmark}>
          <Ionicons name="checkmark-circle" size={28} color="#fff" />
        </View>
      )}
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
            <View style={styles.nameRow}>
              <Text style={styles.name}>{birthday.name}</Text>
              <Text style={styles.zodiacIcon}>{zodiac.symbol}</Text>
            </View>
            <Text style={styles.date}>{dateDisplay}</Text>
            {showAge ? (
              <Text style={styles.age}>{t('ageLabel')}: {birthday.age} {ageWord}</Text>
            ) : (
              <Text style={styles.age}>{t('birthdayLabel')}</Text>
            )}
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
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(10),
    elevation: 8,
    minHeight: verticalScale(172),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardGreeted: {
    borderWidth: 3,
    borderColor: '#22c55e',
    shadowColor: '#15803d',
  },
  greetedCheckmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
  },
  pinBadge: {
    fontSize: fontSize.md,
    marginBottom: moderateScale(2),
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
    width: moderateScale(140),
    height: moderateScale(140),
    borderRadius: moderateScale(70),
    backgroundColor: '#fff',
    top: moderateScale(-50),
    right: moderateScale(-50),
  },
  patternCircle2: {
    position: 'absolute',
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: '#fff',
    bottom: moderateScale(-25),
    left: moderateScale(-25),
  },
  patternCircle3: {
    position: 'absolute',
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#fff',
    top: '45%',
    right: spacing.lg,
  },
  content: {
    padding: spacing.lg,
    position: 'relative',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateScale(18),
  },
  nameSection: {
    flex: 1,
    paddingRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  zodiacIcon: {
    fontSize: fontSize.xl,
    color: '#fff',
    opacity: 0.95,
  },
  date: {
    fontSize: fontSize.base,
    color: '#fff',
    opacity: 0.92,
    marginBottom: moderateScale(2),
  },
  age: {
    fontSize: fontSize.sm,
    color: '#fff',
    opacity: 0.82,
  },
  daysBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: moderateScale(76),
  },
  daysNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  daysLabel: {
    fontSize: fontSize.xs,
    color: '#fff',
    marginTop: moderateScale(3),
    opacity: 0.95,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionIconDisabled: {
    opacity: 0.5,
  },
  actionIconText: {
    fontSize: fontSize.xxl,
  },
  actionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
  },
});
