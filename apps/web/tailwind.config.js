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
      animation: {
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        "depth-orb-1": "depth-orb-1 12s ease-in-out infinite",
        "depth-orb-2": "depth-orb-2 15s ease-in-out infinite",
        "depth-orb-3": "depth-orb-3 10s ease-in-out infinite",
        "depth-orb-4": "depth-orb-4 14s ease-in-out infinite",
        "depth-orb-5": "depth-orb-5 11s ease-in-out infinite",
        "depth-orb-6": "depth-orb-6 13s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-slow": "fade-in 0.3s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "slide-down-slow": "slide-down 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": {
            "background-position": "0% 50%",
            "background-size": "200% 200%",
          },
          "50%": {
            "background-position": "100% 50%",
            "background-size": "250% 250%",
          },
        },
        "depth-orb-1": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1) rotate(0deg)",
            opacity: "0.7",
          },
          "33%": {
            transform: "translate(150px, -100px) scale(1.4) rotate(120deg)",
            opacity: "0.9",
          },
          "66%": {
            transform: "translate(-100px, 150px) scale(0.8) rotate(240deg)",
            opacity: "0.5",
          },
        },
        "depth-orb-2": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1) rotate(0deg)",
            opacity: "0.6",
          },
          "40%": {
            transform: "translate(-180px, 120px) scale(1.5) rotate(-140deg)",
            opacity: "0.8",
          },
          "80%": {
            transform: "translate(120px, -150px) scale(0.7) rotate(-280deg)",
            opacity: "0.4",
          },
        },
        "depth-orb-3": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translate(0, -200px) scale(1.6)",
            opacity: "1",
          },
        },
        "depth-orb-4": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1) rotate(0deg)",
            opacity: "0.5",
          },
          "30%": {
            transform: "translate(-120px, -120px) scale(1.3) rotate(90deg)",
            opacity: "0.7",
          },
          "60%": {
            transform: "translate(120px, 120px) scale(0.9) rotate(180deg)",
            opacity: "0.4",
          },
          "90%": {
            transform: "translate(-60px, 60px) scale(1.1) rotate(270deg)",
            opacity: "0.6",
          },
        },
        "depth-orb-5": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.4",
          },
          "50%": {
            transform: "translate(180px, 180px) scale(1.7)",
            opacity: "0.7",
          },
        },
        "depth-orb-6": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1) rotate(0deg)",
            opacity: "0.6",
          },
          "25%": {
            transform: "translate(100px, -150px) scale(1.2) rotate(-90deg)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translate(-150px, 50px) scale(0.8) rotate(-180deg)",
            opacity: "0.5",
          },
          "75%": {
            transform: "translate(50px, 100px) scale(1.4) rotate(-270deg)",
            opacity: "0.7",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.6",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
  plugins: [],
};
