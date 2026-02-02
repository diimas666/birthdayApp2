# Android RN 0.76.6 – Fix Summary

## Root cause of "App keeps stopping"

1. **Missing Hermes native dependency (primary)**  
   With `hermesEnabled=true` in `gradle.properties`, the app must explicitly add `implementation("com.facebook.react:hermes-android")`. In RN 0.76, `react-android` only has Hermes as `compileOnly`, so native Hermes libs are not included in the APK unless the app adds this dependency. Without it, the app crashes at startup when loading Hermes.

2. **SoLoader / New Architecture (if enabled)**  
   If New Architecture were enabled, loading `DefaultNewArchitectureEntryPoint.load()` before the merged `libreactnative.so` would cause `UnsatisfiedLinkError: libreact_featureflagsjni.so not found`. Your `MainApplication.kt` already calls `SoLoader.loadLibrary("reactnative")` before `load()`, so this is correct when you turn on New Architecture.

3. **react-native-vector-icons path**  
   The `apply from` path and the default `iconFontsDir` in `fonts.gradle` were relative to the app module (`android/app`), so they pointed to `android/node_modules/...`, which does not exist. `node_modules` is at the project root; the paths were fixed to use the project root.

4. **settings.gradle / autolinking**  
   Autolinking was using a custom CLI command with `NODE_BINARY`; the script was tightened and the project root and CLI path are now derived consistently so autolinking runs with the correct Node and working directory.

---

## File diffs (what was changed)

### 1. `android/gradle.properties` (unchanged; verified)

- `newArchEnabled=false`, `hermesEnabled=true`
- `NODE_BINARY=/Users/restart/.nvm/versions/node/v20.19.5/bin/node`

### 2. `android/settings.gradle`

- Cleaned up formatting and comments.
- `gradle.properties` is read with `file("gradle.properties")` (relative to settings root = `android/`).
- Project root set as `settings.rootDir.parentFile`; CLI path as `projectRoot/node_modules/@react-native-community/cli/build/bin.js`.
- Autolinking: `autolinkLibrariesFromCommand(cliCommand)` with the explicit `[nodeBinary, cliFile.absolutePath, "config"]` so Gradle uses `NODE_BINARY` when PATH has no node (e.g. nvm).

### 3. `android/app/build.gradle`

- **Hermes:** Conditional dependency added:
  - `hermesEnabled=true` → `implementation("com.facebook.react:hermes-android")`
  - else → `implementation jscFlavor`
- **react-native-vector-icons:**
  - `projectRoot = rootProject.projectDir.parentFile`
  - `project.ext.vectoricons = [ iconFontsDir: "${projectRoot}/node_modules/react-native-vector-icons/Fonts" ]`
  - `apply from: file("${projectRoot}/node_modules/react-native-vector-icons/fonts.gradle")`
- **react block:** `nodeExecutableAndArgs` uses `rootProject.findProperty("NODE_BINARY") ?: "node"`.
- Minor: `jscFlavor` string uses double quotes for consistency.

### 4. `android/build.gradle` (unchanged)

- Standard RN 0.76 root build: AGP, Kotlin, `react-native-gradle-plugin`; `allprojects` with `google()`, `mavenCentral()`, `jsc-android`.

### 5. `MainApplication.kt` (unchanged; verified)

- `SoLoader.init(this, false)` then `SoLoader.loadLibrary("reactnative")` then `if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) load()`.
- `PackageList(this).packages` for autolinking; `DefaultReactNativeHost` with `BuildConfig` for new arch and Hermes.

### 6. `MainActivity.kt` (unchanged; verified)

- `getMainComponentName() = "BirthdayApp"`; `DefaultReactActivityDelegate(..., BuildConfig.IS_NEW_ARCHITECTURE_ENABLED)`.

### 7. `babel.config.js` (unchanged; verified)

- `presets: ['module:@react-native/babel-preset']`, `plugins: ['react-native-reanimated/plugin']` (Reanimated plugin last).

### 8. Native modules (autolinking)

- `@notifee/react-native`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-contacts`, `react-native-vector-icons` are linked via React Native autolinking; no extra Gradle or Java/Kotlin setup required. `App.tsx` already uses `GestureHandlerRootView`; vector icons path is fixed above.

---

## Final run instructions (terminal only)

1. **Node (nvm)**  
   Use Node 20; ensure `NODE_BINARY` in `android/gradle.properties` points to your node (e.g. `/Users/restart/.nvm/versions/node/v20.19.5/bin/node`).

2. **Clean and build**

   ```bash
   cd /Users/restart/Desktop/birthdayApp2
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   cd ..
   ```

3. **Run on emulator (API 34+)**

   - Start Metro (separate terminal):

     ```bash
     cd /Users/restart/Desktop/birthdayApp2
     npx react-native start
     ```

   - Run Android:

     ```bash
     cd /Users/restart/Desktop/birthdayApp2
     npx react-native run-android
     ```

   Or in one go (Metro in background):

   ```bash
   cd /Users/restart/Desktop/birthdayApp2
   npx react-native start &
   npx react-native run-android
   ```

4. **If the emulator is not detected**

   ```bash
   adb devices
   ```

   Ensure one device/emulator is listed. If needed, start an API 34+ AVD from the command line or Android Studio and run again.

After these changes, the app should launch on the Android emulator without the "App keeps stopping" crash.
