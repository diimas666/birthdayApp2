export interface Birthday {
  id: string;
  name: string;
  dateOfBirth: Date;
  /** Якщо true — рік народження невідомий, вік не показуємо. dateOfBirth зберігається з year=2000 (лише день+місяць мають значення). */
  hideYear?: boolean;
  note?: string;
  phone?: string;
  photoUri?: string;
  tags?: string[];
  isImportant?: boolean;
  /** Позначка «Привітав»: якщо задано (ISO-дата), картка зелёная з галочкою. */
  greetedAt?: string;
  createdAt: Date;
}

export interface BirthdayWithAge extends Birthday {
  age: number;
  nextBirthday: Date;
  daysUntil: number;
}
