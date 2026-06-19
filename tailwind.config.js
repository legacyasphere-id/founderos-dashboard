/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f1117',
        panel: '#16181f',
        border: '#1e2130',
        muted: '#6b7280',
        accent: '#6366f1',
        'accent-hover': '#4f52d4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
