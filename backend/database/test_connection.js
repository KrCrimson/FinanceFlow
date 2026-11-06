/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/test_connection.js
 * Capa / módulo ...: Backend · Utilitario de desarrollo
 * Función .........: Script manual que comprueba la conexión con la base de datos.
 * Calidad (RNF) ...: RNF-14
 * Depende de ......: backend/database/database.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const connectDB = require('./database');

connectDB();
