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
  crearMovimientoHistorico: async (req, res) => {
    try {
      const movimiento = await movimientosService.crearMovimientoHistorico(req.user.id, req.body);
      res.status(201).json(movimiento);
    } catch (error) {
      if (error.message === 'Contraseña incorrecta') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  },
  analizarComprobante: async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Se requiere la imagen en base64' });
      }
      const ocrService = require('../services/ocr.service');
      const data = await ocrService.analizarComprobante(imageBase64, mimeType);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
