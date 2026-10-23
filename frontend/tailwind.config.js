/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Housio Signature Brand Colors (Extracted directly from official Logo)
        brand: {
          50: '#f0f8f7',
          100: '#dbf0ed',
          200: '#b8e2db',
          300: '#86ccc1',
          400: '#4fb0a4',
          500: '#1e8e83', // Vibrant Teal
          600: '#116e65', // Main Housio Teal
          700: '#0e5952', // Hover State
          800: '#0d4742',
          900: '#0a3531', // Deep Logo Pillar
          950: '#041d1b', // Dark Obsidian Teal
        },
        // Housio Signature Warm Champagne Gold (Extracted from Logo Arch & 'o')
        gold: {
          50: '#fcfaf5',
          100: '#f7f2e6',
          200: '#eee3c9',
          300: '#e1cea3',
          400: '#d1b376',
          500: '#c59b52', // Signature Logo Gold
          600: '#b18341',
          700: '#8e6333',
          800: '#754f2e',
          900: '#61422a',
          950: '#382315',
        },
        surface: {
          50: '#f8faf9',
          100: '#f1f5f4',
          200: '#e2e9e7',
          300: '#cbd6d4',
          400: '#94a5a2',
          500: '#647673',
          600: '#475755',
          700: '#33413f',
          800: '#1b2524',
          900: '#0e1716',
          950: '#070d0c',
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(10, 53, 49, 0.05), 0 1px 2px rgba(10, 53, 49, 0.03)',
        'soft': '0 4px 20px -2px rgba(10, 53, 49, 0.07), 0 2px 6px -1px rgba(10, 53, 49, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(10, 53, 49, 0.1), 0 4px 12px -2px rgba(10, 53, 49, 0.06)',
        'soft-xl': '0 20px 40px -6px rgba(10, 53, 49, 0.14), 0 8px 16px -4px rgba(10, 53, 49, 0.08)',
        'gold-glow': '0 0 25px -4px rgba(197, 155, 82, 0.35)',
        'gold-glow-lg': '0 0 50px -10px rgba(197, 155, 82, 0.45)',
        'teal-glow': '0 0 25px -4px rgba(17, 110, 101, 0.35)',
        'teal-glow-lg': '0 0 50px -10px rgba(17, 110, 101, 0.45)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
