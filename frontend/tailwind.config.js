/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1a1a1a',
          dark: '#121212',
          light: '#242424',
          muted: '#333333',
        },
        nude: {
          DEFAULT: '#c49a6c',
          hover: '#b08556',
          light: '#faf5ee',
          muted: '#e8ded2',
          accent: '#d4b996',
        },
        offwhite: '#fbfbfb',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        ultra: '.28em',
      },
    },
  },
  plugins: [],
};
