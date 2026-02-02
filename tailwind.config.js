/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        golf: {
          green: '#2d5016',
          lightgreen: '#4a7c23',
          sand: '#f4e4c1',
          sky: '#87ceeb',
        }
      }
    },
  },
  plugins: [],
}
