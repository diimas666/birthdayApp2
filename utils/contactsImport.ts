import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import { Birthday } from '../types';
import { getBirthdays, saveBirthday, updateBirthday } from './storage';
import { getImportOnlyWithBirthday, getImportUpdateChanges } from './settingsStorage';

export type ImportFromContactsResult = {
  added: number;
  updated: number;
  skipped: number;
  totalWithBirthday: number;
  error?: string;
};

/** Normalize phone for matching: digits only, no leading + */
function normalizePhone(phone: string | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '').replace(/^0+/, '') || '';
}

/** Contact birthday: iOS has year/month/day (month 1–12), Android may use 0–11 */
function getBirthdayFromContact(contact: { birthday?: { year?: number; month?: number; day?: number } }): Date | null {
  const b = contact.birthday;
  if (!b || b.month == null || b.day == null) return null;
  const year = b.year ?? 2000;
  const rawMonth = b.month;
  const month = rawMonth > 0 && rawMonth <= 12 ? rawMonth - 1 : rawMonth;
  const day = Math.min(Math.max(1, b.day), new Date(year, month + 1, 0).getDate());
  const d = new Date(year, month, day);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function getContactName(contact: { givenName?: string; familyName?: string; displayName?: string }): string {
  const first = (contact.givenName ?? '').trim();
  const last = (contact.familyName ?? '').trim();
  if (first || last) return [first, last].filter(Boolean).join(' ');
  return (contact.displayName ?? '').trim() || '?';
}

function getFirstPhone(contact: { phoneNumbers?: { number?: string }[] }): string | undefined {
  const numbers = contact.phoneNumbers;
  if (!numbers || numbers.length === 0) return undefined;
  return numbers[0]?.number?.trim();
}

export type ContactsPermissionRationale = {
  title: string;
  message: string;
  buttonPositive: string;
};

const DEFAULT_RATIONALE: ContactsPermissionRationale = {
  title: 'Contacts',
  message: 'App needs access to contacts to import birthdays.',
  buttonPositive: 'OK',
};

export async function requestContactsPermission(
  rationale?: ContactsPermissionRationale
): Promise<boolean> {
  if (Platform.OS === 'android') {
    const r = rationale ?? DEFAULT_RATIONALE;
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      { title: r.title, message: r.message, buttonPositive: r.buttonPositive }
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const perm = await Contacts.checkPermission();
  if (perm === 'authorized') return true;
  const requested = await Contacts.requestPermission();
  return requested === 'authorized';
}

export async function importFromContacts(options?: {
  permissionRationale?: ContactsPermissionRationale;
}): Promise<ImportFromContactsResult> {
  const hasPermission = await requestContactsPermission(options?.permissionRationale);
  if (!hasPermission) {
    return { added: 0, updated: 0, skipped: 0, totalWithBirthday: 0, error: 'Permission denied' };
  }

  try {
    const onlyWithBirthday = await getImportOnlyWithBirthday();
    const updateChanges = await getImportUpdateChanges();
    const existing = await getBirthdays();

    const byPhone = new Map<string, Birthday>();
    const byNameAndDate = new Map<string, Birthday>();
    for (const b of existing) {
      const phone = normalizePhone(b.phone);
      if (phone) byPhone.set(phone, b);
      const key = `${(b.name || '').toLowerCase().trim()}-${new Date(b.dateOfBirth).getTime()}`;
      byNameAndDate.set(key, b);
    }

    let added = 0;
    let updated = 0;
    let skipped = 0;
    let totalWithBirthday = 0;

    const contacts = await Contacts.getAll();
  for (const contact of contacts) {
    const dateOfBirth = getBirthdayFromContact(contact);
    if (onlyWithBirthday && !dateOfBirth) continue;
    if (!dateOfBirth) continue;
    totalWithBirthday++;
    const name = getContactName(contact);
    if (!name || name === '?') {
      skipped++;
      continue;
    }
    const phone = getFirstPhone(contact);
    const phoneNorm = normalizePhone(phone);
    const keyNameDate = `${name.toLowerCase().trim()}-${dateOfBirth.getTime()}`;

    const matchByPhone = phoneNorm ? byPhone.get(phoneNorm) : undefined;
    const matchByNameDate = byNameAndDate.get(keyNameDate);

    if (matchByPhone) {
      if (updateChanges) {
        await updateBirthday(matchByPhone.id, {
          name: name || matchByPhone.name,
          dateOfBirth,
          phone: phone ?? matchByPhone.phone,
        });
        updated++;
      } else {
        skipped++;
      }
      continue;
    }
    if (matchByNameDate) {
      if (updateChanges && (matchByNameDate.phone !== phone || matchByNameDate.name !== name)) {
        await updateBirthday(matchByNameDate.id, {
          name: name || matchByNameDate.name,
          dateOfBirth,
          phone: phone ?? matchByNameDate.phone,
        });
        updated++;
      } else {
        skipped++;
      }
      continue;
    }

    const newBirthday: Birthday = {
      id: Date.now().toString() + '-' + Math.random().toString(36).slice(2),
      name,
      dateOfBirth,
      phone,
      createdAt: new Date(),
    };
    await saveBirthday(newBirthday);
    added++;
    if (phoneNorm) byPhone.set(phoneNorm, newBirthday);
    byNameAndDate.set(keyNameDate, newBirthday);
  }

    return { added, updated, skipped, totalWithBirthday };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { added: 0, updated: 0, skipped: 0, totalWithBirthday: 0, error: message };
  }
}
