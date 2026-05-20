/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#bf4bf6',
          pink: '#ff6b6b',
          cyan: '#00f0ff',
          dark: '#0a0a0f',
          darker: '#050508',
        }
      }
    },
  },
  plugins: [],
} 
