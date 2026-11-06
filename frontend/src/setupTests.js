/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/setupTests.js
 * Capa / módulo ...: Frontend · Configuración de pruebas
 * Función .........: Prepara el entorno de las pruebas de pantallas.
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import '@testing-library/jest-dom';
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  };
});
