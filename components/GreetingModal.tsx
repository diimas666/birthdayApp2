import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { getGreetingText, GreetingStyle, GreetingRecipient } from '../utils/greetingTemplates';
import { BirthdayWithAge } from '../types';

const STYLES: GreetingStyle[] = ['short', 'official', 'funny'];
const RECIPIENTS: GreetingRecipient[] = ['friend', 'family', 'colleague'];

const STYLE_KEYS: Record<GreetingStyle, keyof typeof import('../locales/uk').uk> = {
  short: 'greetingShort',
  official: 'greetingOfficial',
  funny: 'greetingFunny',
};
const RECIPIENT_KEYS: Record<GreetingRecipient, keyof typeof import('../locales/uk').uk> = {
  friend: 'greetingForFriend',
  family: 'greetingForFamily',
  colleague: 'greetingForColleague',
};

interface GreetingModalProps {
  visible: boolean;
  birthday: BirthdayWithAge | null;
  onClose: () => void;
}

const openWhatsAppWithText = (phone: string, text: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleaned}?text=${encoded}`;
  Linking.openURL(url).catch(() => Alert.alert('', 'Не вдалося відкрити WhatsApp'));
};

const openSmsWithBody = (phone: string, body: string) => {
  const url = `sms:${phone.trim()}?body=${encodeURIComponent(body)}`;
  Linking.openURL(url).catch(() => Alert.alert('', 'Не вдалося відкрити SMS'));
};

export const GreetingModal: React.FC<GreetingModalProps> = ({ visible, birthday, onClose }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [style, setStyle] = useState<GreetingStyle>('short');
  const [recipient, setRecipient] = useState<GreetingRecipient>('friend');

  const name = birthday?.name ?? '';
  const greetingText = useMemo(
    () => (name ? getGreetingText(style, recipient, name) : ''),
    [style, recipient, name]
  );

  const hasPhone = Boolean(birthday?.phone?.trim());
  const cardBg = isDark ? '#2a2a3e' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const secondaryColor = isDark ? '#a78bfa' : '#8b5cf6';

  const handleCopy = async () => {
    try {
      await Share.share({
        message: greetingText,
        title: t('generateGreeting'),
      });
    } catch {
      Alert.alert(t('error'), 'Не вдалося відкрити поширення');
    }
  };

  const handleWhatsApp = () => {
    if (hasPhone && birthday?.phone) openWhatsAppWithText(birthday.phone, greetingText);
    else Alert.alert('', 'Додайте номер телефону в картку контакту');
  };

  const handleSms = () => {
    if (hasPhone && birthday?.phone) openSmsWithBody(birthday.phone, greetingText);
    else Alert.alert('', 'Додайте номер телефону в картку контакту');
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: cardBg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>{t('generateGreeting')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={[styles.closeBtn, { color: secondaryColor }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: textColor }]}>{t('greetingStyleLabel')}</Text>
            <View style={styles.chipRow}>
              {STYLES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, style === s && { backgroundColor: secondaryColor }]}
                  onPress={() => setStyle(s)}
                >
                  <Text style={[styles.chipText, style === s && styles.chipTextActive]}>
                    {t(STYLE_KEYS[s])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: textColor }]}>{t('greetingRecipientLabel')}</Text>
            <View style={styles.chipRow}>
              {RECIPIENTS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, recipient === r && { backgroundColor: secondaryColor }]}
                  onPress={() => setRecipient(r)}
                >
                  <Text style={[styles.chipText, recipient === r && styles.chipTextActive]}>
                    {t(RECIPIENT_KEYS[r])}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: textColor }]}>{t('generateGreeting')}</Text>
            <TextInput
              style={[styles.textArea, { color: textColor, borderColor: secondaryColor }]}
              value={greetingText}
              editable={false}
              multiline
              numberOfLines={4}
            />

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: secondaryColor }]} onPress={handleCopy}>
                <Text style={styles.primaryBtnText}>{t('copyGreeting')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#25D366', opacity: hasPhone ? 1 : 0.6 }]}
                onPress={handleWhatsApp}
                disabled={!hasPhone}
              >
                <Text style={styles.primaryBtnText}>{t('whatsApp')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: '#34C759', opacity: hasPhone ? 1 : 0.6 }]}
                onPress={handleSms}
                disabled={!hasPhone}
              >
                <Text style={styles.primaryBtnText}>{t('sendViaSms')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700' },
  closeBtn: { fontSize: 22, fontWeight: '600' },
  scroll: { paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff' },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
