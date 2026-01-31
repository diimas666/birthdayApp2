import { Birthday, BirthdayWithAge } from '../types';

export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getNextBirthday = (dateOfBirth: Date): Date => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const birthDate = new Date(dateOfBirth);
  
  let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  
  if (nextBirthday < today) {
    nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
  }
  
  return nextBirthday;
};

export const getDaysUntil = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const enrichBirthday = (birthday: Birthday): BirthdayWithAge => {
  const nextBirthday = getNextBirthday(birthday.dateOfBirth);
  const age = calculateAge(birthday.dateOfBirth);
  const daysUntil = getDaysUntil(nextBirthday);
  
  return {
    ...birthday,
    age,
    nextBirthday,
    daysUntil,
  };
};

export const getUpcomingBirthdays = (birthdays: Birthday[], days: number = 7): BirthdayWithAge[] => {
  const enriched = birthdays.map(enrichBirthday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return enriched
    .filter(b => {
      const nextBday = new Date(b.nextBirthday);
      nextBday.setHours(0, 0, 0, 0);
      const diffTime = nextBday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= days;
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
};

export const getBirthdaysByFilter = (
  birthdays: Birthday[],
  filter: 'today' | 'week' | 'month' | 'year'
): BirthdayWithAge[] => {
  const enriched = birthdays.map(enrichBirthday);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let maxDays = 0;
  switch (filter) {
    case 'today':
      maxDays = 0;
      break;
    case 'week':
      maxDays = 7;
      break;
    case 'month':
      maxDays = 30;
      break;
    case 'year':
      maxDays = 365;
      break;
  }
  
  return enriched
    .filter(b => {
      const nextBday = new Date(b.nextBirthday);
      nextBday.setHours(0, 0, 0, 0);
      const diffTime = nextBday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= maxDays;
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
};

export const getTodaysBirthdays = (birthdays: Birthday[]): BirthdayWithAge[] => {
  const enriched = birthdays.map(enrichBirthday);
  return enriched.filter(b => b.daysUntil === 0);
};

/** Count birthdays that fall in the given calendar month (by birth month). */
export const getBirthdaysInMonth = (birthdays: Birthday[], month: number): number => {
  return birthdays.filter(b => new Date(b.dateOfBirth).getMonth() === month).length;
};

/** Quarter 1 = Jan–Mar, 2 = Apr–Jun, 3 = Jul–Sep, 4 = Oct–Dec. */
export const getBirthdaysInQuarter = (birthdays: Birthday[], quarter: 1 | 2 | 3 | 4): number => {
  const startMonth = (quarter - 1) * 3;
  return birthdays.filter(b => {
    const m = new Date(b.dateOfBirth).getMonth();
    return m >= startMonth && m < startMonth + 3;
  }).length;
};

/** Birthdays that fall on the given month and day (any year). */
export const getBirthdaysOnDate = (birthdays: Birthday[], month: number, day: number): Birthday[] => {
  return birthdays.filter(b => {
    const d = new Date(b.dateOfBirth);
    return d.getMonth() === month && d.getDate() === day;
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('uk-UA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('uk-UA', {
    month: 'short',
    day: 'numeric',
  });
};
