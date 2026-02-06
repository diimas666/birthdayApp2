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
      hideYear: item.hideYear,
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

/** Обернути значення в CSV-поле з екрануванням, якщо потрібно. */
function toCsvField(value: string): string {
  const needsQuotes =
    value.includes(CSV_SEP) || value.includes('"') || /\r|\n/.test(value);
  let v = value;
  if (v.includes('"')) {
    v = v.replace(/"/g, '""');
  }
  return needsQuotes ? `"${v}"` : v;
}

/** Простий CSV-парсер з підтримкою лапок і переносів рядка. */
function parseCsvRecords(csv: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];

    if (ch === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        // Екранована лапка
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === CSV_SEP && !inQuotes) {
      record.push(field.trim());
      field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // Кінець рядка
      if (ch === '\r' && csv[i + 1] === '\n') {
        i++;
      }
      record.push(field.trim());
      field = '';
      // Ігноруємо повністю порожні рядки
      if (record.some((v) => v.length > 0)) {
        records.push(record);
      }
      record = [];
    } else {
      field += ch;
    }
  }

  // Останній рядок
  if (field.length > 0 || record.length > 0) {
    record.push(field.trim());
    if (record.some((v) => v.length > 0)) {
      records.push(record);
    }
  }

  return records;
}

/** Експорт ДН у CSV (краще працює з переносами рядків / спецсимволами). */
export const exportBirthdaysCsv = async (): Promise<string> => {
  const birthdays = await getBirthdays();
  const rows: string[] = [];
  rows.push(CSV_HEADER);

  for (const b of birthdays) {
    const d = new Date(b.dateOfBirth);
    const dateStr = d.toISOString().slice(0, 10);
    const name = (b.name || '').trim();
    const phone = (b.phone || '').trim();
    const note = (b.note || '').trim();
    const tags = (b.tags || []).join(','); // Теги як раніше

    const fields = [name, dateStr, phone, note, tags].map(toCsvField);
    rows.push(fields.join(CSV_SEP));
  }

  return rows.join('\n');
};

/** Імпорт з CSV (семіколон, з підтримкою лапок). Повертає { imported, total }. */
export const importBirthdaysFromCsv = async (
  csvString: string,
): Promise<{ imported: number; total: number }> => {
  const trimmed = csvString.trim();
  if (!trimmed) {
    throw new Error('Порожній CSV');
  }

  const records = parseCsvRecords(trimmed);
  if (records.length < 1) {
    throw new Error('CSV має містити заголовок (Ім\'я;Дата;...)');
  }

  const headerRow = records[0];
  const header = headerRow.join(CSV_SEP).toLowerCase();
  if (!header.includes('дата')) {
    throw new Error(
      'Невірний формат CSV: очікується заголовок Ім\'я;Дата;Телефон;Примітка;Теги',
    );
  }

  const existing = await getBirthdays();
  const existingKeys = new Set(
    existing.map(
      (b) => `${b.name}-${new Date(b.dateOfBirth).getTime()}`,
    ),
  );

  let imported = 0;

  for (let i = 1; i < records.length; i++) {
    const parts = records[i];
    const name = (parts[0] || '').trim();
    const dateStr = (parts[1] || '').trim();
    if (!name || !dateStr) continue;

    let dateOfBirth: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      dateOfBirth = new Date(`${dateStr}T12:00:00Z`);
    } else if (/^\d{1,2}\.\d{1,2}\.\d{2,4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('.');
      const year =
        y.length === 2 ? 2000 + parseInt(y, 10) : parseInt(y, 10);
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
    const tags = tagsStr
      ? tagsStr
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    const birthday: Birthday = {
      id: `${Date.now().toString()}-${i}`,
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
