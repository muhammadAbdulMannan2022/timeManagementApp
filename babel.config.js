const plugin = require("tailwindcss");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
      // Conditionally add worklets plugin if available
      (() => {
        try {
          require.resolve("react-native-worklets/plugin");
          return "react-native-worklets/plugin";
        } catch {
          return null;
        }
      })(),
    ].filter(Boolean),
  };
};
