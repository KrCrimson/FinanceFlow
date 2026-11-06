/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/utils/currency.js
 * Capa / módulo ...: Frontend · Utilidad
 * Función .........: Lista de 13 monedas, formato de montos y recuerdo de la moneda elegida.
 * Requerimientos ..: RF-39  (módulos: Perfil)
 * Casos de uso ....: CU-12 Gestionar información de perfil
 *                    CU-05 Consultar resumen y balance (Panel principal)
 * Lo usan .........: frontend/src/pages/DashboardPage.jsx
 *                    frontend/src/pages/ProfilePage.jsx
 * Pruebas .........: frontend/src/__tests__/componentes-base.test.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
export const CURRENCIES = [
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano (S/) 🇵🇪' },
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense ($) 🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro (€) 🇪🇺' },
  { code: 'MXN', symbol: 'MXN$', name: 'Peso Mexicano (MXN$) 🇲🇽' },
  { code: 'COP', symbol: 'COP$', name: 'Peso Colombiano (COP$) 🇨🇴' },
  { code: 'ARS', symbol: 'ARS$', name: 'Peso Argentino (ARS$) 🇦🇷' },
  { code: 'CLP', symbol: 'CLP$', name: 'Peso Chileno (CLP$) 🇨🇱' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (R$) 🇧🇷' },
  { code: 'BOB', symbol: 'Bs.', name: 'Boliviano (Bs.) 🇧🇴' },
  { code: 'UYU', symbol: 'UYU$', name: 'Peso Uruguayo (UYU$) 🇺🇾' },
  { code: 'PYG', symbol: '₲', name: 'Guaraní Paraguayo (₲) 🇵🇾' },
  { code: 'VES', symbol: 'Bs.S', name: 'Bolívar Venezolano (Bs.S) 🇻🇪' },
  { code: 'CRC', symbol: '₡', name: 'Colón Costarricense (₡) 🇨🇷' },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal Guatemalteco (Q) 🇬🇹' },
  { code: 'HNL', symbol: 'L', name: 'Lempira Hondureño (L) 🇭🇳' },
  { code: 'NIO', symbol: 'C$', name: 'Córdoba Nicaragüense (C$) 🇳🇮' },
  { code: 'DOP', symbol: 'RD$', name: 'Peso Dominicano (RD$) 🇩🇴' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (£) 🇬🇧' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonés (¥) 🇯🇵' },
  { code: 'CAD', symbol: 'CAD$', name: 'Dólar Canadiense (CAD$) 🇨🇦' },
  { code: 'AUD', symbol: 'AUD$', name: 'Dólar Australiano (AUD$) 🇦🇺' },
  { code: 'CHF', symbol: 'Fr.', name: 'Franco Suizo (Fr.) 🇨🇭' }
];

export const getCurrencySymbol = () => {
  return localStorage.getItem('financeflow_currency') || 'S/';
};

export const setCurrencySymbol = (symbol) => {
  localStorage.setItem('financeflow_currency', symbol);
  window.dispatchEvent(new Event('currency_changed'));
};
