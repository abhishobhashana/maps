/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "default-bg": "#000000",
      "default-bg-scroll": "rgba(22, 22, 23, 0.8)",
      "default-bg-menu": "rgba(22, 22, 23)",
      "default-text": "rgba(255, 255, 255, 0.8)",
      "default-text-hover": "#ffffff",
    },
    fontFamily: {
      sans: ["SF Pro Text", "sans-serif"],
      display: ["SF Pro Display", "sans-serif"],
      mono: ["SF Mono", "monospace"],
    },
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }
    },
    screens: {
      sm: "320px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    variants: {},
  },
  plugins: [],
};
