module.exports = {
  project: {
    ios: {},
    android: {},
  },
  // Exclude from Android autolinking to isolate startup crash (restore when fixed)
  dependencies: {
    "react-native-reanimated": { platforms: { android: null } },
    "react-native-vector-icons": { platforms: { android: null } },
  },
};
