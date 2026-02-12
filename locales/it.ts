import { uk } from "./uk";

function getDaysWordIt(days: number): string {
  return days === 1 ? "giorno" : "giorni";
}

export const it: typeof uk = {
  // Navigazione
  home: "Home",
  homeShort: "Home",
  allBirthdays: "Tutti i compleanni",
  allBirthdaysShort: "Lista",
  calendarShort: "Calendario",
  settingsShort: "Impostazioni",

  // Schermata Home
  appName: "Promemoria compleanni",
  subtitle: "Non dimenticare mai un giorno speciale",
  todaysBirthdays: "Compleanni di oggi",
  upcomingBirthdays: "In arrivo (prossimi 7 giorni)",
  noEventsToday: "Nessun evento oggi 🎈",
  todayEmptyState: "Nessun compleanno oggi 🎈\nMa presto ci saranno 😉",
  heroTodayTitle: "Oggi è il compleanno!",
  heroTodayDays: "0 giorni",
  heroNearestTitle: "Prossimo compleanno",
  heroButtonGreet: "Fai gli auguri",
  heroButtonGift: "Regalo",
  statsCollapsed: "Statistiche",
  statsExpand: "mostra",
  statsCollapse: "nascondi",
  statsThisMonthShort: "Questo mese",
  statsThisYearShort: "Questo anno",
  statsNearestShort: "Più vicino",
  noUpcomingBirthdays:
    "Nessun compleanno in arrivo. Aggiungine uno per iniziare 🎂",

  // Scheda compleanno
  today: "Oggi! 🎉",
  todayShort: "Oggi",
  tomorrow: "Domani",
  inDays: (days: number) => `Tra ${days} ${getDaysWordIt(days)}`,
  turns: (age: number) => `Compie ${age}`,

  // Modale
  addBirthday: "Aggiungi compleanno",
  editBirthday: "Modifica compleanno",
  personName: "Nome della persona *",
  enterName: "Inserisci il nome",
  dateOfBirth: "Data di nascita *",
  hideYear: "Non conosco l'anno di nascita",
  birthdayLabel: "Compleanno",
  note: "Nota (facoltativa)",
  addNote: "Aggiungi nota...",
  save: "Salva",
  saving: "Salvataggio...",

  // Validazione
  validationError: "Errore di validazione",
  pleaseEnterName: "Inserisci un nome",
  dateCannotBeFuture: "La data di nascita non può essere nel futuro",
  error: "Errore",
  failedToSave: "Impossibile salvare il compleanno",

  // Lista
  deleteBirthday: "Elimina compleanno",
  deleteConfirm: "Sei sicuro di voler eliminare questo compleanno?",
  cancel: "Annulla",
  delete: "Elimina",
  noBirthdaysYet:
    "Non ci sono ancora compleanni. Aggiungine uno per iniziare 🎂",
  sortBy: "Ordina per",
  sortByDate: "Per data",
  sortByName: "Per nome",
  sortByAge: "Per età",

  // Extra Home
  homeGreeting: "Ciao,",
  greetingSubtext: "Ecco l'aggiornamento per oggi:",
  sectionBirthdays: "Compleanni",
  noResults: "Nessun risultato",
  noBirthdaysInPeriod: "Nessun compleanno in questo periodo",
  searchPlaceholder: "Cerca compleanni",
  filterToday: "Oggi",
  filterWeek: "Settimana",
  filterMonth: "Mese",
  filterYear: "Anno",
  dayNames: [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  monthNames: [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
  ],
  monthNamesShort: [
    "gen",
    "feb",
    "mar",
    "apr",
    "mag",
    "giu",
    "lug",
    "ago",
    "set",
    "ott",
    "nov",
    "dic",
  ],
  calendar: "Calendario",
  noBirthdaysOnDate: "Nessun compleanno in questo giorno",
  currentDateFormatted: () => {
    const d = new Date();
    return `${it.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${
      it.dayNames[d.getDay()]
    }`;
  },

  // Azioni scheda
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Invia regalo",
  giftSearchQuery: "idee regalo",
  giftIdeasFor: (name: string) => `Idee regalo per ${name}`,
  giftChooseBudget: "Scegli il budget:",
  giftBudget500: "Fino a 500 UAH",
  giftBudget1000: "Fino a 1000 UAH",
  giftBudget2000: "Fino a 2000 UAH",
  giftOr: "Oppure:",
  giftForWoman: "Per lei",
  giftForMan: "Per lui",
  giftUniversal: "Universale",
  giftOpenSearch: "Apri ricerca",
  messenger: "Messenger",
  call: "Chiama",
  greeting: "Auguri",
  generateGreeting: "Testo degli auguri",
  greetingShort: "Breve",
  greetingOfficial: "Formale",
  greetingFunny: "Divertente",
  greetingForFriend: "Per un amico",
  greetingForGirlfriend: "Per partner",
  greetingForFamily: "Per la famiglia",
  greetingForColleague: "Per collega",
  greetingRefresh: "Un'altra variante",
  greetingStyleLabel: "Stile",
  greetingRecipientLabel: "A chi",
  copyGreeting: "Copia",
  copiedToClipboard: "Copiato negli appunti",
  sendViaSms: "SMS",
  ageLabel: "Età",
  importantPerson: "Importante (mamma, partner)",
  yearWord: (n: number) => (n === 1 ? "anno" : "anni"),

  // Modale extra
  phone: "Telefono (facoltativo)",
  phonePlaceholder: "+39...",
  tags: "Tag",
  addPhoto: "Aggiungi foto",
  changePhoto: "Cambia foto",
  removePhoto: "Rimuovi foto",

  // Impostazioni
  settings: "Impostazioni",
  theme: "Tema",
  themeLight: "Chiaro",
  themeDark: "Scuro",
  notificationTime: "Ora del promemoria",
  exportData: "Esporta dati",
  exportDataList: "Esporta come lista (CSV)",
  exportDataFull: "Esporta completo (JSON)",
  importData: "Importa dati",
  importFromContacts: "Importa dai Contatti",
  importOnlyWithBirthday: "Solo contatti con data di compleanno",
  importUpdateChanges: "Aggiorna i cambiamenti al reimportare",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number,
  ) =>
    `Importazione da Contatti: aggiunti ${added}, aggiornati ${updated}, ignorati ${skipped}. Contatti con compleanno: ${total}.`,
  contactsPermissionDenied: "Accesso ai contatti negato",
  contactsPermissionDeniedHint:
    "Abilita l'accesso ai Contatti per l'app nelle Impostazioni.",
  openSettings: "Apri impostazioni",
  noContactsWithBirthday:
    "Nessun contatto con data di compleanno trovata. Aggiungi le date nell'app Contatti.",
  importPlaceholder: "Incolla CSV o JSON...",
  about: "Informazioni",
  aboutText: "Compleanni — non dimenticare mai un giorno speciale.",
  version: "Versione",
  writeToSupport: "Contatta il supporto",
  donateToAuthor: "Sostieni l'autore (donazione)",
  donationLinkNotConfigured:
    "Il link per la donazione non è ancora configurato. Impostalo nelle impostazioni dell'app.",
  exportSuccess: "Dati esportati",
  importSuccess: "Dati importati",
  importError: "Impossibile importare",
  importCount: (imported: number, total: number) =>
    `Importati: ${imported}, totale: ${total}`,
  openEmailFailed: "Impossibile aprire l'e-mail",
  shareFailed: "Impossibile aprire la condivisione",
  addPhoneToContact:
    "Aggiungi il numero di telefono alla scheda del contatto",
  selectContact: "Seleziona contatto",
  openWhatsAppFailed: "Impossibile aprire WhatsApp",
  openTelegramFailed: "Impossibile aprire Telegram",
  openSmsFailed: "Impossibile aprire gli SMS",
  openCallFailed: "Impossibile avviare la chiamata",

  // Statistiche
  statistics: "Statistiche",
  statsThisYear: "Compleanni quest'anno",
  statsThisMonth: "Questo mese",
  statsThisQuarter: "Questo trimestre",
  statsNearest: "Compleanno più vicino",
  statsCountdown: "Giorni al prossimo",
  statsByMonth: "Per mese",

  // Tag
  tagFamily: "Famiglia",
  tagFriends: "Amici",
  tagWork: "Lavoro",
  tagOther: "Altro",
  filterByTag: "Filtra per tag",
  categories: "Categorie",
  allTags: "Tutti",

  // In-app review
  rateAppTitle: "Ti piace l'app?",
  rateAppMessage:
    "Lascia una valutazione nello store — aiuta altri utenti a trovarci.",
  rateAppRate: "Valuta",
  rateAppLater: "Più tardi",

  // Onboarding
  onboardingSlide1Title: "Aggiungi il tuo primo compleanno",
  onboardingSlide1Text:
    "Salva i compleanni delle persone importanti — non dimenticare di fare gli auguri.",
  onboardingSlide2Title: "Qui appariranno i promemoria",
  onboardingSlide2Text:
    "L'app ti avviserà 3 giorni prima, 1 giorno prima e il giorno stesso. Scegli un orario comodo.",
  onboardingSkip: "Salta",
  onboardingStart: "Inizia",
  onboardingAllowNotifications: "Consenti notifiche",

  // Promemoria intelligenti
  notifyOnBirthdayDay: "Promemoria il giorno del compleanno",
  notifyOnBirthdayDayHint:
    "3 giorni e 1 giorno prima — sempre; il giorno stesso — facoltativo",

  // Ore silenziose
  quietHours: "Ore silenziose",
  quietHoursHint: "Non inviare promemoria di notte",
  quietHoursFrom: "Da (ora)",
  quietHoursTo: "A (ora)",

  // Lingua
  language: "Lingua",
  languageUk: "Ucraino",
  languageEn: "Inglese",
  languageEs: "Spagnolo",
  languageIt: "Italiano",
  languagePt: "Portoghese",
  languageDe: "Tedesco",

  // Notifiche
  notificationTitle3Days: "Promemoria compleanno 🎉",
  notificationBody3Days: (name: string) =>
    `Il compleanno di ${name} è tra 3 giorni 🎉`,
  notificationTitle1Day: "Promemoria compleanno 🎂",
  notificationBody1Day: (name: string) =>
    `Domani è il compleanno di ${name} 🎂`,
  notificationTitleToday: "Compleanno oggi! 🎈",
  notificationBodyToday: (name: string) =>
    `Oggi è il compleanno di ${name} 🎈`,

  settingsBatteryOptimizationHint:
    "Per ricevere promemoria quando l'app è chiusa, disattiva l'ottimizzazione batteria per questa app.",
  settingsBatteryOptimizationButton: "Apri impostazioni",

  widgetTitle: "Compleanni di oggi",
  widgetEmpty: "Nessuno compie gli anni oggi",

  // Segni zodiacali
  zodiacLabel: "Segno zodiacale",
  zodiacFactLabel: "Curiosità",
  zodiac_capricorn: "Capricorno",
  zodiac_aquarius: "Acquario",
  zodiac_pisces: "Pesci",
  zodiac_aries: "Ariete",
  zodiac_taurus: "Toro",
  zodiac_gemini: "Gemelli",
  zodiac_cancer: "Cancro",
  zodiac_leo: "Leone",
  zodiac_virgo: "Vergine",
  zodiac_libra: "Bilancia",
  zodiac_scorpio: "Scorpione",
  zodiac_sagittarius: "Sagittario",
  zodiacFact_capricorn:
    "I Capricorno spesso raggiungono grandi traguardi grazie a perseveranza e disciplina.",
  zodiacFact_aquarius:
    "Gli Acquario amano ciò che è insolito e hanno spesso una visione originale del mondo.",
  zodiacFact_pisces:
    "I Pesci sono molto sensibili e intuitivi, spesso con talento creativo.",
  zodiacFact_aries:
    "Gli Ariete sono leader nati, energici e pieni di iniziativa.",
  zodiacFact_taurus:
    "I Toro apprezzano il comfort e la stabilità, con un gusto molto sviluppato.",
  zodiacFact_gemini:
    "I Gemelli trovano facilmente un linguaggio comune con tutti e amano conversare.",
  zodiacFact_cancer:
    "I Cancro sono molto legati a casa e famiglia e hanno grande empatia.",
  zodiacFact_leo:
    "I Leone amano essere al centro dell'attenzione e spesso hanno molta carisma.",
  zodiacFact_virgo:
    "Le Vergini prestano attenzione ai dettagli e amano l'ordine.",
  zodiacFact_libra:
    "Le Bilance cercano armonia e bellezza; per loro è importante la giustizia.",
  zodiacFact_scorpio:
    "Gli Scorpione sentono le emozioni in profondità e hanno una forte volontà.",
  zodiacFact_sagittarius:
    "I Sagittario amano viaggiare e vivere nuove esperienze; sono ottimisti.",
};

