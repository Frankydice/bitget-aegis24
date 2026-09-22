/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          darkest: '#090a0c',
          card: '#121418',
          border: '#23272f',
          hover: '#1b1f26'
        },
        brand: {
          cyan: '#00E5FF',
          teal: '#03AAC7',
          green: '#26c99b',
          red: '#f7647e',
          amber: '#ffa963'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
