function getDaysWord(days: number): string {
  if (days === 1) return "day";
  return "days";
}

export const en = {
  // App navigation
  home: "Home",
  homeShort: "Home",
  allBirthdays: "All Birthdays",
  allBirthdaysShort: "List",
  calendarShort: "Calendar",
  settingsShort: "Settings",

  // Home screen
  appName: "Birthday Reminder",
  subtitle: "Never forget a special day",
  todaysBirthdays: "Today's Birthdays",
  upcomingBirthdays: "Upcoming (next 7 days)",
  noEventsToday: "No events today 🎈",
  todayEmptyState: "No birthdays today 🎈\nBut there will be soon 😉",
  heroTodayTitle: "Today's birthday!",
  heroTodayDays: "0 days",
  heroNearestTitle: "Nearest birthday",
  heroButtonGreet: "Greet",
  heroButtonGift: "Gift",
  statsCollapsed: "Statistics",
  statsExpand: "expand",
  statsCollapse: "collapse",
  statsThisMonthShort: "This month",
  statsThisYearShort: "This year",
  statsNearestShort: "Nearest",
  noUpcomingBirthdays: "No upcoming birthdays. Add one to get started! 🎂",

  // Birthday card
  today: "Today! 🎉",
  todayShort: "Today",
  tomorrow: "Tomorrow",
  inDays: (days: number) => `In ${days} ${getDaysWord(days)}`,
  turns: (age: number) => `Turns ${age}`,

  // Modal
  addBirthday: "Add Birthday",
  editBirthday: "Edit Birthday",
  personName: "Person's name *",
  enterName: "Enter name",
  dateOfBirth: "Date of birth *",
  hideYear: "Don't know birth year",
  birthdayLabel: "Birthday",
  note: "Note (optional)",
  addNote: "Add note...",
  save: "Save",
  saving: "Saving...",

  // Validation
  validationError: "Validation error",
  pleaseEnterName: "Please enter a name",
  dateCannotBeFuture: "Date of birth cannot be in the future",
  error: "Error",
  failedToSave: "Failed to save birthday",

  // List screen
  deleteBirthday: "Delete birthday",
  deleteConfirm: "Are you sure you want to delete this birthday?",
  cancel: "Cancel",
  delete: "Delete",
  noBirthdaysYet: "No birthdays yet. Add one to get started! 🎂",
  sortBy: "Sort by",
  sortByDate: "By date",
  sortByName: "By name",
  sortByAge: "By age",

  // Home screen extra
  homeGreeting: "Hello,",
  greetingSubtext: "Here's your update for today:",
  sectionBirthdays: "Birthdays",
  noResults: "No results",
  noBirthdaysInPeriod: "No birthdays in this period",
  searchPlaceholder: "Search birthdays",
  filterToday: "Today",
  filterWeek: "Week",
  filterMonth: "Month",
  filterYear: "Year",
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  calendar: "Calendar",
  noBirthdaysOnDate: "No birthdays on this day",
  currentDateFormatted: () => {
    const d = new Date();
    return `${en.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${
      en.dayNames[d.getDay()]
    }`;
  },

  // Card actions
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Send gift",
  giftSearchQuery: "gift ideas",
  giftIdeasFor: (name: string) => `Gift ideas for ${name}`,
  giftChooseBudget: "Choose budget:",
  giftBudget500: "Up to 500 UAH",
  giftBudget1000: "Up to 1000 UAH",
  giftBudget2000: "Up to 2000 UAH",
  giftOr: "Or:",
  giftForWoman: "For woman",
  giftForMan: "For man",
  giftUniversal: "Universal",
  giftOpenSearch: "Open search",
  messenger: "Messenger",
  call: "Call",
  greeting: "Greeting",
  generateGreeting: "Greeting text",
  greetingShort: "Short",
  greetingOfficial: "Formal",
  greetingFunny: "Funny",
  greetingForFriend: "For friend",
  greetingForGirlfriend: "For girlfriend",
  greetingForFamily: "For family",
  greetingForColleague: "For colleague",
  greetingRefresh: "Refresh",
  greetingStyleLabel: "Style",
  greetingRecipientLabel: "To whom",
  copyGreeting: "Copy",
  copiedToClipboard: "Copied to clipboard",
  sendViaSms: "SMS",
  ageLabel: "Age",
  importantPerson: "Important (mom, partner)",
  yearWord: (n: number) => {
    if (n === 1) return "year";
    return "years";
  },

  // Modal extra
  phone: "Phone (optional)",
  phonePlaceholder: "+1...",
  tags: "Tags",
  addPhoto: "Add photo",
  changePhoto: "Change photo",
  removePhoto: "Remove photo",

  // Settings
  settings: "Settings",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  notificationTime: "Reminder time",
  exportData: "Export data",
  exportDataList: "Export as list (CSV)",
  exportDataFull: "Export full (JSON)",
  importData: "Import data",
  importFromContacts: "Import from Contacts",
  importOnlyWithBirthday: "Import only contacts with birthday",
  importUpdateChanges: "Update changes on re-import",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number
  ) =>
    `Import from Contacts: added ${added}, updated ${updated}, skipped ${skipped}. Contacts with birthday: ${total}.`,
  contactsPermissionDenied: "Contacts access denied",
  contactsPermissionDeniedHint:
    "Enable Contacts for Birthday Reminder in Settings.",
  openSettings: "Open Settings",
  noContactsWithBirthday:
    "No contacts with birthday found. Add birth dates in the Contacts app.",
  importPlaceholder: "Paste CSV or JSON...",
  about: "About",
  aboutText: "Birthdays — never forget a special day.",
  version: "Version",
  writeToSupport: "Contact support",
  donateToAuthor: "Support the author (donate)",
  donationLinkNotConfigured:
    "Donation link is not configured yet. Please set the Monobank link in app settings.",
  exportSuccess: "Data exported",
  importSuccess: "Data imported",
  importError: "Failed to import",
  importCount: (imported: number, total: number) =>
    `Imported: ${imported}, total: ${total}`,
  openEmailFailed: "Could not open email",
  shareFailed: "Could not open share",
  addPhoneToContact: "Add phone number to the contact card",
  selectContact: "Select a contact",
  openWhatsAppFailed: "Could not open WhatsApp",
  openTelegramFailed: "Could not open Telegram",
  openSmsFailed: "Could not open SMS",
  openCallFailed: "Could not open call",

  // Statistics
  statistics: "Statistics",
  statsThisYear: "Birthdays this year",
  statsThisMonth: "This month",
  statsThisQuarter: "This quarter",
  statsNearest: "Nearest birthday",
  statsCountdown: "Days until next",
  statsByMonth: "By month",

  // Tags
  tagFamily: "Family",
  tagFriends: "Friends",
  tagWork: "Work",
  tagOther: "Other",
  filterByTag: "Filter by tag",
  categories: "Categories",
  allTags: "All",

  // In-app review
  rateAppTitle: "Enjoying the app?",
  rateAppMessage: "Leave a rating in the Store — it helps others find us.",
  rateAppRate: "Rate",
  rateAppLater: "Later",

  // Onboarding
  onboardingSlide1Title: "Add your first birthday",
  onboardingSlide1Text:
    "Save birthdays of people you care about — never forget to congratulate.",
  onboardingSlide2Title: "Reminders",
  onboardingSlide2Text:
    "The app will remind you 3 days before, 1 day before, and on the day. Choose a convenient time.",
  onboardingSkip: "Skip",
  onboardingStart: "Get started",
  onboardingAllowNotifications: "Allow notifications",

  // Smart reminders
  notifyOnBirthdayDay: "Reminder on birthday day",
  notifyOnBirthdayDayHint:
    "3 days and 1 day before — always; on the day — optional",

  // Quiet hours
  quietHours: "Quiet hours",
  quietHoursHint: "Do not send reminders at night",
  quietHoursFrom: "From (hour)",
  quietHoursTo: "To (hour)",

  // Language
  language: "Language",
  languageUk: "Українська",
  languageEn: "English",
  languageEs: "Spanish",
  languageIt: "Italian",
  languagePt: "Portuguese",
  languageDe: "German",

  // Notifications
  notificationTitle3Days: "Birthday reminder 🎉",
  notificationBody3Days: (name: string) => `${name}'s birthday in 3 days 🎉`,
  notificationTitle1Day: "Birthday reminder 🎂",
  notificationBody1Day: (name: string) => `Tomorrow is ${name}'s birthday! 🎂`,
  notificationTitleToday: "Birthday today! 🎈",
  notificationBodyToday: (name: string) => `Today is ${name}'s birthday! 🎈`,

  settingsBatteryOptimizationHint:
    "To get reminders when the app is closed, disable battery optimization for this app.",
  settingsBatteryOptimizationButton: "Open settings",

  widgetTitle: "Birthdays today",
  widgetEmpty: "No birthdays today",

  // Zodiac signs — names and short facts
  zodiacLabel: "Zodiac sign",
  zodiacFactLabel: "Interesting fact",
  zodiac_capricorn: "Capricorn",
  zodiac_aquarius: "Aquarius",
  zodiac_pisces: "Pisces",
  zodiac_aries: "Aries",
  zodiac_taurus: "Taurus",
  zodiac_gemini: "Gemini",
  zodiac_cancer: "Cancer",
  zodiac_leo: "Leo",
  zodiac_virgo: "Virgo",
  zodiac_libra: "Libra",
  zodiac_scorpio: "Scorpio",
  zodiac_sagittarius: "Sagittarius",
  zodiacFact_capricorn: "Capricorns often achieve great heights through persistence and discipline.",
  zodiacFact_aquarius: "Aquarians love the unusual and often have an original view of the world.",
  zodiacFact_pisces: "Pisces are very sensitive and intuitive, often with creative talent.",
  zodiacFact_aries: "Aries are natural leaders, energetic and full of initiative.",
  zodiacFact_taurus: "Taureans value comfort and stability and have a developed taste.",
  zodiacFact_gemini: "Geminis easily find common ground with anyone and love to communicate.",
  zodiacFact_cancer: "Cancers are deeply attached to home and family and have strong empathy.",
  zodiacFact_leo: "Leos love to be in the spotlight and often have charisma.",
  zodiacFact_virgo: "Virgos pay attention to detail and like order.",
  zodiacFact_libra: "Libras seek harmony and beauty; fair treatment matters to them.",
  zodiacFact_scorpio: "Scorpios feel emotions deeply and have strong willpower.",
  zodiacFact_sagittarius: "Sagittarians love travel and new experiences; they are optimistic.",
};
