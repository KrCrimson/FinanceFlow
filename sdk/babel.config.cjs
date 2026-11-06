/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: sdk/babel.config.cjs
 * Capa / módulo ...: SDK · Configuración de pruebas
 * Función .........: Configura la traducción de código que necesitan las pruebas del SDK.
 * Calidad (RNF) ...: RNF-13
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
