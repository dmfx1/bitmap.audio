import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  // This ensures Tailwind looks inside both .astro and .tsx files
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        // Corrected syntax for transparency support
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        // This fixes the "bg-card does not exist" error
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        // Adding your grid color variable here too
        "grid-color": "hsl(var(--grid-color) / <alpha-value>)",

        bitmap: {
          cyan: "hsl(var(--bitmap-cyan) / <alpha-value>)",
          dark: "hsl(var(--bitmap-dark) / <alpha-value>)",
          gray: "hsl(var(--bitmap-gray) / <alpha-value>)",
          light: "hsl(var(--bitmap-light) / <alpha-value>)",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        scan: "scan 3s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addVariant }: { addVariant: Function }) => {
      addVariant('mobile', '@media (max-width: 767px)')
    },
  ],
} satisfies Config;