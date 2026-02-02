#!/bin/bash
# Удаляет старую установку com.birthdayapp и запускает приложение.
# Используйте, если видите INSTALL_FAILED_UPDATE_INCOMPATIBLE (подписи не совпадают).

set -e
cd "$(dirname "$0")"
adb uninstall com.birthdayapp 2>/dev/null || true
cd ..
npx react-native run-android "$@"
