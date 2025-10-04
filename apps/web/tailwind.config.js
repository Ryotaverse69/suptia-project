/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b66e0",
          50: "#f1faf9",
          100: "#e3f5f7",
          200: "#c7ebef",
          300: "#9dd9e3",
          400: "#6bc0d1",
          500: "#3b66e0",
          600: "#2d4fb8",
          700: "#243d94",
          800: "#1d3177",
          900: "#182763",
        },
        accent: {
          mint: "#64e5b3",
          purple: "#5647a6",
        },
        background: "#f1faf9",
        foreground: "#182763",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
        },
      },
    },
  },
  plugins: [],
};
