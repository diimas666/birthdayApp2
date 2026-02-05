# Віджет на головний екран (iOS)

У проєкті додано **Widget Extension** для iPhone (WidgetKit). Віджет показує, хто святкує день народження сьогодні.

## Що зроблено

- **App Group** `group.com.birthdayapp1.widget` — спільне сховище між додатком і віджетом.
- **Основний додаток** при запуску та при поверненні у foreground записує в це сховище список імен та рядки заголовка/порожнього стану (через нативний модуль `BirthdayWidget`) і викликає оновлення віджета.
- **Віджет** (таргет `BirthdayWidgetExtension`) читає ці дані з UserDefaults і показує їх у виджетах малого та середнього розміру.

## Як зібрати

1. Відкрийте `ios/BirthdayApp.xcworkspace` у Xcode.
2. Увімкніть **App Groups** для обох таргетів (якщо ще не увімкнено):
   - **BirthdayApp** → Signing & Capabilities → App Groups → `group.com.birthdayapp1.widget`
   - **BirthdayWidgetExtension** → Signing & Capabilities → App Groups → `group.com.birthdayapp1.widget`
3. Зберіть проєкт (⌘B) і запустіть на пристрої або симуляторі (⌘R).
4. На домашньому екрані: довге натискання → «Редагувати домашній екран» → «+» → знайдіть **Birthday Reminder** / **Birthdays Today** і додайте віджет.

## Розміри

Підтримуються **малий** (systemSmall) та **середній** (systemMedium) віджети.
