/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ This glob pattern correctly includes files in `app/` and `app/(tabs)/`
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#00B8D4"
        },
        secondary: {
          default: "#818181"
        },
      }
    },
  },
  plugins: [],
};
