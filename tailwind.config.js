// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Сканує всі файли JavaScript та JSX у папці src
    "./public/index.html",         // Вказує на конкретний файл index.html у папці public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}