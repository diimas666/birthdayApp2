import { uk } from "./uk";

function getDaysWordPt(days: number): string {
  return days === 1 ? "dia" : "dias";
}

export const pt: typeof uk = {
  // Navegação
  home: "Início",
  homeShort: "Início",
  allBirthdays: "Todos os aniversários",
  allBirthdaysShort: "Lista",
  calendarShort: "Calendário",
  settingsShort: "Configurações",

  // Tela inicial
  appName: "Lembrete de aniversários",
  subtitle: "Nunca mais esqueça um dia especial",
  todaysBirthdays: "Aniversários de hoje",
  upcomingBirthdays: "Próximos (7 dias)",
  noEventsToday: "Nenhum evento hoje 🎈",
  todayEmptyState: "Nenhum aniversário hoje 🎈\nMas em breve haverá 😉",
  heroTodayTitle: "Hoje é o aniversário!",
  heroTodayDays: "0 dias",
  heroNearestTitle: "Próximo aniversário",
  heroButtonGreet: "Parabenizar",
  heroButtonGift: "Presente",
  statsCollapsed: "Estatísticas",
  statsExpand: "expandir",
  statsCollapse: "recolher",
  statsThisMonthShort: "Este mês",
  statsThisYearShort: "Este ano",
  statsNearestShort: "Mais próximo",
  noUpcomingBirthdays:
    "Nenhum aniversário se aproxima. Adicione um para começar 🎂",

  // Cartão de aniversário
  today: "Hoje! 🎉",
  todayShort: "Hoje",
  tomorrow: "Amanhã",
  inDays: (days: number) => `Em ${days} ${getDaysWordPt(days)}`,
  turns: (age: number) => `Completa ${age}`,

  // Modal
  addBirthday: "Adicionar aniversário",
  editBirthday: "Editar aniversário",
  personName: "Nome da pessoa *",
  enterName: "Digite o nome",
  dateOfBirth: "Data de nascimento *",
  hideYear: "Não sei o ano de nascimento",
  birthdayLabel: "Aniversário",
  note: "Nota (opcional)",
  addNote: "Adicionar nota...",
  save: "Salvar",
  saving: "Salvando...",

  // Validação
  validationError: "Erro de validação",
  pleaseEnterName: "Por favor, digite um nome",
  dateCannotBeFuture: "A data de nascimento não pode ser futura",
  error: "Erro",
  failedToSave: "Não foi possível salvar o aniversário",

  // Lista
  deleteBirthday: "Excluir aniversário",
  deleteConfirm: "Tem certeza de que deseja excluir este aniversário?",
  cancel: "Cancelar",
  delete: "Excluir",
  noBirthdaysYet:
    "Ainda não há aniversários. Adicione um para começar 🎂",
  sortBy: "Ordenar por",
  sortByDate: "Por data",
  sortByName: "Por nome",
  sortByAge: "Por idade",

  // Home extra
  homeGreeting: "Olá,",
  greetingSubtext: "Aqui está o resumo de hoje:",
  sectionBirthdays: "Aniversários",
  noResults: "Nenhum resultado",
  noBirthdaysInPeriod: "Nenhum aniversário nesse período",
  searchPlaceholder: "Buscar aniversários",
  filterToday: "Hoje",
  filterWeek: "Semana",
  filterMonth: "Mês",
  filterYear: "Ano",
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  monthNames: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  monthNamesShort: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  calendar: "Calendário",
  noBirthdaysOnDate: "Nenhum aniversário neste dia",
  currentDateFormatted: () => {
    const d = new Date();
    return `${pt.monthNamesShort[d.getMonth()]} ${d.getDate()}, ${
      pt.dayNames[d.getDay()]
    }`;
  },

  // Ações do cartão
  whatsApp: "WhatsApp",
  telegram: "Telegram",
  sendGift: "Enviar presente",
  giftSearchQuery: "ideias de presente",
  giftIdeasFor: (name: string) => `Ideias de presente para ${name}`,
  giftChooseBudget: "Escolha o orçamento:",
  giftBudget500: "Até 500 UAH",
  giftBudget1000: "Até 1000 UAH",
  giftBudget2000: "Até 2000 UAH",
  giftOr: "Ou:",
  giftForWoman: "Para ela",
  giftForMan: "Para ele",
  giftUniversal: "Universal",
  giftOpenSearch: "Abrir busca",
  messenger: "Messenger",
  call: "Ligar",
  greeting: "Mensagem",
  generateGreeting: "Texto da mensagem",
  greetingShort: "Curta",
  greetingOfficial: "Formal",
  greetingFunny: "Engraçada",
  greetingForFriend: "Para amigo",
  greetingForGirlfriend: "Para parceiro(a)",
  greetingForFamily: "Para família",
  greetingForColleague: "Para colega",
  greetingRefresh: "Outra opção",
  greetingStyleLabel: "Estilo",
  greetingRecipientLabel: "Para quem",
  copyGreeting: "Copiar",
  copiedToClipboard: "Copiado para a área de transferência",
  sendViaSms: "SMS",
  ageLabel: "Idade",
  importantPerson: "Importante (mãe, parceiro(a))",
  yearWord: (n: number) => (n === 1 ? "ano" : "anos"),

  // Modal extra
  phone: "Telefone (opcional)",
  phonePlaceholder: "Número de telefone",
  tags: "Etiquetas",
  addPhoto: "Adicionar foto",
  changePhoto: "Trocar foto",
  removePhoto: "Remover foto",
  giftIdeasLabel: "Ideias de presente (opcional)",
  giftIdeasPlaceholder: "Escreva ideias de presente (uma por linha)",

  // Configurações
  settings: "Configurações",
  theme: "Tema",
  themeLight: "Claro",
  themeDark: "Escuro",
  notificationTime: "Hora do lembrete",
  csvName: "Nome",
  csvDate: "Data",
  csvPhone: "Telefone",
  csvNote: "Nota",
  csvTags: "Etiquetas",
  exportData: "Exportar dados",
  exportDataList: "Exportar como lista (CSV)",
  exportDataFull: "Exportar completo (JSON)",
  importData: "Importar dados",
  importFromContacts: "Importar dos Contatos",
  importOnlyWithBirthday: "Apenas contatos com data de aniversário",
  importUpdateChanges: "Atualizar alterações ao reimportar",
  importFromContactsSuccess: (
    added: number,
    updated: number,
    skipped: number,
    total: number,
  ) =>
    `Importação dos Contatos: adicionados ${added}, atualizados ${updated}, ignorados ${skipped}. Contatos com aniversário: ${total}.`,
  contactsPermissionDenied: "Acesso aos contatos negado",
  contactsPermissionDeniedHint:
    "Ative o acesso aos Contatos para o aplicativo nas Configurações.",
  contactsPermissionTitle: "Contatos",
  contactsPermissionMessage: "O app precisa de acesso aos contatos para importar aniversários.",
  contactsPermissionButtonOK: "OK",
  ok: "OK",
  openSettings: "Abrir configurações",
  noContactsWithBirthday:
    "Nenhum contato com data de aniversário encontrada. Adicione as datas no app Contatos.",
  importPlaceholder: "Cole CSV ou JSON...",
  about: "Sobre o app",
  aboutText: "Aniversários — nunca esqueça um dia especial.",
  version: "Versão",
  writeToSupport: "Falar com o suporte",
  donateToAuthor: "Apoiar o autor (doação)",
  donationLinkNotConfigured:
    "O link de doação ainda não está configurado. Defina-o nas configurações do app.",
  exportSuccess: "Dados exportados",
  importSuccess: "Dados importados",
  importError: "Falha ao importar",
  csvErrorEmpty: "O arquivo CSV está vazio",
  csvErrorInvalidFormat:
    "Formato de CSV inválido: a primeira linha deve conter os cabeçalhos das colunas (nome, data, telefone, nota, etiquetas).",
  importCount: (imported: number, total: number) =>
    `Importados: ${imported}, total: ${total}`,
  openEmailFailed: "Não foi possível abrir o e-mail",
  shareFailed: "Não foi possível abrir o compartilhamento",
  addPhoneToContact:
    "Adicionar o número de telefone ao cartão do contato",
  selectContact: "Selecionar contato",
  openWhatsAppFailed: "Não foi possível abrir o WhatsApp",
  openTelegramFailed: "Não foi possível abrir o Telegram",
  openSmsFailed: "Não foi possível abrir o SMS",
  openCallFailed: "Não foi possível iniciar a chamada",

  // Estatísticas
  statistics: "Estatísticas",
  statsThisYear: "Aniversários neste ano",
  statsThisMonth: "Este mês",
  statsThisQuarter: "Este trimestre",
  statsNearest: "Aniversário mais próximo",
  statsCountdown: "Dias até o próximo",
  statsByMonth: "Por mês",

  // Tags
  tagFamily: "Família",
  tagFriends: "Amigos",
  tagWork: "Trabalho",
  tagOther: "Outros",
  filterByTag: "Filtrar por etiqueta",
  categories: "Categorias",
  allTags: "Todas",

  // In-app review
  rateAppTitle: "Gostando do app?",
  rateAppMessage:
    "Deixe uma avaliação na loja — isso ajuda outras pessoas a nos encontrarem.",
  rateAppRate: "Avaliar",
  rateAppLater: "Depois",

  // Onboarding
  onboardingSlide1Title: "Adicione o seu primeiro aniversário",
  onboardingSlide1Text:
    "Salve os aniversários de quem é importante — não esqueça de parabenizar.",
  onboardingSlide2Title: "Aqui ficarão os lembretes",
  onboardingSlide2Text:
    "O app lembrará você 3 dias antes, 1 dia antes e no próprio dia. Escolha um horário conveniente.",
  onboardingSkip: "Pular",
  onboardingStart: "Começar",
  onboardingAllowNotifications: "Permitir notificações",

  // Lembretes inteligentes
  notifyOnBirthdayDay: "Lembrete no dia do aniversário",
  notifyOnBirthdayDayHint:
    "3 dias e 1 dia antes — sempre; no dia — opcional",

  // Horário silencioso
  quietHours: "Horário silencioso",
  quietHoursHint: "Não enviar lembretes à noite",
  quietHoursFrom: "De (hora)",
  quietHoursTo: "Até (hora)",

  // Idioma
  language: "Idioma",
  languageUk: "Ucraniano",
  languageEn: "Inglês",
  languageEs: "Espanhol",
  languageIt: "Italiano",
  languagePt: "Português",
  languageDe: "Alemão",

  // Notificações
  notificationTitle3Days: "Lembrete de aniversário 🎉",
  notificationBody3Days: (name: string) =>
    `O aniversário de ${name} é em 3 dias 🎉`,
  notificationTitle1Day: "Lembrete de aniversário 🎂",
  notificationBody1Day: (name: string) =>
    `Amanhã é o aniversário de ${name} 🎂`,
  notificationTitleToday: "Aniversário hoje! 🎈",
  notificationBodyToday: (name: string) =>
    `Hoje é o aniversário de ${name} 🎈`,

  settingsBatteryOptimizationHint:
    "Para receber lembretes quando o app estiver fechado, desative a otimização de bateria para este app.",
  settingsBatteryOptimizationButton: "Abrir configurações",

  widgetTitle: "Aniversários de hoje",
  widgetEmpty: "Ninguém faz aniversário hoje",

  // Signos do zodíaco
  zodiacLabel: "Signo do zodíaco",
  zodiacFactLabel: "Curiosidade",
  zodiac_capricorn: "Capricórnio",
  zodiac_aquarius: "Aquário",
  zodiac_pisces: "Peixes",
  zodiac_aries: "Áries",
  zodiac_taurus: "Touro",
  zodiac_gemini: "Gêmeos",
  zodiac_cancer: "Câncer",
  zodiac_leo: "Leão",
  zodiac_virgo: "Virgem",
  zodiac_libra: "Libra",
  zodiac_scorpio: "Escorpião",
  zodiac_sagittarius: "Sagitário",
  zodiacFact_capricorn:
    "Capricornianos costumam atingir grandes metas graças à persistência e disciplina.",
  zodiacFact_aquarius:
    "Aquarianos gostam do que é diferente e muitas vezes têm uma visão original do mundo.",
  zodiacFact_pisces:
    "Piscianos são muito sensíveis e intuitivos, muitas vezes com talento criativo.",
  zodiacFact_aries:
    "Arianos são líderes natos, cheios de energia e iniciativa.",
  zodiacFact_taurus:
    "Taurinos valorizam o conforto e a estabilidade e têm um gosto apurado.",
  zodiacFact_gemini:
    "Geminianos rapidamente encontram assunto com qualquer pessoa e adoram conversar.",
  zodiacFact_cancer:
    "Cancerianos são muito ligados à casa e à família e têm grande empatia.",
  zodiacFact_leo:
    "Leoninos gostam de estar no centro das atenções e costumam ter muita carisma.",
  zodiacFact_virgo:
    "Virginianos prestam atenção aos detalhes e gostam de organização.",
  zodiacFact_libra:
    "Librianos buscam harmonia e beleza; a justiça é importante para eles.",
  zodiacFact_scorpio:
    "Escorpianos sentem as emoções de forma intensa e têm grande força de vontade.",
  zodiacFact_sagittarius:
    "Sagitarianos amam viajar e viver novas experiências; são otimistas.",
};

