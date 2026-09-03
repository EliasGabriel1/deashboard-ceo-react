/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10182A",
        paper: "#EEF0F4",
        panel: "#FFFFFF",
        line: "#DCE0E8",
        muted: "#5B6472",
        accent: "#7C1F3B",
        gold: "#B9873A",
        status: {
          ok: "#1F8A5F",
          watch: "#C9891F",
          risk: "#B23A2E",
          unknown: "#8B94A3",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
