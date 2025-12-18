/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6EE7B7', // verde menta suave
        secondary: '#A7F3D0',
        accent: '#FDE68A', // amarillo pastel
        background: '#F0FDF4', // fondo muy claro
        text: '#22223B', // gris oscuro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px 0 rgba(34,34,59,0.08)',
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [],
}
