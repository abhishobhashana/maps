/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      default: "rgba(0, 0, 0, 1)",
      primary: "rgba(26, 26, 26, 1)",
      secondary: "rgb(38, 38, 38)",
      white: "rgba(255, 255, 255, 1)",
      "light-white": "rgb(247, 247, 245)",
      "light-white-second": "rgb(227, 227, 227)",
      border: "rgba(17, 17, 17, 0.25)",
      grey: "rgba(60, 60, 67, 0.36)",
      "light-grey": "rgba(67, 67, 69)",
      "light-grey-second": "rgb(168, 168, 174)",
      "light-grey-third": "rgb(108, 108, 108)",
      blue: "rgba(10, 132, 255, 1)",
      seperator: "rgba(60, 60, 67, 0.36)",
      "dark-white": "rgba(255, 255, 255, 1)",
      "dark-grey": "rgb(67, 67, 74)",
      "dark-blue": "rgba(10, 132, 255, 1)",
      "dark-seperator": "rgba(84, 84, 88, 0.65)",
      "dark-border": "#5a5c64",
    },
    fontFamily: {
      sans: ["SF Pro Text", "sans-serif"],
      sansMedium: ["SF Pro Text Medium", "sans-serif"],
      display: ["SF Pro Display", "sans-serif"],
      displayMedium: ["SF Pro Display Medium", "sans-serif"],
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
