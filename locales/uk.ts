function getDaysWord(days: number): string {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "днів";
  }

  if (lastDigit === 1) {
    return "день";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "дні";
  }

  return "днів";
}

export const uk = {
  // App navigation
  home: "Головна",
  homeShort: "Глав",
  allBirthdays: "Всі дні народження",
  allBirthdaysShort: "Дні",
  calendarShort: "Календар",
  settingsShort: "Налашт.",

  // Home screen
  appName: "Нагадування про дні народження",
  subtitle: "Ніколи не забудь особливий день",
  todaysBirthdays: "Сьогоднішні дні народження 🎉",
  upcomingBirthdays: "Найближчі (наступні 7 днів)",
  noEventsToday: "Сьогодні подій немає 🎈",
  todayEmptyState: "Сьогодні без свят 🎈\nАле скоро будуть 😉",
  heroTodayTitle: "Сьогодні день народження!",
  heroTodayDays: "0 днів",
  heroNearestTitle: "Найближчий день народження",
  heroButtonGreet: "Привітати",
  heroButtonGift: "Подарунок",
  statsCollapsed: "Статистика",
  statsExpand: "розгорнути",
  statsCollapse: "згорнути",
  statsThisMonthShort: "Цього місяця",
  statsThisYearShort: "Цього року",
  statsNearestShort: "Найближчий",
  noUpcomingBirthdays:
    "Немає найближчих днів народження. Додайте одне, щоб почати! 🎂",

  // Birthday card
  today: "Сьогодні! 🎉",
  todayShort: "Сьогодні",
  tomorrow: "Завтра",
  inDays: (days: number) => `Через ${days} ${getDaysWord(days)}`,
  turns: (age: number) => `Виповнюється ${age}`,

  // Modal
  addBirthday: "Додати день народження",
  editBirthday: "Редагувати день народження",
  personName: "Ім'я людини *",
  enterName: "Введіть ім'я",
  dateOfBirth: "Дата народження *",
  note: "Примітка (необов'язково)",
  addNote: "Додати примітку...",
  save: "Зберегти",
  saving: "Збереження...",

  // Validation
  validationError: "Помилка валідації",
  pleaseEnterName: "Будь ласка, введіть ім'я",
  dateCannotBeFuture: "Дата народження не може бути в майбутньому",
  error: "Помилка",
  failedToSave: "Не вдалося зберегти день народження",

  // List screen
  deleteBirthday: "Видалити день народження",
  deleteConfirm: "Ви впевнені, що хочете видалити цей день народження?",
  cancel: "Скасувати",
  delete: "Видалити",
  noBirthdaysYet: "Днів народження ще немає. Додайте одне, щоб почати! 🎂",
  sortBy: "Сортувати",
  sortByDate: "За датою",
  sortByName: "За ім'ям",
  sortByAge: "За віком",

  // Home screen extra
  homeGreeting: "Привіт,",
  greetingSubtext: "Ось оновлення на сьогодні:",
  sectionBirthdays: "Дні народження",
  noResults: "Нічого не знайдено",
  noBirthdaysInPeriod: "У цей період немає днів народження",
  searchPlaceholder: "Пошук дня народження",
  filterToday: "Сьогодні",
  filterWeek: "Тиждень",
  filterMonth: "Місяць",
  filterYear: "Рік",
  dayNames: [
    "Неділя",
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
    "Субота",
  ],
  dayNamesShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  monthNames: [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ],
  monthNamesShort: [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня",
  ],
  calendar: "Календар",
  noBirthdaysOnDate: "У цей день немає днів народження",
  currentDateFormatted: () => {
    const d = new Date();
    return `${d.getDate()}.${uk.monthNamesShort[d.getMonth()]} ${
      uk.dayNames[d.getDay()]
    }`;
  },

  // Card actions
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Надіслати подарунок",
  giftSearchQuery: "ідеї подарунків",
  giftIdeasFor: (name: string) => `Ідеї подарунків для ${name}`,
  giftChooseBudget: "Обери бюджет:",
  giftBudget500: "До 500 грн",
  giftBudget1000: "До 1000 грн",
  giftBudget2000: "До 2000 грн",
  giftOr: "Або:",
  giftForWoman: "Для жінки",
  giftForMan: "Для чоловіка",
  giftUniversal: "Універсально",
  giftOpenSearch: "Відкрити пошук",
  messenger: "Messenger",
  call: "Дзвінок",
  greeting: "Привітання",
  generateGreeting: "Текст поздравлення",
  greetingShort: "Коротко",
  greetingOfficial: "Офіційно",
  greetingFunny: "З гумором",
  greetingForFriend: "Для друга",
  greetingForGirlfriend: "Для подруги",
  greetingForFamily: "Для родини",
  greetingForColleague: "Для колеги",
  greetingRefresh: "Оновити",
  greetingStyleLabel: "Стиль",
  greetingRecipientLabel: "Кому",
  copyGreeting: "Копіювати",
  copiedToClipboard: "Скопійовано в буфер",
  sendViaSms: "SMS",
  ageLabel: "Вік",
  importantPerson: "Важлива особа (мама, партнер)",
  yearWord: (n: number) => {
    const d = n % 10,
      t = n % 100;
    if (t >= 11 && t <= 19) return "років";
    if (d === 1) return "рік";
    if (d >= 2 && d <= 4) return "роки";
    return "років";
  },

  // Modal extra
  phone: "Телефон (необов'язково)",
  phonePlaceholder: "+380...",
  tags: "Теги",
  addPhoto: "Додати фото",
  changePhoto: "Змінити фото",
  removePhoto: "Прибрати фото",

  // Settings
  settings: "Налаштування",
  theme: "Тема",
  themeLight: "Світла",
  themeDark: "Темна",
  notificationTime: "Час нагадувань",
  exportData: "Експорт даних",
  exportDataList: "Експорт як список (CSV)",
  exportDataFull: "Експорт повний (JSON)",
  importData: "Імпорт даних",
  importFromContacts: "Імпорт з контактів",
  importOnlyWithBirthday: "Імпортувати тільки з датою народження",
  importUpdateChanges: "Оновлювати зміни при повторному імпорті",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number
  ) =>
    `Імпорт з контактів: додано ${added}, оновлено ${updated}, пропущено ${skipped}. У контактах з датою: ${total}.`,
  contactsPermissionDenied: "Доступ до контактів заборонено",
  contactsPermissionDeniedHint:
    "Увімкніть доступ до контактів для Birthday Reminder в Налаштуваннях.",
  openSettings: "Відкрити налаштування",
  noContactsWithBirthday:
    "Немає контактів з датою народження. Додайте дати в додатку Контакти.",
  importPlaceholder: "Вставте CSV або JSON...",
  about: "Про додаток",
  aboutText: "Дні народження — ніколи не забудь особливий день.",
  version: "Версія",
  writeToSupport: "Написати в підтримку",
  exportSuccess: "Дані експортовано",
  importSuccess: "Дані імпортовано",
  importError: "Не вдалося імпортувати файл",
  importCount: (imported: number, total: number) =>
    `Імпортовано: ${imported}, всього: ${total}`,
  openEmailFailed: "Не вдалося відкрити пошту",
  shareFailed: "Не вдалося відкрити поширення",
  addPhoneToContact: "Додайте номер телефону в картку контакту",
  selectContact: "Оберіть контакт",
  openWhatsAppFailed: "Не вдалося відкрити WhatsApp",
  openTelegramFailed: "Не вдалося відкрити Telegram",
  openSmsFailed: "Не вдалося відкрити SMS",
  openCallFailed: "Не вдалося відкрити дзвінок",

  // Statistics
  statistics: "Статистика",
  statsThisYear: "Днів народження цього року",
  statsThisMonth: "У цьому місяці",
  statsThisQuarter: "У цьому кварталі",
  statsNearest: "Найближчий ДН",
  statsCountdown: "До наступного ДН",
  statsByMonth: "По місяцях",

  // Tags
  tagFamily: "Сім'я",
  tagFriends: "Друзі",
  tagWork: "Робота",
  tagOther: "Інше",
  filterByTag: "Фільтр по тегу",
  categories: "Категорії",
  allTags: "Всі",

  // Onboarding
  onboardingSlide1Title: "Додай перший день народження",
  onboardingSlide1Text:
    "Зберігай дні народження близьких — ніколи не забудь привітати.",
  onboardingSlide2Title: "Тут будуть нагадування",
  onboardingSlide2Text:
    "Додаток нагадає за 3 дні, за день і в сам день народження. Обери зручний час.",
  onboardingSkip: "Пропустити",
  onboardingStart: "Почати",
  onboardingAllowNotifications: "Дозволити нагадування",

  // Smart reminders
  notifyOnBirthdayDay: "Нагадування в день народження",
  notifyOnBirthdayDayHint:
    "За 3 дні та за 1 день — завжди; в сам день — за бажанням",

  // Quiet hours
  quietHours: "Тихі години",
  quietHoursHint: "Не надсилати нагадування вночі",
  quietHoursFrom: "З (год)",
  quietHoursTo: "До (год)",

  // Language
  language: "Мова",
  languageUk: "Українська",
  languageEn: "English",

  // Notifications
  notificationTitle3Days: "Нагадування про день народження 🎉",
  notificationBody3Days: (name: string) =>
    `Через 3 дні день народження ${name} 🎉`,
  notificationTitle1Day: "Нагадування про день народження 🎂",
  notificationBody1Day: (name: string) => `Завтра день народження ${name}! 🎂`,
  notificationTitleToday: "День народження сьогодні! 🎈",
  notificationBodyToday: (name: string) =>
    `Сьогодні день народження ${name}! 🎈`,

  // Battery optimization (Android) — для надійних сповіщень у фоні
  settingsBatteryOptimizationHint:
    "Щоб нагадування приходили, коли застосунок закрито, вимкніть оптимізацію батареї для цього застосунку.",
  settingsBatteryOptimizationButton: "Відкрити налаштування",

  // Віджет на головний екран (Android)
  widgetTitle: "Сьогодні святкують",
  widgetEmpty: "Ніхто не святкує сьогодні",

  // Знаки зодіаку — назви та цікаві факти
  zodiacLabel: "Знак зодіаку",
  zodiacFactLabel: "Цікавий факт",
  zodiac_capricorn: "Козеріг",
  zodiac_aquarius: "Водолій",
  zodiac_pisces: "Риби",
  zodiac_aries: "Овен",
  zodiac_taurus: "Телець",
  zodiac_gemini: "Близнюки",
  zodiac_cancer: "Рак",
  zodiac_leo: "Лев",
  zodiac_virgo: "Діва",
  zodiac_libra: "Терези",
  zodiac_scorpio: "Скорпіон",
  zodiac_sagittarius: "Стрілець",
  zodiacFact_capricorn: "Козероги часто досягають великих висот завдяки наполегливості та дисципліні.",
  zodiacFact_aquarius: "Водолії люблять все незвичайне і часто мають оригінальний погляд на світ.",
  zodiacFact_pisces: "Риби дуже чутливі та інтуїтивні, часто мають творчий талант.",
  zodiacFact_aries: "Овни — природжені лідери, енергійні та ініціативні.",
  zodiacFact_taurus: "Тельці цінують комфорт і стабільність, мають розвинений смак.",
  zodiacFact_gemini: "Близнюки легко знаходять спільну мову з ким завгодно і люблять спілкуватися.",
  zodiacFact_cancer: "Раки дуже привʼязані до дому та родини, мають сильну емпатію.",
  zodiacFact_leo: "Леви люблять бути в центрі уваги і часто мають харизму.",
  zodiacFact_virgo: "Діви звертають увагу на деталі і люблять порядок.",
  zodiacFact_libra: "Терези шукають гармонію та красу, їм важливо справедливе ставлення.",
  zodiacFact_scorpio: "Скорпіони глибоко відчувають емоції і мають сильну волю.",
  zodiacFact_sagittarius: "Стрільці люблять подорожі та нові враження, оптимістичні.",
};
