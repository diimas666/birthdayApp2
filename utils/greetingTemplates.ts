export type GreetingStyle = 'short' | 'official' | 'funny';
export type GreetingRecipient = 'friend' | 'girlfriend' | 'family' | 'colleague';

type GreetingsData = Record<GreetingRecipient, Record<GreetingStyle, string[]>>;

const GREETINGS: GreetingsData = require('../data/greetings.json');

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Returns a random greeting for the given style, recipient and name. */
export function getRandomGreeting(
  style: GreetingStyle,
  recipient: GreetingRecipient,
  name: string
): string {
  const list = GREETINGS[recipient]?.[style];
  if (!list || !list.length) return '';
  const template = pickRandom(list);
  return template.replace(/\{name\}/g, (name || '').trim() || 'друже');
}

/** Legacy: single template per category (fallback). */
export function getGreetingText(
  style: GreetingStyle,
  recipient: GreetingRecipient,
  name: string
): string {
  return getRandomGreeting(style, recipient, name);
}
