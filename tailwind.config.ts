import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      colors: {
        bg: {
          base: "#080810",
          subtle: "#0d0d18",
          surface: "#12121f",
          elevated: "#181826",
          overlay: "#1e1e2e",
        },
        border: {
          DEFAULT: "#1f1f35",
          subtle: "#16162a",
          strong: "#2a2a42",
        },
        accent: {
          DEFAULT: "#7c6eff",
          muted: "#4f46b3",
          glow: "rgba(124,110,255,0.15)",
          soft: "rgba(124,110,255,0.08)",
        },
        text: {
          primary: "#e8e8f2",
          secondary: "#9090aa",
          muted: "#5a5a72",
          inverse: "#080810",
        },
        status: {
          online: "#22c55e",
          away: "#f59e0b",
          offline: "#6b7280",
          error: "#ef4444",
          warning: "#f59e0b",
          success: "#22c55e",
        },
        dept: {
          science: "#38bdf8",
          ict: "#a78bfa",
          math: "#fb923c",
          engineering: "#4ade80",
          arts: "#f472b6",
          english: "#fbbf24",
          history: "#f87171",
          music: "#c084fc",
          pe: "#34d399",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(124,110,255,0.1)" },
          to: { boxShadow: "0 0 30px rgba(124,110,255,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
