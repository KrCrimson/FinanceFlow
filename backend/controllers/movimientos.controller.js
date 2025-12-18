// Controlador de movimientos (esqueleto)
const movimientosService = require('../services/movimientos.service');

module.exports = {
  crearMovimiento: async (req, res) => {
    try {
      const movimientoData = { ...req.body, userId: req.user.id };
      const movimiento = await movimientosService.crearMovimiento(movimientoData);
      res.status(201).json(movimiento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  listarMovimientos: async (req, res) => {
    try {
      const movimientos = await movimientosService.listarMovimientos(req.user.id);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  editarMovimiento: async (req, res) => {
    try {
      const movimiento = await movimientosService.editarMovimiento(req.params.id, req.body);
      res.json(movimiento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  inhabilitarMovimiento: async (req, res) => {
    try {
      const movimiento = await movimientosService.inhabilitarMovimiento(req.params.id);
      res.json(movimiento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
