/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        light: ["Nunito_300Light"],
        normal: ["Nunito_400Regular"],
        medium: ["Nunito_500Medium"],
        bold: ["Nunito_700Bold"],
        black: ["Nunito_900Black"],
      },
    },
  },
  plugins: [],
};
