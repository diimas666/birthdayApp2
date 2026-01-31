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
  sortBy: 'Сортувати',
  sortByDate: 'За датою',
  sortByName: 'За ім\'ям',
  sortByAge: 'За віком',

  // Home screen extra
  greeting: 'Привіт,',
  greetingSubtext: 'Ось оновлення на сьогодні:',
  sectionBirthdays: 'Дні народження',
  noResults: 'Нічого не знайдено',
  noBirthdaysInPeriod: 'У цей період немає днів народження',
  searchPlaceholder: 'Пошук дня народження',
  filterToday: 'Сьогодні',
  filterWeek: 'Тиждень',
  filterMonth: 'Місяць',
  filterYear: 'Рік',
  dayNames: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'],
  monthNamesShort: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'],
  currentDateFormatted: () => {
    const d = new Date();
    return `${d.getDate()}.${uk.monthNamesShort[d.getMonth()]} ${uk.dayNames[d.getDay()]}`;
  },

  // Card actions
  whatsApp: 'WhatsApp',
  sendGift: 'Надіслати подарунок',
  messenger: 'Messenger',
  call: 'Дзвінок',
  ageLabel: 'Вік',
  yearWord: (n: number) => {
    const d = n % 10, t = n % 100;
    if (t >= 11 && t <= 19) return 'років';
    if (d === 1) return 'рік';
    if (d >= 2 && d <= 4) return 'роки';
    return 'років';
  },

  // Modal extra
  phone: 'Телефон (необов\'язково)',
  phonePlaceholder: '+380...',
  tags: 'Теги',
  addPhoto: 'Додати фото',
  changePhoto: 'Змінити фото',
  removePhoto: 'Прибрати фото',

  // Settings
  settings: 'Налаштування',
  theme: 'Тема',
  themeLight: 'Світла',
  themeDark: 'Темна',
  notificationTime: 'Час нагадувань',
  exportData: 'Експорт даних',
  importData: 'Імпорт даних',
  about: 'Про додаток',
  aboutText: 'Дні народження — ніколи не забудь особливий день.',
  version: 'Версія',
  exportSuccess: 'Дані експортовано',
  importSuccess: 'Дані імпортовано',
  importError: 'Не вдалося імпортувати файл',

  // Statistics
  statistics: 'Статистика',
  statsThisYear: 'Днів народження цього року',
  statsNearest: 'Найближчий ДН',
  statsByMonth: 'По місяцях',

  // Tags
  tagFamily: 'Сім\'я',
  tagFriends: 'Друзі',
  tagWork: 'Робота',
  tagOther: 'Інше',
  filterByTag: 'Фільтр по тегу',
  allTags: 'Всі',

  // Notifications
  notificationTitle3Days: 'Нагадування про день народження 🎉',
  notificationBody3Days: (name: string) => `Через 3 дні день народження ${name} 🎉`,
  notificationTitle1Day: 'Нагадування про день народження 🎂',
  notificationBody1Day: (name: string) => `Завтра день народження ${name}! 🎂`,
  notificationTitleToday: 'День народження сьогодні! 🎈',
  notificationBodyToday: (name: string) => `Сьогодні день народження ${name}! 🎈`,
};
