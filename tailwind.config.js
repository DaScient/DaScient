/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep blue-black base — more atmospheric than pure black
        obsidian: "#030810",
        "obsidian-light": "#070f1e",
        "obsidian-mid": "#0d1a32",
        // Metal / glass surface tokens
        "metal-100": "rgba(255,255,255,0.04)",
        "metal-200": "rgba(255,255,255,0.08)",
        "metal-300": "rgba(255,255,255,0.14)",
        // Accent palette
        "accent-blue": "#0ea5e9",
        "accent-cyan": "#22d3ee",
        "accent-indigo": "#6366f1",
        "accent-violet": "#8b5cf6",
        // Electric highlights for hover / active states
        "electric-blue": "#38bdf8",
        "electric-cyan": "#67e8f9",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.14) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(99,102,241,0.09) 0%, transparent 60%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "glass-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 50%)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
        "4xl": "80px",
      },
      boxShadow: {
        "glow-blue": "0 0 24px rgba(14,165,233,0.22), 0 0 64px rgba(14,165,233,0.08)",
        "glow-cyan": "0 0 24px rgba(34,211,238,0.18)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5), 0 20px 48px rgba(0,0,0,0.55)",
        "glass-hover": "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(0,0,0,0.6), 0 24px 56px rgba(0,0,0,0.65), 0 0 32px rgba(14,165,233,0.06)",
      },
      animation: {
        "gradient-shift": "gradientShift 12s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "ticker": "ticker-slide 60s linear infinite",
        "scan": "scan 8s linear infinite",
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
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
}

