/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      dropShadow: {
        '3xl': 'drop-shadow(0 0 2em #646cffaa)',
      }
    },
  },
  plugins: [],
}

