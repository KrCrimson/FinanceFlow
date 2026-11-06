/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: sdk/jest.config.js
 * Capa / módulo ...: SDK · Configuración de pruebas
 * Función .........: Configuración de las pruebas del SDK.
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/'
  ]
};