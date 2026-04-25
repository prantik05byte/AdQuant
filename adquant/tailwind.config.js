/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce7ff',
          200: '#bdd1ff',
          300: '#90b0ff',
          400: '#5c85ff',
          500: '#3b5bfc',
          600: '#2539f0',
          700: '#1d2cdd',
          800: '#1e27b3',
          900: '#1e268c',
        }
      }
    },
  },
  plugins: [],
}
