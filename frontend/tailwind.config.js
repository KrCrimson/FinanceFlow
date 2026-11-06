/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/tailwind.config.js
 * Capa / módulo ...: Frontend · Configuración
 * Función .........: Define los colores, tipografías y animaciones de la interfaz (diseño que se adapta a celular, tableta y computadora).
 * Calidad (RNF) ...: RNF-09, RNF-11
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
