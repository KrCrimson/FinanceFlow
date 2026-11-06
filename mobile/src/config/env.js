/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: mobile/src/config/env.js
 * Capa / módulo ...: Prototipo móvil · Fuera del alcance de esta versión (SRS III.4)
 * Función .........: Dirección de la API del prototipo móvil.
 * Lo usan .........: mobile/src/services/api.js
 * Pruebas .........: mobile/__tests__/api.test.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Conectarse al backend de producción en Render
export const API_URL = 'https://financeflow-backend-4fbw.onrender.com/api';

console.log('📡 FinanceFlow Mobile API URL configurada (Render Cloud Real):', API_URL);
