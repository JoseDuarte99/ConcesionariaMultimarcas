/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fondo: "#070b12",
        superficie: "#0d1523",
        "superficie-2": "#121d30",
        borde: "#1e2c42",
        texto: "#e6edf6",
        tenue: "#92a3ba",
        acento: "#38bdf8",
        "acento-suave": "#0e7490",
        exito: "#34d399",
        advertencia: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        suave: "0 18px 45px rgba(2, 8, 23, 0.45)",
      },
    },
  },
  plugins: [],
};
