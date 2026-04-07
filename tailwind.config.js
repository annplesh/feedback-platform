/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    screens: {
      xxs: { max: "320px" },
      xs: { max: "360px" },
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
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
