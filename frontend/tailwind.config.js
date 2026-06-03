// Tailwind CSS configuration: extends default theme with custom colors matching CSS variables
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: '#0a1628',
        'navy-mid': '#0f2040',
        cyan: '#00d4ff',
        teal: '#00f5c4',
        'red-alert': '#ff4d6d',
        amber: '#ffb347',
      },
    },
  },
  plugins: [],
}
