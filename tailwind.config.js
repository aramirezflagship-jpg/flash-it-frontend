/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          violet: '#7C3AED',
          magenta: '#EC4899',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        pulse_logo: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        countdown: {
          '0%': { opacity: '0', transform: 'scale(1.5)' },
          '20%': { opacity: '1', transform: 'scale(1)' },
          '80%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.5)' },
        },
      },
      animation: {
        pulse_logo: 'pulse_logo 2s ease-in-out infinite',
        countdown: 'countdown 0.8s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
