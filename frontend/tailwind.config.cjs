/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#FF5200',
          600: '#EA4800',
        },
      },
      boxShadow: {
        card: '0 10px 30px -4px rgba(0, 0, 0, 0.08)',
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
