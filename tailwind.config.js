/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media",
  theme: {
    extend: {
      animation: {
        "slide-down": "slideDown 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.5s ease-out both",
        "fade-in-right": "fade-in-right 0.5s ease-out both",
        "slide-out-right": "slide-out-right 0.5s ease-out both",
        "fade-out-right": "fade-out-right 0.5s ease-out both",
        blink: "blink 1s infinite",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        blink: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      height: {
        108: "27rem",
        120: "30rem",
        128: "32rem",
      },
      backgroundColor: {
        'primary': '#4F46E5',
        'secondary': '#10B981',
        'tertiary': '#F59E0B',
      },
      textColor: {
        'primary': '#4F46E5',
        'secondary': '#10B981',
        'tertiary': '#F59E0B',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary, .btn-secondary, .btn-tertiary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
          transition: 'background-color 0.2s',
          minWidth: '120px',
          textAlign: 'center',
          '@screen sm': {
            padding: '0.75rem 1.5rem',
          },
        },
        '.btn-primary': {
          backgroundColor: '#4F46E5',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#4338CA',
          },
        },
        '.btn-secondary': {
          backgroundColor: '#10B981',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
        '.btn-tertiary': {
          backgroundColor: '#F59E0B',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#D97706',
          },
        },
      })
    },
  ],
  mode: "jit",
};