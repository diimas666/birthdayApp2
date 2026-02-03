import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, fontSize, borderRadius, moderateScale, verticalScale } from '../utils/scale';

export interface GiftBottomSheetRef {
  present: (name: string) => void;
  dismiss: () => void;
}

interface GiftBottomSheetProps {
  onSelect: (searchQuery: string) => void;
}

const buildQuery = (budget: string, category: string, lang: 'uk' | 'en'): string => {
  if (lang === 'uk') {
    const budgetStr = budget === '500' ? 'до 500 грн' : budget === '1000' ? 'до 1000 грн' : 'до 2000 грн';
    const catStr = category === 'woman' ? 'для жінки' : category === 'man' ? 'для чоловіка' : '';
    return catStr ? `подарунки ${budgetStr} ${catStr}` : `подарунки ${budgetStr}`;
  }
  const budgetStr = budget === '500' ? 'up to 500' : budget === '1000' ? 'up to 1000' : 'up to 2000';
  const catStr = category === 'woman' ? 'for woman' : category === 'man' ? 'for man' : '';
  return catStr ? `gift ideas ${budgetStr} ${catStr}` : `gift ideas ${budgetStr}`;
};

export const GiftBottomSheet = forwardRef<GiftBottomSheetRef, GiftBottomSheetProps>(
  ({ onSelect }, ref) => {
    const { t } = useTranslation();
    const { isDark } = useTheme();
    const bottomSheetRef = useRef<React.ComponentRef<typeof BottomSheet>>(null);
    const [displayName, setDisplayName] = useState('');

    const lang = (t('giftBudget500') as string).includes('грн') ? 'uk' : 'en';

    useImperativeHandle(ref, () => ({
      present(name: string) {
        setDisplayName(name);
        bottomSheetRef.current?.expand();
      },
      dismiss() {
        bottomSheetRef.current?.close();
      },
    }));

    const bg = isDark ? '#1a1a2e' : '#fff';
    const textColor = isDark ? '#fff' : '#000';
    const secondaryText = isDark ? '#a78bfa' : '#666';
    const chipBg = isDark ? '#2a2a3e' : '#f0e6ff';
    const chipBorder = isDark ? '#3a3a4e' : '#8b5cf6';

    const handleSelect = (budget: '500' | '1000' | '2000', category: 'woman' | 'man' | 'universal') => {
      const q = buildQuery(budget, category, lang);
      onSelect(q);
      bottomSheetRef.current?.close();
    };

    const renderBackdrop = (props: unknown) => (
      <BottomSheetBackdrop {...(props as object)} disappearsOnIndex={-1} appearsOnIndex={0} />
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: bg }}
        handleIndicatorStyle={{ backgroundColor: secondaryText }}
      >
        <BottomSheetView style={[styles.content, { backgroundColor: bg }]}>
          <Text style={[styles.title, { color: textColor }]}>
            🎁 {t('giftIdeasFor', displayName)}
          </Text>
          <Text style={[styles.label, { color: secondaryText }]}>{t('giftChooseBudget')}</Text>
          <View style={styles.chipRow}>
            {(['500', '1000', '2000'] as const).map((b) => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}
                onPress={() => handleSelect(b, 'universal')}
              >
                <Text style={[styles.chipText, { color: textColor }]}>
                  {b === '500' ? t('giftBudget500') : b === '1000' ? t('giftBudget1000') : t('giftBudget2000')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.label, { color: secondaryText, marginTop: 16 }]}>{t('giftOr')}</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}
              onPress={() => handleSelect('1000', 'woman')}
            >
              <Text style={[styles.chipText, { color: textColor }]}>{t('giftForWoman')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}
              onPress={() => handleSelect('1000', 'man')}
            >
              <Text style={[styles.chipText, { color: textColor }]}>{t('giftForMan')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: chipBg, borderColor: chipBorder }]}
              onPress={() => handleSelect('1000', 'universal')}
            >
              <Text style={[styles.chipText, { color: textColor }]}>{t('giftUniversal')}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: moderateScale(12),
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  chipText: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
});
