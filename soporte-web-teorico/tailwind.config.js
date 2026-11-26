/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: "#0f172a",
        acento: "#0e7490",
        papel: "#f8fafc",
      },
    },
  },
  plugins: [],
};
