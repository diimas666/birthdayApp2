import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeMode } from '../utils/settingsStorage';
import { getNotificationHour, setNotificationHour } from '../utils/settingsStorage';
import { exportBirthdaysJson, importBirthdaysFromJson, getBirthdays } from '../utils/storage';
import { rescheduleAllNotifications } from '../utils/notifications';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setThemeMode, isDark } = useTheme();
  const [notificationHour, setNotificationHourState] = useState(9);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importJson, setImportJson] = useState('');

  useEffect(() => {
    getNotificationHour().then(setNotificationHourState);
  }, []);

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const handleHourChange = async (hour: number) => {
    await setNotificationHour(hour);
    setNotificationHourState(hour);
    const birthdays = await getBirthdays();
    await rescheduleAllNotifications(birthdays, hour);
  };

  const handleExport = async () => {
    try {
      const json = await exportBirthdaysJson();
      await Share.share({
        message: json,
        title: 'birthdays_export.json',
      });
      Alert.alert(t('exportSuccess'), '');
    } catch (e) {
      Alert.alert(t('error'), String(e));
    }
  };

  const handleImport = async () => {
    if (!importJson.trim()) {
      Alert.alert(t('validationError'), 'Вставте JSON');
      return;
    }
    try {
      const { imported, total } = await importBirthdaysFromJson(importJson.trim());
      setImportModalVisible(false);
      setImportJson('');
      const birthdays = await getBirthdays();
      await rescheduleAllNotifications(birthdays);
      Alert.alert(t('importSuccess'), `Імпортовано: ${imported}, всього: ${total}`);
    } catch (e) {
      Alert.alert(t('importError'), String(e));
    }
  };

  const bg = isDark ? '#0a0a14' : '#F5F5F5';
  const cardBg = isDark ? '#2a2a3e' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const secondaryColor = isDark ? '#a78bfa' : '#8b5cf6';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{t('settings')}</Text>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>{t('theme')}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.optionButton, theme === 'light' && { backgroundColor: secondaryColor }]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[styles.optionText, theme === 'light' && styles.optionTextActive]}>{t('themeLight')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, theme === 'dark' && { backgroundColor: secondaryColor }]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[styles.optionText, theme === 'dark' && styles.optionTextActive]}>{t('themeDark')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>{t('notificationTime')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hoursRow}>
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.hourChip, notificationHour === h && { backgroundColor: secondaryColor }]}
                onPress={() => handleHourChange(h)}
              >
                <Text style={[styles.hourChipText, notificationHour === h && styles.hourChipTextActive]}>
                  {h}:00
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.menuRow} onPress={handleExport}>
            <Text style={[styles.menuRowText, { color: textColor }]}>{t('exportData')}</Text>
            <Text style={styles.menuRowArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setImportModalVisible(true)}>
            <Text style={[styles.menuRowText, { color: textColor }]}>{t('importData')}</Text>
            <Text style={styles.menuRowArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>{t('about')}</Text>
          <Text style={[styles.aboutText, { color: textColor }]}>{t('aboutText')}</Text>
          <Text style={[styles.versionText, { color: secondaryColor }]}>{t('version')} 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal visible={importModalVisible} transparent animationType="slide">
        <View style={styles.importOverlay}>
          <View style={[styles.importModal, { backgroundColor: cardBg }]}>
            <Text style={[styles.importTitle, { color: textColor }]}>{t('importData')}</Text>
            <TextInput
              style={[styles.importInput, { color: textColor, borderColor: secondaryColor }]}
              value={importJson}
              onChangeText={setImportJson}
              placeholder="Вставте JSON..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={8}
            />
            <View style={styles.importButtons}>
              <TouchableOpacity style={styles.importButtonCancel} onPress={() => { setImportModalVisible(false); setImportJson(''); }}>
                <Text style={styles.importButtonTextCancel}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.importButtonOk, { backgroundColor: secondaryColor }]} onPress={handleImport}>
                <Text style={styles.importButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  optionButtonActive: { backgroundColor: '#8b5cf6' },
  optionText: { fontSize: 16, color: '#333' },
  optionTextActive: { color: '#fff' },
  hoursRow: { flexDirection: 'row', marginHorizontal: -4 },
  hourChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  hourChipActive: { backgroundColor: '#8b5cf6' },
  hourChipText: { fontSize: 14, color: '#333' },
  hourChipTextActive: { color: '#fff' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  menuRowText: { fontSize: 16 },
  menuRowArrow: { fontSize: 18, color: '#666' },
  aboutText: { fontSize: 14, marginBottom: 8 },
  versionText: { fontSize: 12 },
  importOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  importModal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  importTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  importInput: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: 'top' },
  importButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  importButtonCancel: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#eee', alignItems: 'center' },
  importButtonOk: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  importButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  importButtonTextCancel: { fontSize: 16, fontWeight: '600', color: '#333' },
});
