/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      default: "rgba(0, 0, 0, 1)",
      primary: "rgba(26, 26, 26, 1)",
      secondary: "rgba(44, 44, 46, 1)",
      white: "rgba(255, 255, 255, 1)",
      grey: "rgba(60, 60, 67, 0.36)",
      blue: "rgba(10, 132, 255, 1)",
      seperator: "rgba(60, 60, 67, 0.36)",
      "dark-white": "rgba(255, 255, 255, 1)",
      "dark-grey": "rgba(235, 235, 245, 0.6)",
      "dark-blue": "rgba(10, 132, 255, 1)",
      "dark-seperator": "rgba(84, 84, 88, 0.65)",
    },
    fontFamily: {
      sans: ["SF Pro Text", "sans-serif"],
      display: ["SF Pro Display", "sans-serif"],
      mono: ["SF Mono", "monospace"],
    },
    extend: {
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
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
