/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ilustre: {
          blue: "#3B7C9D",
          blueDark: "#2A5A73",
          blueLight: "#B3CCD9",
          orange: "#DF7D46",
          orangeDark: "#C06530",
          cream: "#F7F3EC",
        },
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        ballot: "0 8px 24px rgba(42, 90, 115, 0.15)",
      },
    },
  },
  plugins: [],
};
