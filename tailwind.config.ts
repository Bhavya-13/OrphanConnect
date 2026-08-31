import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50: "#fff8ed",
          100: "#ffedd0",
          200: "#fed7a1",
          300: "#fdb962",
          400: "#fb9433",
          500: "#f3760f",
          600: "#d95c0a",
          700: "#b3450b",
          800: "#8f3710",
          900: "#752f11",
        },
        teal: {
          50: "#f0fbfa",
          300: "#7bd4c9",
          400: "#4fbcb0",
          500: "#2fa39a",
        },
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;