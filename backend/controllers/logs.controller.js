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
