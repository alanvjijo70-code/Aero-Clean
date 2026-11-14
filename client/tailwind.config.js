/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050B16',
          secondary: '#091426',
        },
        surface: {
          DEFAULT: '#0D1B2E',
          glass: 'rgba(18, 37, 61, 0.65)',
          light: '#132845',
        },
        primary: {
          DEFAULT: '#00D9FF',
          dark: '#00A8C6',
          hover: '#33E1FF',
        },
        secondary: {
          DEFAULT: '#1677FF',
          hover: '#3A8DFF',
        },
        accent: {
          DEFAULT: '#65F4FF',
          glow: 'rgba(0, 217, 255, 0.35)',
        },
        text: {
          primary: '#F4F8FF',
          secondary: '#9BAEC4',
          muted: '#637A99',
        },
        border: {
          DEFAULT: 'rgba(119, 190, 255, 0.16)',
          bright: 'rgba(0, 217, 255, 0.45)',
        },
        status: {
          success: '#27E5A2',
          warning: '#FFB547',
          danger: '#FF647C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 217, 255, 0.25)',
        'glow-cyan-lg': '0 0 45px rgba(0, 217, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
