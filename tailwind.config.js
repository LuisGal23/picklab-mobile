/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#22c55e',
          'green-dark': '#16a34a',
          emerald: '#059669'
        }
      }
    },
  },
  plugins: [],
}
