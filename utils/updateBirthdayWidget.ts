import { Platform, NativeModules } from 'react-native';

/**
 * Оновлює дані для Android-віджета «Сьогодні святкують».
 * Викликати після getBirthdays() з списком імен та локалізованими рядками.
 */
export async function updateBirthdayWidget(
  names: string[],
  emptyText: string,
  title: string
): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    const { BirthdayWidget } = NativeModules;
    if (BirthdayWidget?.updateWidget) {
      BirthdayWidget.updateWidget(names, emptyText, title);
    }
  } catch (_) {}
}
