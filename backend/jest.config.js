/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/jest.config.js
 * Capa / módulo ...: Backend · Configuración de pruebas
 * Función .........: Define cómo se ejecutan y qué miden las pruebas automáticas del backend.
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// jest.config.js para soporte ESM
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  // Umbral mínimo de cobertura (se exige con `npm run test:ci`). Meta del curso: >= 70 % de líneas.
  coverageThreshold: {
    global: { statements: 70, branches: 55, functions: 60, lines: 70 },
  },
};
