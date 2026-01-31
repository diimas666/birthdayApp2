# Birthday Reminder App 🎉

A beautiful mobile application built with React Native (Expo) to help you remember and celebrate birthdays with push notifications.

## Features

- ✅ **Add Birthdays**: Easy-to-use modal with name, date of birth, and optional notes
- 🔔 **Smart Notifications**: Automatic push notifications 3 days before, 1 day before, and on the birthday
- 🎨 **Modern UI**: Beautiful purple/violet gradient design with dark theme
- 📱 **Home Screen**: Carousel showing upcoming birthdays (next 7 days) with special highlighting for today
- 📋 **List Screen**: Full list of all birthdays, sorted by nearest date, with swipe-to-delete and tap-to-edit
- 🎊 **Confetti Animation**: Celebratory confetti when viewing birthdays on the actual day
- 📳 **Haptic Feedback**: Tactile feedback when saving birthdays
- 💾 **Local Storage**: All data stored locally using AsyncStorage

## Tech Stack

- **React Native** with **Expo** (~50.0.0)
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **Expo Notifications** for push notifications
- **React Navigation** for navigation
- **React Native Gesture Handler** for swipe actions
- **React Native Reanimated** for smooth animations
- **Expo Haptics** for tactile feedback
- **React Native Confetti Cannon** for celebrations

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Expo development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
birthdayApp/
├── App.tsx                 # Main app entry with navigation
├── components/
│   ├── BirthdayCard.tsx    # Birthday card component for carousel
│   ├── BirthdayModal.tsx   # Add/Edit birthday modal
│   └── EmptyState.tsx      # Empty state component
├── screens/
│   ├── HomeScreen.tsx      # Main home screen with carousel
│   └── ListScreen.tsx      # Full list of birthdays
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   ├── dateHelpers.ts      # Date calculation utilities
│   ├── notifications.ts    # Notification scheduling logic
│   └── storage.ts          # AsyncStorage operations
└── package.json
```

## Key Features Explained

### Notifications
- Notifications are scheduled automatically when birthdays are added/updated
- They repeat every year automatically
- Notifications are rescheduled on app start to ensure accuracy

### Date Calculations
- Automatically calculates age and next birthday
- Shows days until next birthday
- Handles year transitions correctly

### Data Persistence
- All birthdays are stored locally using AsyncStorage
- Data persists across app restarts
- No internet connection required

## Design

The app features a modern, dark-themed UI with:
- **Primary Colors**: Purple/Violet gradients (#8b5cf6, #a78bfa)
- **Background**: Dark gray/black (#0a0a14, #1a0a2e)
- **Cards**: Rounded corners with soft shadows and glow effects
- **Typography**: Clean, elegant fonts with proper hierarchy

## Permissions

The app requires notification permissions to send birthday reminders. These are requested automatically on first launch.

## Notes

- Asset files (icon.png, splash.png, etc.) referenced in `app.json` need to be created or use Expo's default assets
- For production builds, configure app icons and splash screens in the `assets/` folder
- Notifications work best when the app has been opened at least once after installation

## Development

- The app uses TypeScript for type safety
- All components are functional components with hooks
- State management is handled locally with React hooks
- No external state management library required

## License

Private project - All rights reserved
