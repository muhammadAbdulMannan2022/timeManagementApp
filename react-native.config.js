module.exports = {
  dependencies: {
    // Prevent native autolinking of worklets (Reanimated already bundles it)
    "react-native-worklets": {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
};
