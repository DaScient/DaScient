/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        "obsidian-light": "#111111",
        "obsidian-mid": "#1a1a2e",
        "metal-100": "rgba(255,255,255,0.06)",
        "metal-200": "rgba(255,255,255,0.10)",
        "metal-300": "rgba(255,255,255,0.18)",
        "accent-blue": "#0ea5e9",
        "accent-cyan": "#22d3ee",
        "accent-indigo": "#6366f1",
        "accent-violet": "#8b5cf6",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(99,102,241,0.10) 0%, transparent 60%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(14,165,233,0.25), 0 0 60px rgba(14,165,233,0.10)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.20)",
        glass: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-hover": "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)",
      },
      animation: {
        "gradient-shift": "gradientShift 12s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "ticker": "ticker-slide 60s linear infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "ticker-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
}

