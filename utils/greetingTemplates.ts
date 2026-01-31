export type GreetingStyle = 'short' | 'official' | 'funny';
export type GreetingRecipient = 'friend' | 'family' | 'colleague';

const TEMPLATES: Record<GreetingRecipient, Record<GreetingStyle, string>> = {
  friend: {
    short: 'З Днем народження! 🎉 Бажаю щастя та крутих подарунків!',
    official: 'Дорогий/а {name}, щиро вітаю з днем народження! Бажаю здоров\'я, щастя та успіхів у всіх справах.',
    funny: 'З Днем народження, {name}! 🎂 Рік минув — торт не минув. Їж, радій, не старій! 😄',
  },
  family: {
    short: 'З Днем народження, {name}! 💐 Щиро вітаю!',
    official: 'Рідний/а {name}, від усього серця вітаю з днем народження! Бажаю здоров\'я, миру в родині та щастя щодня.',
    funny: 'З Днем народження, {name}! 🎈 Свічки на торті — це не пожежа, це атмосфера! Любимо! 🥳',
  },
  colleague: {
    short: 'Вітаю з днем народження! Успіхів у справі. 🎯',
    official: 'Шановний/а {name}, прийміть вітання з днем народження! Бажаю професійних успіхів та благополуччя.',
    funny: 'З Днем народження, {name}! 🎂 Не забудь принести торт в офіс — це традиція! Успіхів! 😉',
  },
};

export function getGreetingText(
  style: GreetingStyle,
  recipient: GreetingRecipient,
  name: string
): string {
  const template = TEMPLATES[recipient][style];
  return template.replace(/\{name\}/g, name.trim() || 'друже');
}
