/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
