/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/controllers/logs.controller.js
 * Capa / módulo ...: Backend · Controladores
 * Función .........: Recibe y entrega los eventos y errores de operación del sistema (esqueleto).
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Depende de ......: backend/services/logs.service.js
 * Lo usan .........: backend/routes/logs.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Controlador de logs (esqueleto)
const logsService = require('../services/logs.service');

module.exports = {
  crearLog: async (req, res) => {
    try {
      const log = await logsService.crearLog(req.body);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  listarLogs: async (req, res) => {
    try {
      const logs = await logsService.listarLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  inhabilitarLog: async (req, res) => {
    try {
      const log = await logsService.inhabilitarLog(req.params.id);
      res.json(log);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
