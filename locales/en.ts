function getDaysWord(days: number): string {
  if (days === 1) return 'day';
  return 'days';
}

export const en = {
  // App navigation
  home: 'Home',
  allBirthdays: 'All Birthdays',
  allBirthdaysShort: 'List',
  calendarShort: 'Calendar',
  settingsShort: 'Settings',

  // Home screen
  appName: 'Birthday Reminder',
  subtitle: 'Never forget a special day',
  todaysBirthdays: "Today's Birthdays 🎉",
  upcomingBirthdays: 'Upcoming (next 7 days)',
  noEventsToday: 'No events today 🎈',
  todayEmptyState: "No birthdays today 🎈\nBut there will be soon 😉",
  heroTodayTitle: "Today's birthday!",
  heroTodayDays: '0 days',
  heroNearestTitle: 'Nearest birthday',
  heroButtonGreet: 'Greet',
  heroButtonGift: 'Gift',
  statsCollapsed: 'Statistics',
  statsExpand: 'expand',
  statsCollapse: 'collapse',
  statsThisMonthShort: 'This month',
  statsThisYearShort: 'This year',
  statsNearestShort: 'Nearest',
  noUpcomingBirthdays: 'No upcoming birthdays. Add one to get started! 🎂',

  // Birthday card
  today: 'Today! 🎉',
  todayShort: 'Today',
  tomorrow: 'Tomorrow',
  inDays: (days: number) => `In ${days} ${getDaysWord(days)}`,
  turns: (age: number) => `Turns ${age}`,

  // Modal
  addBirthday: 'Add Birthday',
  editBirthday: 'Edit Birthday',
  personName: "Person's name *",
  enterName: 'Enter name',
  dateOfBirth: 'Date of birth *',
  note: 'Note (optional)',
  addNote: 'Add note...',
  save: 'Save',
  saving: 'Saving...',

  // Validation
  validationError: 'Validation error',
  pleaseEnterName: 'Please enter a name',
  dateCannotBeFuture: 'Date of birth cannot be in the future',
  error: 'Error',
  failedToSave: 'Failed to save birthday',

  // List screen
  deleteBirthday: 'Delete birthday',
  deleteConfirm: 'Are you sure you want to delete this birthday?',
  cancel: 'Cancel',
  delete: 'Delete',
  noBirthdaysYet: 'No birthdays yet. Add one to get started! 🎂',
  sortBy: 'Sort by',
  sortByDate: 'By date',
  sortByName: 'By name',
  sortByAge: 'By age',

  // Home screen extra
  homeGreeting: 'Hello,',
  greetingSubtext: "Here's your update for today:",
  sectionBirthdays: 'Birthdays',
  noResults: 'No results',
  noBirthdaysInPeriod: 'No birthdays in this period',
  searchPlaceholder: 'Search birthdays',
  filterToday: 'Today',
  filterWeek: 'Week',
  filterMonth: 'Month',
  filterYear: 'Year',
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  calendar: 'Calendar',
  noBirthdaysOnDate: 'No birthdays on this day',
  currentDateFormatted: () => {
    const d = new Date();
    return `${en.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${en.dayNames[d.getDay()]}`;
  },

  // Card actions
  whatsApp: 'WhatsApp',
  sendGift: 'Send gift',
  giftSearchQuery: 'gift ideas',
  messenger: 'Messenger',
  call: 'Call',
  greeting: 'Greeting',
  generateGreeting: 'Greeting text',
  greetingShort: 'Short',
  greetingOfficial: 'Formal',
  greetingFunny: 'Funny',
  greetingForFriend: 'For friend',
  greetingForGirlfriend: 'For girlfriend',
  greetingForFamily: 'For family',
  greetingForColleague: 'For colleague',
  greetingRefresh: 'Refresh',
  greetingStyleLabel: 'Style',
  greetingRecipientLabel: 'To whom',
  copyGreeting: 'Copy',
  copiedToClipboard: 'Copied to clipboard',
  sendViaSms: 'SMS',
  ageLabel: 'Age',
  importantPerson: 'Important (mom, partner)',
  yearWord: (n: number) => {
    if (n === 1) return 'year';
    return 'years';
  },

  // Modal extra
  phone: 'Phone (optional)',
  phonePlaceholder: '+1...',
  tags: 'Tags',
  addPhoto: 'Add photo',
  changePhoto: 'Change photo',
  removePhoto: 'Remove photo',

  // Settings
  settings: 'Settings',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  notificationTime: 'Reminder time',
  exportData: 'Export data',
  exportDataList: 'Export as list (CSV)',
  exportDataFull: 'Export full (JSON)',
  importData: 'Import data',
  importFromContacts: 'Import from Contacts',
  importOnlyWithBirthday: 'Import only contacts with birthday',
  importUpdateChanges: 'Update changes on re-import',
  importFromContactsSuccess: (added: number, updated: number, skipped: number, total: number) =>
    `Import from Contacts: added ${added}, updated ${updated}, skipped ${skipped}. Contacts with birthday: ${total}.`,
  contactsPermissionDenied: 'Contacts access denied',
  importPlaceholder: 'Paste CSV or JSON...',
  about: 'About',
  aboutText: 'Birthdays — never forget a special day.',
  version: 'Version',
  writeToSupport: 'Contact support',
  exportSuccess: 'Data exported',
  importSuccess: 'Data imported',
  importError: 'Failed to import',
  importCount: (imported: number, total: number) => `Imported: ${imported}, total: ${total}`,
  openEmailFailed: 'Could not open email',
  shareFailed: 'Could not open share',
  addPhoneToContact: 'Add phone number to the contact card',
  selectContact: 'Select a contact',
  openWhatsAppFailed: 'Could not open WhatsApp',
  openSmsFailed: 'Could not open SMS',
  openCallFailed: 'Could not open call',

  // Statistics
  statistics: 'Statistics',
  statsThisYear: 'Birthdays this year',
  statsThisMonth: 'This month',
  statsThisQuarter: 'This quarter',
  statsNearest: 'Nearest birthday',
  statsCountdown: 'Days until next',
  statsByMonth: 'By month',

  // Tags
  tagFamily: 'Family',
  tagFriends: 'Friends',
  tagWork: 'Work',
  tagOther: 'Other',
  filterByTag: 'Filter by tag',
  allTags: 'All',

  // Onboarding
  onboardingSlide1Title: 'Add your first birthday',
  onboardingSlide1Text: 'Save birthdays of people you care about — never forget to congratulate.',
  onboardingSlide2Title: 'Reminders',
  onboardingSlide2Text: 'The app will remind you 3 days before, 1 day before, and on the day. Choose a convenient time.',
  onboardingSkip: 'Skip',
  onboardingStart: 'Get started',
  onboardingAllowNotifications: 'Allow notifications',

  // Smart reminders
  notifyOnBirthdayDay: 'Reminder on birthday day',
  notifyOnBirthdayDayHint: '3 days and 1 day before — always; on the day — optional',

  // Quiet hours
  quietHours: 'Quiet hours',
  quietHoursHint: 'Do not send reminders at night',
  quietHoursFrom: 'From (hour)',
  quietHoursTo: 'To (hour)',

  // Language
  language: 'Language',
  languageUk: 'Українська',
  languageEn: 'English',

  // Notifications
  notificationTitle3Days: 'Birthday reminder 🎉',
  notificationBody3Days: (name: string) => `${name}'s birthday in 3 days 🎉`,
  notificationTitle1Day: 'Birthday reminder 🎂',
  notificationBody1Day: (name: string) => `Tomorrow is ${name}'s birthday! 🎂`,
  notificationTitleToday: "Birthday today! 🎈",
  notificationBodyToday: (name: string) => `Today is ${name}'s birthday! 🎈`,
};
