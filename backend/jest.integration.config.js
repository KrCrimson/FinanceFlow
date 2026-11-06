/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/jest.integration.config.js
 * Capa / módulo ...: Backend · Configuración de pruebas
 * Función .........: Configura las pruebas de integración con base de datos real en memoria (npm run test:integration).
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Pruebas de integración con MongoDB real en memoria (sin mocks de base de datos).
// Se ejecutan con: npm run test:integration
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/integration/**/*.itest.js'],
  testTimeout: 60000,
};
