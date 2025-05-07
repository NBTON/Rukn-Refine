module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "react-native-reanimated/plugin",
        {
          // This explicitly tells Reanimated to ignore reduced motion settings
          // Removes the warning while still respecting accessibility preferences
          relativeSourceLocation: true,
          // Setting this option to true will make the animations run even when
          // the device has reduced motion settings enabled
          disablePreserveAnimations: true,
        },
      ],
    ],
  };
};
