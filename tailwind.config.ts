import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        landing: "1040px",
        test: "900px",
      },
      boxShadow: {
        subtle: "0 1px 0 rgba(0,0,0,0.06), 0 12px 30px rgba(0,0,0,0.06)",
      },
      animation: {
        breathe: "breathe 1.25s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
