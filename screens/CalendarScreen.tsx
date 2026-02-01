import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Birthday } from '../types';
import { getBirthdays } from '../utils/storage';
import { getBirthdaysOnDate, enrichBirthday } from '../utils/dateHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

const DAYS_IN_WEEK = 7;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PAD = 24;
const CELL_GAP = 4;
const CELL_BASE = Math.floor((SCREEN_WIDTH - GRID_PAD - 6 * CELL_GAP) / 7);
const CELL_SIZE = Math.max(32, CELL_BASE - CELL_GAP);

export const CalendarScreen: React.FC = () => {
  const { t, locale } = useTranslation();
  const { isDark } = useTheme();
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const loadBirthdays = useCallback(async () => {
    const loaded = await getBirthdays();
    setBirthdays(loaded);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBirthdays();
    }, [loadBirthdays])
  );

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );
  const firstDayOfWeek = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentYear, currentMonth]
  );

  const grid = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % DAYS_IN_WEEK !== 0) cells.push(null);
    return cells;
  }, [firstDayOfWeek, daysInMonth]);

  const hasBirthday = useCallback(
    (day: number) => getBirthdaysOnDate(birthdays, currentMonth, day).length > 0,
    [birthdays, currentMonth]
  );

  const birthdaysOnSelected = useMemo(() => {
    if (selectedDate === null) return [];
    return getBirthdaysOnDate(birthdays, currentMonth, selectedDate);
  }, [birthdays, currentMonth, selectedDate]);

  const enrichedOnSelected = useMemo(
    () => birthdaysOnSelected.map(enrichBirthday),
    [birthdaysOnSelected]
  );

  const goPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const monthTitle = `${locale.monthNames[currentMonth]} ${currentYear}`;
  const bg = isDark ? '#0a0a14' : '#F5F5F5';
  const cardBg = isDark ? '#2a2a3e' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const secondaryColor = isDark ? '#a78bfa' : '#8b5cf6';
  const mutedColor = isDark ? '#888' : '#999';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: textColor }]}>{t('calendar')}</Text>
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={goPrev} style={styles.arrow}>
            <Text style={[styles.arrowText, { color: secondaryColor }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: textColor }]}>{monthTitle}</Text>
          <TouchableOpacity onPress={goNext} style={styles.arrow}>
            <Text style={[styles.arrowText, { color: secondaryColor }]}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekdayRow}>
          {locale.dayNamesShort.map((name) => (
            <Text key={name} style={[styles.weekdayCell, { color: mutedColor }]}>
              {name}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.gridWrap}>
        <View style={styles.grid}>
          {grid.map((day, index) => {
            const isLastInRow = index % DAYS_IN_WEEK === 6;
            if (day === null) {
              return (
                <View
                  key={`empty-${index}`}
                  style={[styles.cell, isLastInRow && styles.cellLastInRow]}
                />
              );
            }
            const hasBday = hasBirthday(day);
            const isSelected = selectedDate === day;
            const isPurple = hasBday || isSelected;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.cell,
                  isLastInRow && styles.cellLastInRow,
                  isPurple && { backgroundColor: secondaryColor },
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text
                  style={[
                    styles.cellDay,
                    { color: isPurple ? '#fff' : textColor },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={selectedDate !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDate(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedDate(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {selectedDate != null
                ? `${selectedDate} ${locale.monthNamesShort[currentMonth]}`
                : ''}
            </Text>
            {enrichedOnSelected.length === 0 ? (
              <Text style={[styles.modalEmpty, { color: mutedColor }]}>
                {t('noBirthdaysOnDate')}
              </Text>
            ) : (
              <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
                {enrichedOnSelected.map((b) => {
                  const dateStr = `${b.dateOfBirth.getDate()} ${locale.monthNamesShort[b.dateOfBirth.getMonth()]}`;
                  const ageWord = (t('yearWord', b.age) as string);
                  return (
                    <View key={b.id} style={[styles.modalCard, { backgroundColor: isDark ? '#1e1e2e' : '#f5f0ff', borderColor: secondaryColor }]}>
                      <Text style={[styles.modalName, { color: textColor }]}>🎂 {b.name}</Text>
                      <Text style={[styles.modalDetail, { color: mutedColor }]}>{dateStr}</Text>
                      <Text style={[styles.modalDetail, { color: textColor }]}>
                        {t('turns', b.age)} {ageWord}
                      </Text>
                      {b.note?.trim() ? (
                        <Text style={[styles.modalNote, { color: mutedColor }]}>{b.note}</Text>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>
            )}
            <TouchableOpacity
              style={[styles.modalClose, { backgroundColor: secondaryColor }]}
              onPress={() => setSelectedDate(null)}
            >
              <Text style={styles.modalCloseText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  arrow: { padding: 8 },
  arrowText: { fontSize: 28, fontWeight: '600' },
  monthTitle: { fontSize: 18, fontWeight: '600' },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  weekdayCell: {
    fontSize: 12,
    width: CELL_SIZE + CELL_GAP,
    textAlign: 'center',
  },
  scroll: { flex: 1 },
  gridWrap: { padding: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: SCREEN_WIDTH - GRID_PAD,
  },
  cell: {
    width: CELL_SIZE + CELL_GAP,
    height: CELL_SIZE + CELL_GAP,
    marginRight: CELL_GAP,
    marginBottom: CELL_GAP,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellLastInRow: {
    marginRight: 0,
  },
  cellDay: { fontSize: 14, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalEmpty: { fontSize: 15, marginBottom: 20 },
  modalList: { maxHeight: 320, marginBottom: 16 },
  modalCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  modalName: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  modalDetail: { fontSize: 14, marginBottom: 2 },
  modalNote: { fontSize: 13, marginTop: 6, fontStyle: 'italic' },
  modalClose: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
