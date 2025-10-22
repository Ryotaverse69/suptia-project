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
          100: "#e8f4f8",
          200: "#d4e9f1",
          300: "#7a98ec", // 明るい青（グラデーション開始）
          400: "#5a7fe6", // 中間の青（グラデーション中間）
          500: "#3b66e0", // メインの青（グラデーション終了・一番暗い）
          600: "#2d4fb8",
          700: "#243d94",
          800: "#1d3177",
          900: "#182763",
        },
        accent: {
          mint: "#64e5b3",
          "mint-light": "rgba(100, 229, 179, 0.15)",
          purple: "#5647a6",
          "purple-light": "rgba(86, 71, 166, 0.15)",
          blue: "#3b66e0",
          "blue-light": "rgba(59, 102, 224, 0.1)",
        },
        background: "#f1faf9",
        foreground: "#182763",
      },
      backgroundImage: {
        "gradient-pastel":
          "linear-gradient(135deg, #f1faf9 0%, #e8f4f8 50%, #f0f5fc 100%)",
        "gradient-glass-mint":
          "linear-gradient(135deg, rgba(100, 229, 179, 0.15) 0%, rgba(255, 255, 255, 0.6) 100%)",
        "gradient-glass-purple":
          "linear-gradient(135deg, rgba(86, 71, 166, 0.15) 0%, rgba(255, 255, 255, 0.6) 100%)",
        "gradient-glass-blue":
          "linear-gradient(135deg, rgba(59, 102, 224, 0.1) 0%, rgba(255, 255, 255, 0.7) 100%)",
      },
      boxShadow: {
        glass:
          "0 8px 32px 0 rgba(59, 102, 224, 0.1), 0 2px 8px 0 rgba(59, 102, 224, 0.05)",
        "glass-hover":
          "0 12px 48px 0 rgba(59, 102, 224, 0.15), 0 4px 16px 0 rgba(59, 102, 224, 0.08)",
        soft: "0 4px 16px 0 rgba(59, 102, 224, 0.08), 0 1px 4px 0 rgba(59, 102, 224, 0.04)",
        "glow-mint": "0 0 24px rgba(100, 229, 179, 0.3)",
        "glow-purple": "0 0 24px rgba(86, 71, 166, 0.3)",
        "glow-blue": "0 0 24px rgba(59, 102, 224, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
        glass: "20px",
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
