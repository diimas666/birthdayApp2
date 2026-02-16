import { uk } from "./uk";

function getDaysWordEs(days: number): string {
  return days === 1 ? "día" : "días";
}

export const es: typeof uk = {
  // Navegación
  home: "Inicio",
  homeShort: "Inicio",
  allBirthdays: "Todos los cumpleaños",
  allBirthdaysShort: "Lista",
  calendarShort: "Calendario",
  settingsShort: "Ajustes",

  // Pantalla de inicio
  appName: "Recordatorio de cumpleaños",
  subtitle: "No vuelvas a olvidar un día especial",
  todaysBirthdays: "Cumpleaños de hoy",
  upcomingBirthdays: "Próximos (7 días)",
  noEventsToday: "Hoy no hay eventos 🎈",
  todayEmptyState: "Hoy no hay cumpleaños 🎈\nPero pronto los habrá 😉",
  heroTodayTitle: "¡Hoy es el cumpleaños!",
  heroTodayDays: "0 días",
  heroNearestTitle: "Próximo cumpleaños",
  heroButtonGreet: "Felicitar",
  heroButtonGift: "Regalo",
  statsCollapsed: "Estadísticas",
  statsExpand: "ver más",
  statsCollapse: "ocultar",
  statsThisMonthShort: "Este mes",
  statsThisYearShort: "Este año",
  statsNearestShort: "Más cercano",
  noUpcomingBirthdays:
    "No hay cumpleaños próximos. Añade uno para empezar 🎂",

  // Tarjeta de cumpleaños
  today: "¡Hoy! 🎉",
  todayShort: "Hoy",
  tomorrow: "Mañana",
  inDays: (days: number) => `En ${days} ${getDaysWordEs(days)}`,
  turns: (age: number) => `Cumple ${age}`,

  // Modal
  addBirthday: "Añadir cumpleaños",
  editBirthday: "Editar cumpleaños",
  personName: "Nombre de la persona *",
  enterName: "Introduce el nombre",
  dateOfBirth: "Fecha de nacimiento *",
  hideYear: "No sé el año de nacimiento",
  birthdayLabel: "Cumpleaños",
  note: "Nota (opcional)",
  addNote: "Añadir nota...",
  save: "Guardar",
  saving: "Guardando...",

  // Validación
  validationError: "Error de validación",
  pleaseEnterName: "Por favor, introduce un nombre",
  dateCannotBeFuture: "La fecha de nacimiento no puede ser futura",
  error: "Error",
  failedToSave: "No se pudo guardar el cumpleaños",

  // Lista
  deleteBirthday: "Eliminar cumpleaños",
  deleteConfirm: "¿Seguro que quieres eliminar este cumpleaños?",
  cancel: "Cancelar",
  delete: "Eliminar",
  noBirthdaysYet: "Aún no hay cumpleaños. Añade uno para empezar 🎂",
  sortBy: "Ordenar por",
  sortByDate: "Por fecha",
  sortByName: "Por nombre",
  sortByAge: "Por edad",

  // Home extra
  homeGreeting: "Hola,",
  greetingSubtext: "Este es tu resumen para hoy:",
  sectionBirthdays: "Cumpleaños",
  noResults: "Sin resultados",
  noBirthdaysInPeriod: "No hay cumpleaños en este período",
  searchPlaceholder: "Buscar cumpleaños",
  filterToday: "Hoy",
  filterWeek: "Semana",
  filterMonth: "Mes",
  filterYear: "Año",
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  monthNames: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  calendar: "Calendario",
  noBirthdaysOnDate: "No hay cumpleaños en este día",
  currentDateFormatted: () => {
    const d = new Date();
    return `${es.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${
      es.dayNames[d.getDay()]
    }`;
  },

  // Acciones de la tarjeta
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Enviar regalo",
  giftSearchQuery: "ideas de regalo",
  giftIdeasFor: (name: string) => `Ideas de regalo para ${name}`,
  giftChooseBudget: "Elige presupuesto:",
  giftBudget500: "Hasta 500 UAH",
  giftBudget1000: "Hasta 1000 UAH",
  giftBudget2000: "Hasta 2000 UAH",
  giftOr: "O:",
  giftForWoman: "Para ella",
  giftForMan: "Para él",
  giftUniversal: "Universal",
  giftOpenSearch: "Abrir búsqueda",
  messenger: "Messenger",
  call: "Llamar",
  greeting: "Felicitación",
  generateGreeting: "Texto de felicitación",
  greetingShort: "Corta",
  greetingOfficial: "Formal",
  greetingFunny: "Divertida",
  greetingForFriend: "Para amigo",
  greetingForGirlfriend: "Para pareja",
  greetingForFamily: "Para familia",
  greetingForColleague: "Para colega",
  greetingRefresh: "Otra opción",
  greetingStyleLabel: "Estilo",
  greetingRecipientLabel: "Para quién",
  copyGreeting: "Copiar",
  copiedToClipboard: "Copiado al portapapeles",
  sendViaSms: "SMS",
  ageLabel: "Edad",
  importantPerson: "Importante (mamá, pareja)",
  yearWord: (n: number) => (n === 1 ? "año" : "años"),

  // Modal extra
  phone: "Teléfono (opcional)",
  phonePlaceholder: "Número de teléfono",
  tags: "Etiquetas",
  addPhoto: "Añadir foto",
  changePhoto: "Cambiar foto",
  removePhoto: "Eliminar foto",
  giftIdeasLabel: "Ideas de regalo (opcional)",
  giftIdeasPlaceholder: "Escribe ideas de regalo (una por línea)",

  // Ajustes
  settings: "Ajustes",
  theme: "Tema",
  themeLight: "Claro",
  themeDark: "Oscuro",
  notificationTime: "Hora del recordatorio",
  csvName: "Nombre",
  csvDate: "Fecha",
  csvPhone: "Teléfono",
  csvNote: "Nota",
  csvTags: "Etiquetas",
  exportData: "Exportar datos",
  exportDataList: "Exportar como lista (CSV)",
  exportDataFull: "Exportar completo (JSON)",
  importData: "Importar datos",
  importFromContacts: "Importar desde Contactos",
  importOnlyWithBirthday: "Solo contactos con fecha de cumpleaños",
  importUpdateChanges: "Actualizar cambios al reimportar",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number,
  ) =>
    `Importación desde Contactos: añadidos ${added}, actualizados ${updated}, omitidos ${skipped}. Contactos con cumpleaños: ${total}.`,
  contactsPermissionDenied: "Acceso a contactos denegado",
  contactsPermissionDeniedHint:
    "Activa el acceso a Contactos para la app en Ajustes.",
  contactsPermissionTitle: "Contactos",
  contactsPermissionMessage: "La app necesita acceso a contactos para importar cumpleaños.",
  contactsPermissionButtonOK: "OK",
  ok: "OK",
  openSettings: "Abrir ajustes",
  noContactsWithBirthday:
    "No se encontraron contactos con fecha de cumpleaños. Añade fechas en la app de Contactos.",
  importPlaceholder: "Pega CSV o JSON...",
  about: "Acerca de la app",
  aboutText: "Cumpleaños — nunca olvides un día especial.",
  version: "Versión",
  writeToSupport: "Contactar con soporte",
  donateToAuthor: "Apoyar al autor (donar)",
  donationLinkNotConfigured:
    "El enlace de donación aún no está configurado. Añádelo en los ajustes de la app.",
  exportSuccess: "Datos exportados",
  importSuccess: "Datos importados",
  importError: "Error al importar",
  csvErrorEmpty: "El archivo CSV está vacío",
  csvErrorInvalidFormat:
    "Formato CSV no válido: la primera fila debe contener encabezados de columnas (nombre, fecha, teléfono, nota, etiquetas).",
  importCount: (imported: number, total: number) =>
    `Importados: ${imported}, total: ${total}`,
  openEmailFailed: "No se pudo abrir el correo",
  shareFailed: "No se pudo abrir el diálogo de compartir",
  addPhoneToContact: "Añadir número de teléfono a la tarjeta del contacto",
  selectContact: "Seleccionar contacto",
  openWhatsAppFailed: "No se pudo abrir WhatsApp",
  openTelegramFailed: "No se pudo abrir Telegram",
  openSmsFailed: "No se pudo abrir SMS",
  openCallFailed: "No se pudo iniciar la llamada",

  // Estadísticas
  statistics: "Estadísticas",
  statsThisYear: "Cumpleaños este año",
  statsThisMonth: "Este mes",
  statsThisQuarter: "Este trimestre",
  statsNearest: "Cumpleaños más cercano",
  statsCountdown: "Días hasta el próximo",
  statsByMonth: "Por meses",

  // Etiquetas
  tagFamily: "Familia",
  tagFriends: "Amigos",
  tagWork: "Trabajo",
  tagOther: "Otros",
  filterByTag: "Filtrar por etiqueta",
  categories: "Categorías",
  allTags: "Todas",

  // In-app review
  rateAppTitle: "¿Te gusta la app?",
  rateAppMessage:
    "Deja una valoración en la tienda — ayudará a otros a encontrarnos.",
  rateAppRate: "Valorar",
  rateAppLater: "Más tarde",

  // Onboarding
  onboardingSlide1Title: "Añade tu primer cumpleaños",
  onboardingSlide1Text:
    "Guarda los cumpleaños de las personas importantes — no olvides felicitar.",
  onboardingSlide2Title: "Aquí estarán los recordatorios",
  onboardingSlide2Text:
    "La app te avisará 3 días antes, 1 día antes y el mismo día. Elige una hora cómoda.",
  onboardingSkip: "Saltar",
  onboardingStart: "Empezar",
  onboardingAllowNotifications: "Permitir notificaciones",

  // Recordatorios inteligentes
  notifyOnBirthdayDay: "Recordatorio el día del cumpleaños",
  notifyOnBirthdayDayHint:
    "3 días y 1 día antes — siempre; el mismo día — opcional",

  // Horas de silencio
  quietHours: "Horas de silencio",
  quietHoursHint: "No enviar recordatorios por la noche",
  quietHoursFrom: "Desde (hora)",
  quietHoursTo: "Hasta (hora)",

  // Idioma
  language: "Idioma",
  languageUk: "Ucraniano",
  languageEn: "Inglés",
  languageEs: "Español",
  languageIt: "Italiano",
  languagePt: "Portugués",
  languageDe: "Alemán",

  // Notificaciones
  notificationTitle3Days: "Recordatorio de cumpleaños 🎉",
  notificationBody3Days: (name: string) =>
    `El cumpleaños de ${name} es en 3 días 🎉`,
  notificationTitle1Day: "Recordatorio de cumpleaños 🎂",
  notificationBody1Day: (name: string) =>
    `Mañana es el cumpleaños de ${name} 🎂`,
  notificationTitleToday: "¡Cumpleaños hoy! 🎈",
  notificationBodyToday: (name: string) =>
    `Hoy es el cumpleaños de ${name} 🎈`,

  settingsBatteryOptimizationHint:
    "Para recibir recordatorios cuando la app esté cerrada, desactiva la optimización de batería para esta app.",
  settingsBatteryOptimizationButton: "Abrir ajustes",
  settingsAlarmPermissionHint:
    "En Android 12+, activa \"Alarmas y recordatorios\" para este app para notificaciones fiables.",
  settingsAlarmPermissionButton: "Abrir ajustes de alarmas",

  widgetTitle: "Cumpleaños de hoy",
  widgetEmpty: "Hoy nadie cumple años",

  // Signos del zodiaco
  zodiacLabel: "Signo del zodiaco",
  zodiacFactLabel: "Dato interesante",
  zodiac_capricorn: "Capricornio",
  zodiac_aquarius: "Acuario",
  zodiac_pisces: "Piscis",
  zodiac_aries: "Aries",
  zodiac_taurus: "Tauro",
  zodiac_gemini: "Géminis",
  zodiac_cancer: "Cáncer",
  zodiac_leo: "Leo",
  zodiac_virgo: "Virgo",
  zodiac_libra: "Libra",
  zodiac_scorpio: "Escorpio",
  zodiac_sagittarius: "Sagitario",
  zodiacFact_capricorn:
    "Los capricornio suelen alcanzar grandes metas gracias a su constancia y disciplina.",
  zodiacFact_aquarius:
    "A los acuario les gusta lo inusual y a menudo tienen una visión original del mundo.",
  zodiacFact_pisces:
    "Piscis son muy sensibles e intuitivos, a menudo con talento creativo.",
  zodiacFact_aries:
    "Aries son líderes natos, llenos de energía e iniciativa.",
  zodiacFact_taurus:
    "Tauro valora la comodidad y la estabilidad, y suele tener buen gusto.",
  zodiacFact_gemini:
    "Géminis encuentran fácilmente tema de conversación con cualquiera y les encanta comunicarse.",
  zodiacFact_cancer:
    "Cáncer está muy unido a su hogar y familia, y tiene gran empatía.",
  zodiacFact_leo:
    "Leo adora estar en el centro de atención y suele tener mucha carisma.",
  zodiacFact_virgo:
    "Virgo presta atención a los detalles y le gusta el orden.",
  zodiacFact_libra:
    "Libra busca la armonía y la belleza; la justicia es importante para ellos.",
  zodiacFact_scorpio:
    "Escorpio siente las emociones con mucha profundidad y tiene una gran fuerza de voluntad.",
  zodiacFact_sagittarius:
    "Sagitario ama viajar y las nuevas experiencias; suele ser optimista.",
};

