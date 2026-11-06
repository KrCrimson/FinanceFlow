/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/babel.config.js
 * Capa / módulo ...: Backend · Configuración de pruebas
 * Función .........: Configura la traducción de código que necesitan las pruebas automáticas.
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' }
      }
    ]
  ]
};
