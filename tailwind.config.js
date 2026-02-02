/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        golf: {
          green: '#6ee7b7',
          lightgreen: '#a7f3d0',
          dark: '#34d399',
          accent: '#6ee7b7',
        },
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          hover: '#1a1a1a',
          border: '#1f1f1f',
        }
      }
    },
  },
  plugins: [],
}
