/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#ef2b2b',
          crimson: '#d61f1f',
          dark: '#8a1212',
          gold: '#fbbf24',
          amber: '#f59e0b',
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'border-spin': 'border-spin 5s linear infinite',
        shine: 'shine 3.5s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        aurora: 'aurora 14s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'border-spin': {
          '100%': { transform: 'rotate(360deg)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-15deg)' },
          '55%': { transform: 'translateX(220%) skewX(-15deg)' },
          '100%': { transform: 'translateX(220%) skewX(-15deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        aurora: {
          '0%': { transform: 'translate(-8%, -4%) scale(1)' },
          '50%': { transform: 'translate(6%, 5%) scale(1.12)' },
          '100%': { transform: 'translate(-4%, 8%) scale(1.04)' },
        },
      },
    },
  },
  plugins: [],
}
