/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/services/logs.service.js
 * Capa / módulo ...: Backend · Servicios (lógica)
 * Función .........: Guarda y consulta los eventos del sistema (esqueleto).
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Depende de ......: backend/database/log.model.js
 * Lo usan .........: backend/controllers/logs.controller.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Servicio de logs (esqueleto)
const Log = require('../database/log.model');

module.exports = {
  crearLog: async (data) => {
    const log = new Log({
      accion: data.accion,
      usuarioId: data.usuarioId,
      movimientoId: data.movimientoId,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      descripcion: data.descripcion,
    });
    await log.save();
    return log;
  },
  listarLogs: async () => {
    return await Log.find();
  },
  inhabilitarLog: async (id) => {
    const log = await Log.findByIdAndUpdate(
      id,
      { descripcion: '[INHABILITADO] ' + new Date().toISOString() },
      { new: true }
    );
    if (!log) throw new Error('Log no encontrado');
    return log;
  },
};
