import * as Notifications from 'expo-notifications';
import { Birthday } from '../types';
import { uk } from '../locales/uk';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleBirthdayNotifications = async (birthday: Birthday): Promise<void> => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:26',message:'scheduleBirthdayNotifications called',data:{birthdayId:birthday.id,name:birthday.name},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const hasPermission = await requestPermissions();
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:30',message:'Permission check result',data:{hasPermission},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (!hasPermission) {
    console.warn('Notification permissions not granted');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:34',message:'Permissions not granted',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return;
  }

  const today = new Date();
  const thisYear = today.getFullYear();
  const birthDate = new Date(birthday.dateOfBirth);
  
  // Calculate next birthday
  let nextBirthday = new Date(thisYear, birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday = new Date(thisYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  // Cancel existing notifications for this birthday
  await cancelBirthdayNotifications(birthday.id);

  // Schedule 3 days before notification
  const threeDaysBefore = new Date(nextBirthday);
  threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
  
  if (threeDaysBefore > today) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: uk.notificationTitle3Days,
        body: uk.notificationBody3Days(birthday.name),
        data: { birthdayId: birthday.id, type: '3days' },
        sound: true,
      },
      trigger: {
        date: threeDaysBefore,
        repeats: true,
      },
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:51',message:'3 days notification scheduled',data:{notificationId,date:threeDaysBefore.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  // Schedule 1 day before notification
  const oneDayBefore = new Date(nextBirthday);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);
  
  if (oneDayBefore > today) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: uk.notificationTitle1Day,
        body: uk.notificationBody1Day(birthday.name),
        data: { birthdayId: birthday.id, type: '1day' },
        sound: true,
      },
      trigger: {
        date: oneDayBefore,
        repeats: true,
      },
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:70',message:'1 day notification scheduled',data:{notificationId,date:oneDayBefore.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  // Schedule birthday day notification
  if (nextBirthday > today) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: uk.notificationTitleToday,
        body: uk.notificationBodyToday(birthday.name),
        data: { birthdayId: birthday.id, type: 'today' },
        sound: true,
      },
      trigger: {
        date: nextBirthday,
        repeats: true,
      },
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:86',message:'Today notification scheduled',data:{notificationId,date:nextBirthday.toISOString()},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/39cc564e-1ea3-4134-aca0-8d38cd752fc5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notifications.ts:99',message:'All notifications scheduled',data:{birthdayId:birthday.id},timestamp:Date.now(),sessionId:'debug-session',runId:'notifications-check',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
};

export const cancelBirthdayNotifications = async (birthdayId: string): Promise<void> => {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = notifications.filter(
    n => n.content.data?.birthdayId === birthdayId
  );
  
  for (const notification of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
};

export const rescheduleAllNotifications = async (birthdays: Birthday[]): Promise<void> => {
  // Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Reschedule for all birthdays
  for (const birthday of birthdays) {
    await scheduleBirthdayNotifications(birthday);
  }
};
