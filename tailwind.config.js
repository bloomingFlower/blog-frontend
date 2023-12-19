/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'media',
  theme: {
    extend: {
      animation: {
        "slide-down": "slideDown 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out both",
        "slide-in-right": "slide-in-right 0.5s ease-out both",
        "fade-in-right": "fade-in-right 0.5s ease-out both",
        "slide-out-right": "slide-out-right 0.5s ease-out both",
        "fade-out-right": "fade-out-right 0.5s ease-out both",
        "blink": 'blink 1s infinite',
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
        "blink": {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
