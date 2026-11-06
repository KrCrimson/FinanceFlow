/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/controllers/cierres.controller.js
 * Capa / módulo ...: Backend · Controladores
 * Función .........: Recibe las solicitudes de arqueo diario, cierre mensual, reapertura, resumen del periodo y cierres pendientes.
 * Requerimientos ..: RF-21, RF-27, RF-28, RF-30, RF-40  (módulos: Panel, Cierres)
 * Calidad (RNF) ...: RNF-05
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 * Reglas de negocio : RN-11, RN-12, RN-14
 * Depende de ......: backend/services/cierres.service.js
 * Lo usan .........: backend/routes/cierres.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const cierresService = require('../services/cierres.service');

module.exports = {
  crearCierre: async (req, res) => {
    try {
      const cierre = await cierresService.crearCierre(req.user.id, req.body);
      res.status(201).json(cierre);
    } catch (error) {
      if (error.message === 'Contraseña incorrecta') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },

  obtenerResumen: async (req, res) => {
    try {
      const { tipo, periodo } = req.query;
      if (!tipo || !periodo) {
        return res.status(400).json({ error: 'tipo y periodo son requeridos' });
      }
      const resumen = await cierresService.obtenerResumenPeriodo(req.user.id, tipo, periodo);
      res.json(resumen);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  listarCierres: async (req, res) => {
    try {
      const cierres = await cierresService.listarCierres(req.user.id);
      res.json(cierres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  obtenerPendientes: async (req, res) => {
    try {
      const { localDate } = req.query;
      const pendientes = await cierresService.obtenerCierresPendientes(req.user.id, localDate);
      res.json(pendientes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  reabrirCierre: async (req, res) => {
    try {
      const result = await cierresService.reabrirCierre(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      if (error.message === 'Contraseña incorrecta') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
};
