import { uk } from "./uk";

function getDaysWordDe(days: number): string {
  return days === 1 ? "Tag" : "Tage";
}

export const de: typeof uk = {
  // Navigation
  home: "Start",
  homeShort: "Start",
  allBirthdays: "Alle Geburtstage",
  allBirthdaysShort: "Liste",
  calendarShort: "Kalender",
  settingsShort: "Einstellungen",

  // Startbildschirm
  appName: "Geburtstags-Erinnerung",
  subtitle: "Vergiss nie wieder einen besonderen Tag",
  todaysBirthdays: "Geburtstage heute",
  upcomingBirthdays: "Bevorstehend (nächste 7 Tage)",
  noEventsToday: "Heute keine Ereignisse 🎈",
  todayEmptyState: "Heute keine Geburtstage 🎈\nAber bald schon 😉",
  heroTodayTitle: "Heute hat jemand Geburtstag!",
  heroTodayDays: "0 Tage",
  heroNearestTitle: "Nächster Geburtstag",
  heroButtonGreet: "Gratulieren",
  heroButtonGift: "Geschenk",
  statsCollapsed: "Statistiken",
  statsExpand: "anzeigen",
  statsCollapse: "ausblenden",
  statsThisMonthShort: "Diesen Monat",
  statsThisYearShort: "Dieses Jahr",
  statsNearestShort: "Nächster",
  noUpcomingBirthdays:
    "Keine anstehenden Geburtstage. Füge einen hinzu, um zu starten 🎂",

  // Geburtstagskarte
  today: "Heute! 🎉",
  todayShort: "Heute",
  tomorrow: "Morgen",
  inDays: (days: number) => `In ${days} ${getDaysWordDe(days)}`,
  turns: (age: number) => `Wird ${age}`,

  // Modal
  addBirthday: "Geburtstag hinzufügen",
  editBirthday: "Geburtstag bearbeiten",
  personName: "Name der Person *",
  enterName: "Name eingeben",
  dateOfBirth: "Geburtsdatum *",
  hideYear: "Geburtsjahr ist unbekannt",
  birthdayLabel: "Geburtstag",
  note: "Notiz (optional)",
  addNote: "Notiz hinzufügen...",
  save: "Speichern",
  saving: "Speichern...",

  // Validierung
  validationError: "Validierungsfehler",
  pleaseEnterName: "Bitte einen Namen eingeben",
  dateCannotBeFuture: "Das Geburtsdatum kann nicht in der Zukunft liegen",
  error: "Fehler",
  failedToSave: "Geburtstag konnte nicht gespeichert werden",

  // Liste
  deleteBirthday: "Geburtstag löschen",
  deleteConfirm:
    "Bist du sicher, dass du diesen Geburtstag löschen möchtest?",
  cancel: "Abbrechen",
  delete: "Löschen",
  noBirthdaysYet:
    "Noch keine Geburtstage. Füge einen hinzu, um zu starten 🎂",
  sortBy: "Sortieren nach",
  sortByDate: "Datum",
  sortByName: "Name",
  sortByAge: "Alter",

  // Home extra
  homeGreeting: "Hallo,",
  greetingSubtext: "Dein Überblick für heute:",
  sectionBirthdays: "Geburtstage",
  noResults: "Keine Ergebnisse",
  noBirthdaysInPeriod: "In diesem Zeitraum gibt es keine Geburtstage",
  searchPlaceholder: "Geburtstage suchen",
  filterToday: "Heute",
  filterWeek: "Woche",
  filterMonth: "Monat",
  filterYear: "Jahr",
  dayNames: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  monthNames: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  calendar: "Kalender",
  noBirthdaysOnDate: "An diesem Tag gibt es keine Geburtstage",
  currentDateFormatted: () => {
    const d = new Date();
    return `${de.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${
      de.dayNames[d.getDay()]
    }`;
  },

  // Kartenaktionen
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Geschenk senden",
  giftSearchQuery: "Geschenkideen",
  giftIdeasFor: (name: string) => `Geschenkideen für ${name}`,
  giftChooseBudget: "Budget wählen:",
  giftBudget500: "Bis 500 UAH",
  giftBudget1000: "Bis 1000 UAH",
  giftBudget2000: "Bis 2000 UAH",
  giftOr: "Oder:",
  giftForWoman: "Für sie",
  giftForMan: "Für ihn",
  giftUniversal: "Universal",
  giftOpenSearch: "Suche öffnen",
  messenger: "Messenger",
  call: "Anrufen",
  greeting: "Gruß",
  generateGreeting: "Grußtext",
  greetingShort: "Kurz",
  greetingOfficial: "Formell",
  greetingFunny: "Lustig",
  greetingForFriend: "Für Freund",
  greetingForGirlfriend: "Für Partner",
  greetingForFamily: "Für Familie",
  greetingForColleague: "Für Kolleg*in",
  greetingRefresh: "Neue Variante",
  greetingStyleLabel: "Stil",
  greetingRecipientLabel: "Für wen",
  copyGreeting: "Kopieren",
  copiedToClipboard: "In Zwischenablage kopiert",
  sendViaSms: "SMS",
  ageLabel: "Alter",
  importantPerson: "Wichtig (Mutter, Partner*in)",
  yearWord: (n: number) => (n === 1 ? "Jahr" : "Jahre"),

  // Modal extra
  phone: "Telefon (optional)",
  phonePlaceholder: "+49...",
  tags: "Tags",
  addPhoto: "Foto hinzufügen",
  changePhoto: "Foto ändern",
  removePhoto: "Foto entfernen",

  // Einstellungen
  settings: "Einstellungen",
  theme: "Design",
  themeLight: "Hell",
  themeDark: "Dunkel",
  notificationTime: "Erinnerungszeit",
  exportData: "Daten exportieren",
  exportDataList: "Als Liste exportieren (CSV)",
  exportDataFull: "Vollständiger Export (JSON)",
  importData: "Daten importieren",
  importFromContacts: "Aus Kontakten importieren",
  importOnlyWithBirthday: "Nur Kontakte mit Geburtsdatum",
  importUpdateChanges: "Änderungen beim erneuten Import übernehmen",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number,
  ) =>
    `Import aus Kontakten: hinzugefügt ${added}, aktualisiert ${updated}, übersprungen ${skipped}. Kontakte mit Geburtstag: ${total}.`,
  contactsPermissionDenied: "Zugriff auf Kontakte verweigert",
  contactsPermissionDeniedHint:
    "Aktiviere den Zugriff auf Kontakte für die App in den Einstellungen.",
  openSettings: "Einstellungen öffnen",
  noContactsWithBirthday:
    "Keine Kontakte mit Geburtsdatum gefunden. Füge die Daten in der Kontakte-App hinzu.",
  importPlaceholder: "CSV oder JSON einfügen...",
  about: "Über die App",
  aboutText: "Geburtstage – vergiss nie wieder einen besonderen Tag.",
  version: "Version",
  writeToSupport: "Support kontaktieren",
  donateToAuthor: "Autor unterstützen (Spende)",
  donationLinkNotConfigured:
    "Der Spendenlink ist noch nicht konfiguriert. Lege ihn in den App-Einstellungen fest.",
  exportSuccess: "Daten exportiert",
  importSuccess: "Daten importiert",
  importError: "Import fehlgeschlagen",
  importCount: (imported: number, total: number) =>
    `Importiert: ${imported}, insgesamt: ${total}`,
  openEmailFailed: "E-Mail konnte nicht geöffnet werden",
  shareFailed: "Teilen-Dialog konnte nicht geöffnet werden",
  addPhoneToContact:
    "Telefonnummer zur Kontaktkarte hinzufügen",
  selectContact: "Kontakt auswählen",
  openWhatsAppFailed: "WhatsApp konnte nicht geöffnet werden",
  openTelegramFailed: "Telegram konnte nicht geöffnet werden",
  openSmsFailed: "SMS-App konnte nicht geöffnet werden",
  openCallFailed: "Anruf konnte nicht gestartet werden",

  // Statistiken
  statistics: "Statistiken",
  statsThisYear: "Geburtstage dieses Jahr",
  statsThisMonth: "Diesen Monat",
  statsThisQuarter: "Dieses Quartal",
  statsNearest: "Nächster Geburtstag",
  statsCountdown: "Tage bis zum nächsten",
  statsByMonth: "Nach Monaten",

  // Tags
  tagFamily: "Familie",
  tagFriends: "Freunde",
  tagWork: "Arbeit",
  tagOther: "Andere",
  filterByTag: "Nach Tag filtern",
  categories: "Kategorien",
  allTags: "Alle",

  // In-App-Bewertung
  rateAppTitle: "Gefällt dir die App?",
  rateAppMessage:
    "Hinterlasse eine Bewertung im Store – so finden andere die App leichter.",
  rateAppRate: "Bewerten",
  rateAppLater: "Später",

  // Onboarding
  onboardingSlide1Title: "Füge deinen ersten Geburtstag hinzu",
  onboardingSlide1Text:
    "Speichere die Geburtstage deiner Liebsten – so vergisst du nie zu gratulieren.",
  onboardingSlide2Title: "Hier erscheinen die Erinnerungen",
  onboardingSlide2Text:
    "Die App erinnert dich 3 Tage vorher, 1 Tag vorher und am Tag selbst. Wähle eine passende Uhrzeit.",
  onboardingSkip: "Überspringen",
  onboardingStart: "Starten",
  onboardingAllowNotifications: "Benachrichtigungen erlauben",

  // Intelligente Erinnerungen
  notifyOnBirthdayDay: "Erinnerung am Geburtstagstag",
  notifyOnBirthdayDayHint:
    "3 Tage und 1 Tag vorher – immer; am Tag selbst – optional",

  // Ruhezeiten
  quietHours: "Ruhezeiten",
  quietHoursHint: "Nachts keine Erinnerungen senden",
  quietHoursFrom: "Von (Stunde)",
  quietHoursTo: "Bis (Stunde)",

  // Sprache
  language: "Sprache",
  languageUk: "Ukrainisch",
  languageEn: "Englisch",
  languageEs: "Spanisch",
  languageIt: "Italienisch",
  languagePt: "Portugiesisch",
  languageDe: "Deutsch",

  // Benachrichtigungen
  notificationTitle3Days: "Geburtstags-Erinnerung 🎉",
  notificationBody3Days: (name: string) =>
    `Der Geburtstag von ${name} ist in 3 Tagen 🎉`,
  notificationTitle1Day: "Geburtstags-Erinnerung 🎂",
  notificationBody1Day: (name: string) =>
    `Morgen hat ${name} Geburtstag 🎂`,
  notificationTitleToday: "Heute Geburtstag! 🎈",
  notificationBodyToday: (name: string) =>
    `Heute hat ${name} Geburtstag 🎈`,

  settingsBatteryOptimizationHint:
    "Damit Erinnerungen auch bei geschlossener App ankommen, deaktiviere die Akkuoptimierung für diese App.",
  settingsBatteryOptimizationButton: "Einstellungen öffnen",

  widgetTitle: "Geburtstage heute",
  widgetEmpty: "Heute hat niemand Geburtstag",

  // Sternzeichen
  zodiacLabel: "Sternzeichen",
  zodiacFactLabel: "Interessante Info",
  zodiac_capricorn: "Steinbock",
  zodiac_aquarius: "Wassermann",
  zodiac_pisces: "Fische",
  zodiac_aries: "Widder",
  zodiac_taurus: "Stier",
  zodiac_gemini: "Zwillinge",
  zodiac_cancer: "Krebs",
  zodiac_leo: "Löwe",
  zodiac_virgo: "Jungfrau",
  zodiac_libra: "Waage",
  zodiac_scorpio: "Skorpion",
  zodiac_sagittarius: "Schütze",
  zodiacFact_capricorn:
    "Steinböcke erreichen oft Großes dank ihrer Ausdauer und Disziplin.",
  zodiacFact_aquarius:
    "Wassermänner lieben das Ungewöhnliche und haben oft eine originelle Sicht auf die Welt.",
  zodiacFact_pisces:
    "Fische sind sehr sensibel und intuitiv und haben häufig kreative Talente.",
  zodiacFact_aries:
    "Widder sind geborene Anführer – energisch und initiativ.",
  zodiacFact_taurus:
    "Stiere schätzen Komfort und Stabilität und haben einen ausgeprägten Sinn für Geschmack.",
  zodiacFact_gemini:
    "Zwillinge finden leicht Anschluss und reden gern mit anderen.",
  zodiacFact_cancer:
    "Krebse sind stark an Zuhause und Familie gebunden und sehr empathisch.",
  zodiacFact_leo:
    "Löwen stehen gern im Mittelpunkt und besitzen oft viel Charisma.",
  zodiacFact_virgo:
    "Jungfrauen achten auf Details und lieben Ordnung.",
  zodiacFact_libra:
    "Waagen suchen Harmonie und Schönheit; Fairness ist ihnen wichtig.",
  zodiacFact_scorpio:
    "Skorpione empfinden Emotionen sehr tief und haben einen starken Willen.",
  zodiacFact_sagittarius:
    "Schützen lieben Reisen und neue Erfahrungen und sind meist optimistisch.",
};

