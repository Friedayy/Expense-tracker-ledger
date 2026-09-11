/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14181F',
        paper: '#F7F5F0',
        line: '#E4E0D6',
        teal: {
          DEFAULT: '#1F6F5C',
          soft: '#E4EEE9',
        },
        rust: {
          DEFAULT: '#B8542F',
          soft: '#F5E7DF',
        },
        gold: {
          DEFAULT: '#C9A227',
          soft: '#F5EFDA',
        },
        slate: {
          DEFAULT: '#6B7280',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        figure: ['2.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'figure-lg': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
