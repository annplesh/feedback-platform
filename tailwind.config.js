/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Outfit"', "sans-serif"],
      },
      colors: {
        ink: "#1a1714",
        paper: "#f7f4ef",
        cream: "#ede9e1",
        accent: "#c0392b",
        muted: "#8c8580",
      },
    },
  },
  plugins: [],
};
