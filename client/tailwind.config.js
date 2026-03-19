/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#b0eacc',
          300: '#7ddaae',
          400: '#54bd95',
          500: '#2da472',
          600: '#1f855c',
          700: '#196b4b',
          800: '#17553d',
          900: '#144634',
        },
        dark: {
          50: '#f6f6f9',
          100: '#ececf2',
          200: '#d4d5e2',
          300: '#aeb0c8',
          400: '#8385aa',
          500: '#636690',
          600: '#4f5177',
          700: '#414261',
          800: '#383952',
          900: '#1e1f2e',
          950: '#13141f',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
