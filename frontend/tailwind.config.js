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
          darkest: '#020202',
          sidebar: '#070707',
          surface: '#0c0c0e',
          card: '#0a0a0c',
          cardHover: '#111114',
          border: 'rgba(255, 255, 255, 0.05)',
          borderMedium: 'rgba(255, 255, 255, 0.10)',
        },
        brand: {
          cyan: '#00E5FF',
          blue: '#3b82f6',
          teal: '#03AAC7',
          green: '#26c99b',
          red: '#f7647e',
          amber: '#ffa963'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
