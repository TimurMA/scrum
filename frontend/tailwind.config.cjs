/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'new': '#3B82F6',
        'in-progress': '#F59E0B',
        'review': '#F97316',
        'done': '#10B981',
      }
    },
  },
  plugins: [],
}



