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
