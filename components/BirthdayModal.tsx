import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Birthday } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface BirthdayModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (birthday: Omit<Birthday, 'id' | 'createdAt'>) => Promise<void>;
  editingBirthday?: Birthday | null;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({
  visible,
  onClose,
  onSave,
  editingBirthday,
}) => {
  const { t } = useTranslation();
  const PRESET_TAGS = [t('tagFamily'), t('tagFriends'), t('tagWork'), t('tagOther')];
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [note, setNote] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setName('');
    setDateOfBirth(new Date());
    setNote('');
    setPhone('');
    setPhotoUri(undefined);
    setTags([]);
    setShowDatePicker(false);
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  useEffect(() => {
    if (editingBirthday) {
      setName(editingBirthday.name);
      setDateOfBirth(new Date(editingBirthday.dateOfBirth));
      setNote(editingBirthday.note || '');
      setPhone(editingBirthday.phone || '');
      setPhotoUri(editingBirthday.photoUri);
      setTags(editingBirthday.tags || []);
    } else {
      resetForm();
    }
  }, [editingBirthday, visible]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('validationError'), t('pleaseEnterName'));
      return;
    }

    if (dateOfBirth > new Date()) {
      Alert.alert(t('validationError'), t('dateCannotBeFuture'));
      return;
    }

    setIsSaving(true);
    try {
      ReactNativeHapticFeedback.trigger('impactMedium', { enableVibrateFallback: true });
      await onSave({
        name: name.trim(),
        dateOfBirth,
        note: note.trim() || undefined,
        phone: phone.trim() || undefined,
        photoUri,
        tags: tags.length > 0 ? tags : undefined,
      });
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert(t('error'), t('failedToSave'));
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editingBirthday ? t('editBirthday') : t('addBirthday')}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} contentContainerStyle={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personName')}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('enterName')}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('phone')}</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder={t('phonePlaceholder')}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('tags')}</Text>
              <View style={styles.tagsRow}>
                {PRESET_TAGS.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagChip, tags.includes(tag) && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagChipText, tags.includes(tag) && styles.tagChipTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('dateOfBirth')}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {dateOfBirth.toLocaleDateString('uk-UA', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setDateOfBirth(selectedDate);
                      }
                    }}
                    minimumDate={new Date(1900, 0, 1)}
                    maximumDate={new Date()}
                    textColor="#000"
                    themeVariant="light"
                    accentColor="#8b5cf6"
                  />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('note')}</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={note}
                onChangeText={setNote}
                placeholder={t('addNote')}
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? t('saving') : t('save')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentScroll: { maxHeight: 400 },
  content: {
    gap: 20,
    paddingBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  tagChipActive: {
    backgroundColor: '#8b5cf6',
  },
  tagChipText: { fontSize: 14, color: '#333' },
  tagChipTextActive: { color: '#fff', fontWeight: '600' },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    color: '#000',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  noteInput: {
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  dateButtonText: {
    color: '#000',
    fontSize: 16,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    minHeight: 200,
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
