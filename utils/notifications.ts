import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Platform } from 'react-native';
import { Birthday } from '../types';
import { uk } from '../locales/uk';
import { getNotificationHour, getQuietHoursFrom, getQuietHoursTo } from './settingsStorage';

const ANDROID_CHANNEL_ID = 'birthday-reminders';

/** Returns an hour that falls outside quiet time (e.g. 22–8 → use 8 if hour is in 22,23,0..7). */
function getAllowedHour(hour: number, quietFrom: number, quietTo: number): number {
  if (quietFrom <= quietTo) {
    if (hour >= quietFrom && hour < quietTo) return quietTo;
    return hour;
  }
  if (hour >= quietFrom || hour < quietTo) return quietTo;
  return hour;
}

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: 'Дні народження',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
};

export const scheduleBirthdayNotifications = async (birthday: Birthday, hour?: number): Promise<void> => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.warn('Notification permissions not granted');
    return;
  }

  const preferredHour = hour ?? await getNotificationHour();
  const [quietFrom, quietTo] = await Promise.all([getQuietHoursFrom(), getQuietHoursTo()]);
  const notificationHour = getAllowedHour(preferredHour, quietFrom, quietTo);

  const today = new Date();
  const thisYear = today.getFullYear();
  const birthDate = new Date(birthday.dateOfBirth);

  let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  await cancelBirthdayNotifications(birthday.id);

  const baseNotification = {
    title: uk.notificationTitleToday,
    body: uk.notificationBodyToday(birthday.name),
    data: { birthdayId: birthday.id },
    android: {
      channelId: ANDROID_CHANNEL_ID,
      smallIcon: 'ic_launcher',
    },
  };

  const threeDaysBefore = new Date(nextBirthday);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
  threeDaysBefore.setHours(notificationHour, 0, 0, 0);
  if (threeDaysBefore > today) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: threeDaysBefore.getTime(),
    };
    await notifee.createTriggerNotification(
      {
        ...baseNotification,
        title: uk.notificationTitle3Days,
        body: uk.notificationBody3Days(birthday.name),
        id: `birthday-${birthday.id}-3d`,
      },
      trigger
    );
  }

  const oneDayBefore = new Date(nextBirthday);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  oneDayBefore.setHours(notificationHour, 0, 0, 0);
  if (oneDayBefore > today) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: oneDayBefore.getTime(),
    };
    await notifee.createTriggerNotification(
      {
        ...baseNotification,
        title: uk.notificationTitle1Day,
        body: uk.notificationBody1Day(birthday.name),
        id: `birthday-${birthday.id}-1d`,
      },
      trigger
    );
  }

  const dayOf = new Date(nextBirthday);
  dayOf.setHours(notificationHour, 0, 0, 0);
  if (dayOf > today) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: dayOf.getTime(),
    };
    await notifee.createTriggerNotification(
      {
        ...baseNotification,
        id: `birthday-${birthday.id}-today`,
      },
      trigger
    );
  }
};

export const cancelBirthdayNotifications = async (birthdayId: string): Promise<void> => {
  const ids = [
    `birthday-${birthdayId}-3d`,
    `birthday-${birthdayId}-1d`,
    `birthday-${birthdayId}-today`,
  ];
  for (const id of ids) {
    await notifee.cancelTriggerNotification(id);
  }
};

export const rescheduleAllNotifications = async (birthdays: Birthday[], hour?: number): Promise<void> => {
  await notifee.cancelTriggerNotifications();
  const h = hour ?? await getNotificationHour();
  for (const birthday of birthdays) {
    await scheduleBirthdayNotifications(birthday, h);
  }
};
