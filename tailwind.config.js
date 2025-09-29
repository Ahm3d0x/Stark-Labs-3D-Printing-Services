/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        background: 'var(--bg-color)',
        card: 'var(--card-bg)',
        text: 'var(--text-color)',
        // Brand colors
        'brand-indigo': '#4F46E5',
        'brand-purple': '#7C3AED',
        'brand-yellow': '#F59E0B',
        'brand-orange': '#F97316',
        // Dark mode colors
        'dark-700': '#1E293B',
        'dark-800': '#0F172A',
        'dark-900': '#020617',
        // Light mode colors
        'light-100': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      animation: {
        'zoom-in': 'zoomIn 8s ease-out',
        'fade-in': 'fadeIn 1.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(1.1)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  // RTL support
  variants: {
    extend: {
      textAlign: ['rtl'],
      float: ['rtl'],
      direction: ['rtl'],
    },
  },
}
