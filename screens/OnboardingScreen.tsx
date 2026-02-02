import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { setOnboardingDone } from '../utils/settingsStorage';
import { requestPermissions } from '../utils/notifications';
import { getNotificationHour, setNotificationHour } from '../utils/settingsStorage';

const { width } = Dimensions.get('window');

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [notificationHour, setNotificationHourState] = useState(9);

  const handleSkip = async () => {
    await setOnboardingDone();
    onComplete();
  };

  const handleAllowNotifications = async () => {
    await requestPermissions();
  };

  const handleStart = async () => {
    await setNotificationHour(notificationHour);
    await setOnboardingDone();
    onComplete();
  };

  const loadInitialHour = async () => {
    const h = await getNotificationHour();
    setNotificationHourState(h);
  };

  React.useEffect(() => {
    loadInitialHour();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1a0a2e" />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('onboardingSkip')}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setStep(index);
        }}
      >
        <View style={[styles.slide, { width }]}>
          <Text style={styles.emoji}>🎂</Text>
          <Text style={styles.title}>{t('onboardingSlide1Title')}</Text>
          <Text style={styles.text}>{t('onboardingSlide1Text')}</Text>
        </View>

        <View style={[styles.slide, { width }]}>
          <Text style={styles.emoji}>🔔</Text>
          <Text style={styles.title}>{t('onboardingSlide2Title')}</Text>
          <Text style={styles.text}>{t('onboardingSlide2Text')}</Text>
          <TouchableOpacity style={styles.allowButton} onPress={handleAllowNotifications}>
            <Text style={styles.allowButtonText}>{t('onboardingAllowNotifications')}</Text>
          </TouchableOpacity>
          <Text style={styles.timeLabel}>{t('notificationTime')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hoursRow}>
            {HOURS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.hourChip, notificationHour === h && styles.hourChipActive]}
                onPress={() => setNotificationHourState(h)}
              >
                <Text style={[styles.hourChipText, notificationHour === h && styles.hourChipTextActive]}>
                  {h}:00
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>{t('onboardingStart')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.dots}>
        <View style={[styles.dot, step === 0 && styles.dotActive]} />
        <View style={[styles.dot, step === 1 && styles.dotActive]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a2e',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
  },
  slide: {
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 17,
    color: '#c4b5fd',
    textAlign: 'center',
    lineHeight: 24,
  },
  allowButton: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 11,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeLabel: {
    marginTop: 24,
    fontSize: 14,
    color: '#a78bfa',
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    marginBottom: 16,
    maxHeight: 50,
  },
  hourChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
  },
  hourChipActive: {
    backgroundColor: '#8b5cf6',
  },
  hourChipText: {
    fontSize: 14,
    color: '#fff',
  },
  hourChipTextActive: {
    fontWeight: '600',
  },
  startButton: {
    marginTop: 24,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 11,
    backgroundColor: '#8b5cf6',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#8b5cf6',
    width: 24,
  },
});
