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
      const movimiento = await movimientosService.editarMovimiento(req.params.id, req.body, req.user.id);
      res.json(movimiento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  inhabilitarMovimiento: async (req, res) => {
    try {
      const movimiento = await movimientosService.inhabilitarMovimiento(req.params.id, req.user.id);
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

      const Usuario = require('../database/usuario.model');
      const LIMITE_FREE = 5;

      // 1. Verificar reinicio mensual si aplica
      const usuarioCheck = await Usuario.findById(req.user.id);
      if (!usuarioCheck) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const hoy = new Date();
      const ultimoReinicio = new Date(usuarioCheck.ultimoReinicioOcr || Date.now());
      if (hoy.getMonth() !== ultimoReinicio.getMonth() || hoy.getFullYear() !== ultimoReinicio.getFullYear()) {
        await Usuario.updateOne(
          { _id: req.user.id },
          { $set: { conteoOcrMes: 0, ultimoReinicioOcr: hoy } }
        );
      }

      // 2. Reserva atómica del cupo (previene race conditions concurrentes)
      const usuarioActualizado = await Usuario.findOneAndUpdate(
        {
          _id: req.user.id,
          $or: [
            { esPremium: true },
            { conteoOcrMes: { $lt: LIMITE_FREE } }
          ]
        },
        { $inc: { conteoOcrMes: 1 } },
        { new: true }
      );

      if (!usuarioActualizado) {
        return res.status(403).json({ 
          error: `Has alcanzado el límite mensual de ${LIMITE_FREE} escaneos. Actualiza a Pro para uso ilimitado.`,
          limiteAlcanzado: true 
        });
      }

      // 3. Procesar con Gemini OCR
      try {
        const ocrService = require('../services/ocr.service');
        const data = await ocrService.analizarComprobante(imageBase64, mimeType);
        return res.json({ success: true, data });
      } catch (ocrError) {
        // Reembolsar cupo atómicamente si el análisis OCR falló
        if (!usuarioActualizado.esPremium) {
          await Usuario.updateOne({ _id: req.user.id }, { $inc: { conteoOcrMes: -1 } });
        }
        throw ocrError;
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
