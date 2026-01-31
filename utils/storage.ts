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
