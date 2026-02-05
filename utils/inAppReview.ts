import { Alert } from "react-native";
import InAppReview from "react-native-in-app-review";
import {
  getLaunchCount,
  getReviewPromptDone,
  setReviewPromptDone,
} from "./settingsStorage";
import { getBirthdays } from "./storage";

const MIN_LAUNCHES = 2;
const MIN_BIRTHDAYS = 3;
const PROMPT_DELAY_MS = 2500;

const isAvailable = (): boolean => {
  return InAppReview.isAvailable();
};

/**
 * Показує діалог «Подобається застосунок? Поставте оцінку» і при натисканні
 * «Поставити оцінку» відкриває нативний діалог оцінки (Store).
 * Викликати тільки якщо tryShowReviewPrompt() повернув true.
 */
export function showReviewDialog(
  title: string,
  message: string,
  rateLabel: string,
  laterLabel: string,
): void {
  Alert.alert(title, message, [
    { text: laterLabel, style: "cancel", onPress: () => setReviewPromptDone() },
    {
      text: rateLabel,
      onPress: async () => {
        setReviewPromptDone();
        try {
          if (isAvailable()) {
            await InAppReview.RequestInAppReview();
          }
        } catch (_) {
          // Ігноруємо помилки (користувач закрив діалог, Store недоступний тощо)
        }
      },
    },
  ]);
}

/**
 * Перевіряє, чи треба показати запит оцінки: не показували раніше,
 * і (кількість запусків >= 2 або кількість днів народження >= 3).
 */
export async function shouldShowReviewPrompt(): Promise<boolean> {
  const [done, launchCount] = await Promise.all([
    getReviewPromptDone(),
    getLaunchCount(),
  ]);
  if (done) return false;
  if (launchCount >= MIN_LAUNCHES) return true;
  const birthdays = await getBirthdays();
  return birthdays.length >= MIN_BIRTHDAYS;
}

/**
 * Запускає перевірку з затримкою; якщо умови виконані — показує діалог.
 * Викликати один раз після монтування головного екрану (наприклад у App).
 */
export function scheduleReviewPrompt(
  getStrings: () => {
    title: string;
    message: string;
    rate: string;
    later: string;
  },
): void {
  setTimeout(async () => {
    try {
      const ok = await shouldShowReviewPrompt();
      if (ok) {
        const { title, message, rate, later } = getStrings();
        showReviewDialog(title, message, rate, later);
      }
    } catch (_) {
      // не показуємо нічого при помилці
    }
  }, PROMPT_DELAY_MS);
}
