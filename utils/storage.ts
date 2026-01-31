import AsyncStorage from '@react-native-async-storage/async-storage';
import { Birthday } from '../types';

const STORAGE_KEY = '@birthday_app:birthdays';

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
