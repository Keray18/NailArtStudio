import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F8F3EF",
          subtle: "#F1E9E3",
        },
        blush: {
          DEFAULT: "#E8CFCB",
          light: "#F7EFEB",
          hover: "#DFC0BB",
        },
        rose: {
          DEFAULT: "#A86F78",
          hover: "#8F5962",
          subtle: "#F2E4E6",
        },
        espresso: {
          DEFAULT: "#453438",
          muted: "#78656A",
          light: "#5A4449",
        },
        champagne: {
          DEFAULT: "#C3A67B",
          light: "#E5D7C2",
          dark: "#A6895E",
        },
        status: {
          success: "#2D6A4F",
          warning: "#D97706",
          error: "#BA1A1A",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "-apple-system", "sans-serif"],
      },
      aspectRatio: {
        "4/5": "4 / 5",
      },
      boxShadow: {
        card: "0 2px 10px rgba(69, 52, 56, 0.04)",
        "card-hover": "0 8px 24px rgba(69, 52, 56, 0.08)",
        drawer: "-4px 0 24px rgba(69, 52, 56, 0.15)",
        sheet: "0 -4px 24px rgba(69, 52, 56, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

