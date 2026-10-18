import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// All colours come from CSS variables in globals.css so the palette can be
// adjusted in one place. Burgundy is the primary; use it sparingly.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))", hover: "hsl(var(--primary-hover))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "0 0% 100%" },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { DEFAULT: "0.25rem", md: "0.375rem", lg: "0.5rem" },
    },
  },
  plugins: [animate],
};
export default config;
