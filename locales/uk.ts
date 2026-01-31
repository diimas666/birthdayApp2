function getDaysWord(days: number): string {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'днів';
  }
  
  if (lastDigit === 1) {
    return 'день';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дні';
  }
  
  return 'днів';
}

export const uk = {
  // App navigation
  home: 'Головна',
  allBirthdays: 'Всі дні народження',
  
  // Home screen
  appName: 'Нагадування про дні народження',
  subtitle: 'Ніколи не забудь особливий день',
  todaysBirthdays: 'Сьогоднішні дні народження 🎉',
  upcomingBirthdays: 'Найближчі (наступні 7 днів)',
  noEventsToday: 'Сьогодні подій немає 🎈',
  noUpcomingBirthdays: 'Немає найближчих днів народження. Додайте одне, щоб почати! 🎂',
  
  // Birthday card
  today: 'Сьогодні! 🎉',
  todayShort: 'Сьогодні',
  tomorrow: 'Завтра',
  inDays: (days: number) => `Через ${days} ${getDaysWord(days)}`,
  turns: (age: number) => `Виповнюється ${age}`,
  
  // Modal
  addBirthday: 'Додати день народження',
  editBirthday: 'Редагувати день народження',
  personName: 'Ім\'я людини *',
  enterName: 'Введіть ім\'я',
  dateOfBirth: 'Дата народження *',
  note: 'Примітка (необов\'язково)',
  addNote: 'Додати примітку...',
  save: 'Зберегти',
  saving: 'Збереження...',
  
  // Validation
  validationError: 'Помилка валідації',
  pleaseEnterName: 'Будь ласка, введіть ім\'я',
  dateCannotBeFuture: 'Дата народження не може бути в майбутньому',
  error: 'Помилка',
  failedToSave: 'Не вдалося зберегти день народження',
  
  // List screen
  deleteBirthday: 'Видалити день народження',
  deleteConfirm: 'Ви впевнені, що хочете видалити цей день народження?',
  cancel: 'Скасувати',
  delete: 'Видалити',
  noBirthdaysYet: 'Днів народження ще немає. Додайте одне, щоб почати! 🎂',
  
  // Notifications
  notificationTitle3Days: 'Нагадування про день народження 🎉',
  notificationBody3Days: (name: string) => `Через 3 дні день народження ${name} 🎉`,
  notificationTitle1Day: 'Нагадування про день народження 🎂',
  notificationBody1Day: (name: string) => `Завтра день народження ${name}! 🎂`,
  notificationTitleToday: 'День народження сьогодні! 🎈',
  notificationBodyToday: (name: string) => `Сьогодні день народження ${name}! 🎈`,
};
