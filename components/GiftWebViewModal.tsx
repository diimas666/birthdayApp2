import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { spacing, fontSize, verticalScale, moderateScale } from '../utils/scale';

interface GiftWebViewModalProps {
  visible: boolean;
  url: string | null;
  onClose: () => void;
}

export const GiftWebViewModal: React.FC<GiftWebViewModalProps> = ({
  visible,
  url,
  onClose,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const bg = isDark ? '#0a0a14' : '#fff';
  const barBg = isDark ? '#1a1a2e' : '#f5f5f5';
  const textColor = isDark ? '#fff' : '#000';
  const accent = '#8b5cf6';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.header, { backgroundColor: barBg }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeText, { color: accent }]}>{t('cancel')}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {t('giftOpenSearch')}
          </Text>
        </View>
        {url ? (
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={accent} />
              </View>
            )}
          />
        ) : (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={accent} />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: moderateScale(12),
    paddingTop: verticalScale(48),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeBtn: { marginRight: spacing.sm },
  closeText: { fontSize: fontSize.base, fontWeight: '500' },
  title: { fontSize: fontSize.lg, fontWeight: '600', flex: 1 },
  webview: { flex: 1 },
  loadingWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
