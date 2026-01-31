import AsyncStorage from '@react-native-async-storage/async-storage';
import { Birthday } from '../types';

const STORAGE_KEY = '@birthday_app:birthdays';

export type BirthdayExport = Omit<Birthday, 'dateOfBirth' | 'createdAt'> & {
  dateOfBirth: string;
  createdAt: string;
};

export const saveBirthday = async (birthday: Birthday): Promise<void> => {
  try {
    const birthdays = await getBirthdays();
    const updated = [...birthdays, birthday];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving birthday:', error);
    throw error;
  }
};

export const getBirthdays = async (): Promise<Birthday[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const birthdays = JSON.parse(data);
    // Convert date strings back to Date objects
    return birthdays.map((b: any) => ({
      ...b,
      dateOfBirth: new Date(b.dateOfBirth),
      createdAt: new Date(b.createdAt),
    }));
  } catch (error) {
    console.error('Error getting birthdays:', error);
    return [];
  }
};

export const updateBirthday = async (id: string, updates: Partial<Birthday>): Promise<void> => {
  try {
    const birthdays = await getBirthdays();
    const updated = birthdays.map(b => 
      b.id === id ? { ...b, ...updates } : b
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating birthday:', error);
    throw error;
  }
};

export const deleteBirthday = async (id: string): Promise<void> => {
  try {
    const birthdays = await getBirthdays();
    const updated = birthdays.filter(b => b.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting birthday:', error);
    throw error;
  }
};

export const exportBirthdaysJson = async (): Promise<string> => {
  const birthdays = await getBirthdays();
  const exportData = birthdays.map(b => ({
    ...b,
    dateOfBirth: b.dateOfBirth.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));
  return JSON.stringify(exportData, null, 2);
};

export const importBirthdaysFromJson = async (jsonString: string): Promise<{ imported: number; total: number }> => {
  const parsed = JSON.parse(jsonString) as BirthdayExport[];
  if (!Array.isArray(parsed)) throw new Error('Invalid format');
  const existing = await getBirthdays();
  const existingKeys = new Set(existing.map(b => `${b.name}-${new Date(b.dateOfBirth).getTime()}`));
  let imported = 0;
  for (const item of parsed) {
    const dateOfBirth = new Date(item.dateOfBirth);
    const createdAt = item.createdAt ? new Date(item.createdAt) : new Date();
    const key = `${item.name}-${dateOfBirth.getTime()}`;
    if (existingKeys.has(key)) continue;
    const birthday: Birthday = {
      id: item.id || Date.now().toString() + Math.random(),
      name: item.name,
      dateOfBirth,
      note: item.note,
      phone: item.phone,
      photoUri: item.photoUri,
      tags: item.tags,
      createdAt,
    };
    existing.push(birthday);
    existingKeys.add(key);
    imported++;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return { imported, total: existing.length };
};

const CSV_SEP = ';';
const CSV_HEADER = 'Ім\'я;Дата;Телефон;Примітка;Теги';

/** Export birthdays as CSV (semicolon-separated). Date = ISO YYYY-MM-DD. */
export const exportBirthdaysCsv = async (): Promise<string> => {
  const birthdays = await getBirthdays();
  const rows = [CSV_HEADER];
  for (const b of birthdays) {
    const d = new Date(b.dateOfBirth);
    const dateStr = d.toISOString().slice(0, 10);
    const name = (b.name || '').replace(/;/g, ',').trim();
    const phone = (b.phone || '').replace(/;/g, ',').trim();
    const note = (b.note || '').replace(/;/g, ',').trim();
    const tags = (b.tags || []).join(',');
    rows.push([name, dateStr, phone, note, tags].join(CSV_SEP));
  }
  return rows.join('\n');
};

/** Split CSV line by separator (fields don't contain separator in our export). */
function parseCsvLine(line: string): string[] {
  return line.split(CSV_SEP).map((s) => s.trim());
}

/** Import from CSV (same format as export). Returns { imported, total }. */
export const importBirthdaysFromCsv = async (csvString: string): Promise<{ imported: number; total: number }> => {
  const lines = csvString.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 1) throw new Error('CSV має містити заголовок (Ім\'я;Дата;...)');
  const header = lines[0].toLowerCase();
  if (!header.includes('дата')) throw new Error('Невірний формат CSV: очікується заголовок Ім\'я;Дата;Телефон;Примітка;Теги');
  const existing = await getBirthdays();
  const existingKeys = new Set(existing.map(b => `${b.name}-${new Date(b.dateOfBirth).getTime()}`));
  let imported = 0;
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCsvLine(lines[i]);
    const name = (parts[0] || '').trim();
    const dateStr = (parts[1] || '').trim();
    if (!name || !dateStr) continue;
    let dateOfBirth: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      dateOfBirth = new Date(dateStr + 'T12:00:00Z');
    } else if (/^\d{1,2}\.\d{1,2}\.\d{2,4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('.');
      const year = y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
      dateOfBirth = new Date(year, parseInt(m, 10) - 1, parseInt(d, 10));
    } else {
      dateOfBirth = new Date(dateStr);
    }
    if (Number.isNaN(dateOfBirth.getTime())) continue;
    const key = `${name}-${dateOfBirth.getTime()}`;
    if (existingKeys.has(key)) continue;
    const phone = (parts[2] || '').trim() || undefined;
    const note = (parts[3] || '').trim() || undefined;
    const tagsStr = (parts[4] || '').trim();
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : undefined;
    const birthday: Birthday = {
      id: Date.now().toString() + '-' + i,
      name,
      dateOfBirth,
      note,
      phone,
      tags,
      createdAt: new Date(),
    };
    existing.push(birthday);
    existingKeys.add(key);
    imported++;
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return { imported, total: existing.length };
};
