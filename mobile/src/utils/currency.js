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

let globalCurrency = 'S/';

export const getMobileCurrencySymbol = () => {
  return globalCurrency;
};

export const setMobileCurrencySymbol = (symbol) => {
  globalCurrency = symbol;
};
