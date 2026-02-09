import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e17",
        surface: "#0f1624",
        surfaceLight: "#151d2e",
        accent: "#7dd3fc",
        accentDim: "#38bdf8",
        accentMuted: "#0e7490",
        text: "#f8fafc",
        textMuted: "#94a3b8",
        border: "rgba(125, 211, 252, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      maxWidth: {
        container: "1280px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      boxShadow: {
        glow: "0 0 40px rgba(125, 211, 252, 0.15)",
        "glow-lg": "0 0 60px rgba(125, 211, 252, 0.2)",
        "glow-accent": "0 0 20px rgba(125, 211, 252, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
