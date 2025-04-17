/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        'primary-light': '#ffffff',
        'primary-dark': '#1a1a1a',
        'text-light': '#000000',
        'text-dark': '#ffffff'
      }
    },
  },
  plugins: [],
}