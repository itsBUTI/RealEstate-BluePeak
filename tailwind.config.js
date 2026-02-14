/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          950: '#070E1A',
          900: '#0B162A',
          800: '#0E2240',
          700: '#16315A',
          600: '#1F4A7A',
          500: '#2E6AAE',
          100: '#D7E6FF',
        },
        surface: {
          0: '#FFFFFF',
          50: '#F7F9FC',
          100: '#EEF2F8',
          900: '#0A0F1C',
        },
      },
      boxShadow: {
        soft: '0 18px 50px rgba(2, 8, 23, 0.14)',
        lift: '0 22px 70px rgba(2, 8, 23, 0.18)',
      },
    },
  },
  plugins: [],
}

