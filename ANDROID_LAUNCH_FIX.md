# Android Launch Fix — Birthday Reminder

## Root causes (ranked, with evidence)

### 1. **UnsatisfiedLinkError: libreact_featureflagsjni.so not found** (primary)
- **Evidence:** Crash at `ReactNativeFeatureFlagsCxxInterop.<clinit>` → `SoLoader.loadLibrary("react_featureflagsjni")`. In RN 0.77+, this library is **merged** into `libreactnative.so`; SoLoader must load the merged lib first so the mapping is registered.
- **Fix:** In `MainApplication.kt`, call `SoLoader.loadLibrary("reactnative")` right after `SoLoader.init()`, before `DefaultNewArchitectureEntryPoint.load()` or any code that touches `ReactNativeFeatureFlags`.

### 2. **react-native-reanimated 3.10.x incompatible with RN 0.77**
- **Evidence:** Reanimated 3.10 supports RN 0.71–0.73 only; RN 0.77 requires at least 3.16.7 (per official compatibility table).
- **Fix:** Bump `react-native-reanimated` to `~3.16.7` in `package.json`.

### 3. **@react-native/* 0.78.0 with react-native 0.77.0**
- **Evidence:** Version mismatch can cause build/runtime inconsistencies (Babel, Metro, types).
- **Fix:** Align devDependencies to `@react-native/*` 0.77.0.

### 4. **Trailing comma in package.json**
- **Evidence:** `npm install` failed with `EJSONPARSE` at "react-native-webview" line.
- **Fix:** Remove trailing comma after last dependency.

---

## Exact code changes

### 1. `android/app/src/main/java/com/birthdayapp/MainApplication.kt`
```diff
     override fun onCreate() {
         super.onCreate()
         SoLoader.init(this, false)
+        // Load merged RN lib first so OpenSourceMergedSoMapping is registered (fixes libreact_featureflagsjni.so not found)
+        SoLoader.loadLibrary("reactnative")
         if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
             load()
         }
     }
```

### 2. `package.json`
- Remove trailing comma after `"react-native-webview": "^13.12.2"`.
- `"react-native-reanimated": "^3.10.0"` → `"react-native-reanimated": "~3.16.7"`.
- `"@react-native/babel-preset": "0.78.0"` → `"0.77.0"` (same for eslint-config, metro-config, typescript-config).

---

## Commands to clean / build / install

```bash
# 1. Update dependencies
cd /Users/restart/Desktop/birthdayApp2
npm install

# 2. Clean Android
cd android
./gradlew clean

# 3. Build debug APK
./gradlew assembleDebug

# 4. Run on device/emulator (Metro must be running in another terminal)
cd ..
npx react-native run-android
```

If you use **yarn**:
```bash
yarn install
cd android && ./gradlew clean && ./gradlew assembleDebug
cd .. && npx react-native run-android
```

---

## Obtaining crash logs (if app still crashes)

**1. Лог в файле приложения (после краша):**

Приложение пишет стек в `files/crash_log.txt`. Получить его (эмулятор или устройство с отладкой):

```bash
adb run-as com.birthdayapp cat files/crash_log.txt
```

**2. logcat:**

Если `npx react-native log-android` зависает:

```bash
# После запуска и краша приложения:
adb logcat -d | tail -n 500 > logcat.txt
# Или только ошибки и ваш пакет:
adb logcat -d *:E | grep -E "FATAL|AndroidRuntime|com.birthdayapp" | tail -n 200
```

---

## Verification checklist

- [ ] **Identifiers:** `app.json` name = `BirthdayApp`; `MainActivity.getMainComponentName()` = `"BirthdayApp"`; `AppRegistry.registerComponent(appName, …)` uses `appName` from `app.json`. ✓
- [ ] **Manifest:** `applicationId` = `com.birthdayapp`, launcher activity = `MainActivity`, `MainApplication` in `android:name`. ✓
- [ ] **Hermes:** `gradle.properties` has `hermesEnabled=true`; `app/build.gradle` uses `hermes-android` when true. ✓
- [ ] **New arch:** `newArchEnabled=false` in `gradle.properties` (no need to change for launch). ✓
- [ ] **Icons:** `AndroidManifest` uses `@drawable/ic_launcher`; `res/drawable/` and `res/mipmap-*` present. ✓
- [ ] **Reanimated:** Babel plugin `react-native-reanimated/plugin` in `babel.config.js`. ✓
- [ ] **Vector icons:** `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")` in `app/build.gradle`. ✓
- [ ] After applying fixes: run `npm install` → `cd android && ./gradlew clean && ./gradlew assembleDebug` → install on **emulator** and **real device** and confirm app opens to home screen without crash.

---

## Публикация в Google Play (Play Маркет)

1. **Release-сборка:** `cd android && ./gradlew assembleRelease` — APK в `android/app/build/outputs/apk/release/`. Для AAB (рекомендуется): `./gradlew bundleRelease` — в `android/app/build/outputs/bundle/release/`.
2. **Подпись:** Настроить `signingConfigs` в `app/build.gradle` и использовать в `buildTypes.release`. Либо создать keystore и указать в `gradle.properties` (не коммитить пароли).
3. **Минимальные требования:** `minSdkVersion 24`, `targetSdkVersion 35` — соответствуют политике Play.
4. **Проверка перед выкладкой:** Установить release-сборку на реальное устройство и убедиться, что приложение запускается и не падает (тот же SoLoader-фикс действует в release).

---

## Summary

1. **MainApplication.kt:** Call `SoLoader.loadLibrary("reactnative")` after `SoLoader.init()` so the merged native lib (and thus `libreact_featureflagsjni` mapping) is loaded before any code uses feature flags.
2. **package.json:** Fix JSON (no trailing comma), set `react-native-reanimated` to `~3.16.7`, and align `@react-native/*` to 0.77.0.
3. Reinstall deps, clean and build Android, then run on device/emulator and verify launch to home screen.
