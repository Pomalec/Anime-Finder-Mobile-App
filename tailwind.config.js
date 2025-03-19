/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: 'purple',
        secondary: 'black',
        accent: 'grey',
        lavender: '#E6E6FA',
        plum: '#DDA0DD',
        orchid: '#DA70D6',
        fuchsia: '#FF00FF',
        magenta: '#FF00FF',
        rose: '#FF007F',
        mauve: '#E0B0FF',
        blush: '#DE5D83'
      }
    },
  },
  plugins: [],
};
