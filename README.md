# Birthday Reminder App 🎉

Мобильное приложение на **React Native 0.78** (CLI, новая архитектура) для напоминаний о днях рождения с локальными уведомлениями.

## Стек

- **React Native 0.78** (CLI, New Architecture)
- **React 19**
- **TypeScript**
- **@notifee/react-native** — локальные уведомления
- **React Navigation** — навигация
- **react-native-gesture-handler** — свайпы
- **react-native-reanimated** — анимации
- **react-native-haptic-feedback** — тактильная отдача

## Запуск (Android и iOS)

### 1. Установка зависимостей (обязательно перед `pod install`)

Без установленных зависимостей команда `pod install` в папке `ios` выдаст ошибку вида: _"Cannot find module '@react-native-community/cli'"_. Сначала установи пакеты:

```bash
npm install
# или
yarn install
```

Убедись, что в `node_modules/@react-native-community/` есть папки `cli` и `cli-platform-ios`.

### 2. Нативные папки ios и android

Если папок `ios` и `android` нет или сборка падает, создайте новый проект и скопируйте нативные папки:

```bash
cd ..
npx @react-native-community/cli@latest init BirthdayApp --version 0.78.0 --skip-git-init
cp -R BirthdayApp/ios birthdayApp2/
cp -R BirthdayApp/android birthdayApp2/
# Удалите временный проект: rm -rf BirthdayApp
```

В `ios/Podfile` и в Xcode-проекте убедитесь, что имя таргета и бандл-ид совпадают с вашим приложением (например, `BirthdayApp`, `com.birthdayapp`).

### 3. iOS

**Важно:** всегда открывай **`ios/BirthdayApp.xcworkspace`** (не `BirthdayApp.xcodeproj`). Иначе появится ошибка **"Library 'DoubleConversion' not found"** — линкер не видит Pods. В селекторе схем выбери **BirthdayApp** (не Tests и не другой таргет).

Если в логе Xcode видишь **"BirthdayReminder"** или **".dylib"** — ты собрал другой проект или схему. Открой именно этот репозиторий: `birthdayApp2/ios/BirthdayApp.xcworkspace`, схема **BirthdayApp**.

Если при `pod install` появляется **"Could not automatically select an Xcode project"**, в папке `ios` нет файла `BirthdayApp.xcodeproj`. Скопируй полную папку `ios` из нового проекта (см. шаг 2), включая `BirthdayApp.xcodeproj`.

```bash
cd ios
pod install
cd ..
# Открой в Xcode: open ios/BirthdayApp.xcworkspace
npm run ios
```

**Если при сборке iOS падают ошибки RNScreens** (типы вроде `RNSBottomTabsScreen`, `RNSSplitViewHost` в namespace `facebook::react`):

1. В проекте зафиксирована версия **react-native-screens 4.10.0** (совместима со старой архитектурой).
2. Выполни у себя: `npm install` (если была ошибка кэша npm: `sudo chown -R $(whoami) ~/.npm`).
3. Полная переустановка подов и очистка кэша Xcode:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock build
   pod install
   ```
   Очисти кэш Xcode: удали папку `~/Library/Developer/Xcode/DerivedData/BirthdayApp-*` или в Xcode: **Product → Clean Build Folder** (⇧⌘K).
4. Собери снова из **BirthdayApp.xcworkspace**, схема **BirthdayApp**.

### 4. Android

```bash
npm run android
```

Для первой сборки Android нужен Gradle Wrapper. Если в `android/` нет `gradlew`, выполните в корне:

```bash
npx @react-native-community/cli init TempApp --version 0.78.0 --skip-git-init
cp TempApp/android/gradlew birthdayApp2/android/
cp TempApp/android/gradlew.bat birthdayApp2/android/
cp -R TempApp/android/gradle birthdayApp2/android/
# при необходимости скопируйте остальные файлы из TempApp/android
```

### 5. Metro

```bash
npm start
```

В другом терминале: `npm run ios` или `npm run android`.

## Структура проекта

```
birthdayApp2/
├── App.tsx
├── index.js              # Точка входа (React Native CLI)
├── app.json              # name, displayName для CLI
├── metro.config.js
├── babel.config.js
├── components/
├── screens/
├── hooks/
├── locales/
├── types/
├── utils/
├── ios/                  # Нативный iOS-проект
└── android/              # Нативный Android-проект
```

## Уведомления

- Используется **@notifee/react-native** (вместо Expo Notifications).
- Напоминания: за 3 дня, за 1 день и в день рождения.
- При запуске приложения все уведомления пересоздаются по текущему списку дней рождения.

## Разрешения

- **Android**: INTERNET, RECEIVE_BOOT_COMPLETED, VIBRATE, POST_NOTIFICATIONS.
- **iOS**: запрос разрешения на уведомления при первом запуске.

## Заметки

- Для стабильной сборки Android/iOS предпочтительно один раз сгенерировать проект через `npx @react-native-community/cli init ...` и скопировать папки `ios` и `android` в этот репозиторий.
- Если в npm возникают ошибки кэша, выполните: `sudo chown -R $(whoami) ~/.npm` (macOS/Linux).
