// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <--- PASTIKAN BARIS INI ADA

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping Variable CSS ke Nama Class Tailwind
        background: "var(--bg-primary)",
        surface: "var(--bg-secondary)",
        elevated: "var(--bg-elevated)",

        foreground: "var(--text-primary)",
        muted: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",

        border: "var(--border-default)", // <--- Pastikan ini ada
        "border-subtle": "var(--border-subtle)",

        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
      },
      fontFamily: {
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
