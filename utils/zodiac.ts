/**
 * Тропічний зодіак за датою народження (місяць/день).
 * Ключі для локалізації: zodiac_<id>, zodiacFact_<id>.
 */
export type ZodiacId =
  | 'capricorn'
  | 'aquarius'
  | 'pisces'
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius';

export interface ZodiacSign {
  id: ZodiacId;
  symbol: string;
}

const SYMBOLS: Record<ZodiacId, string> = {
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
};

/** Початок кожного знака (місяць 0–11). Козеріг: 22.12–19.01 — окремо. */
const SIGN_STARTS: { month: number; day: number; id: ZodiacId }[] = [
  { month: 0, day: 20, id: 'aquarius' },   // 20 січня
  { month: 1, day: 19, id: 'pisces' },
  { month: 2, day: 21, id: 'aries' },
  { month: 3, day: 20, id: 'taurus' },
  { month: 4, day: 21, id: 'gemini' },
  { month: 5, day: 21, id: 'cancer' },
  { month: 6, day: 23, id: 'leo' },
  { month: 7, day: 23, id: 'virgo' },
  { month: 8, day: 23, id: 'libra' },
  { month: 9, day: 23, id: 'scorpio' },
  { month: 10, day: 22, id: 'sagittarius' },
  { month: 11, day: 22, id: 'capricorn' },  // 22 грудня
];

function dateOrd(m: number, d: number): number {
  return m * 31 + d;
}

/**
 * Повертає знак зодіаку за датою народження (день і місяць).
 */
export function getZodiacSign(date: Date): ZodiacSign {
  const month = date.getMonth();
  const day = date.getDate();
  const ord = dateOrd(month, day);

  // 1 січня – 19 січня = Козеріг (після 22 грудня)
  if (month === 0 && day < 20) {
    return { id: 'capricorn', symbol: SYMBOLS.capricorn };
  }

  let lastId: ZodiacId = 'capricorn';
  for (const { month: m, day: d, id } of SIGN_STARTS) {
    if (dateOrd(m, d) <= ord) lastId = id;
  }
  return { id: lastId, symbol: SYMBOLS[lastId] };
}
