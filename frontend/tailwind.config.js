/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          900: '#134e4a',
        },
        primary: '#0F172A',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'ifam': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
