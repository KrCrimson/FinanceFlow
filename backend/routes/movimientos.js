const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientos.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  crearMovimientoSchema,
  movimientoHistoricoSchema,
  analizarComprobanteSchema,
} = require('../schemas/movimiento.schema');

// Crear movimiento (validado)
router.post('/', auth, validate({ body: crearMovimientoSchema }), movimientosController.crearMovimiento);

// Listar movimientos
router.get('/', auth, movimientosController.listarMovimientos);

// Editar movimiento
router.put('/:id', auth, movimientosController.editarMovimiento);

// Inhabilitar movimiento
router.patch('/:id/inhabilitar', auth, movimientosController.inhabilitarMovimiento);

// Inactivar movimiento (alias para inhabilitar)
router.patch('/:id/inactivar', auth, movimientosController.inhabilitarMovimiento);

// Registrar movimiento historico (validado)
router.post('/historico', auth, validate({ body: movimientoHistoricoSchema }), movimientosController.crearMovimientoHistorico);

// Analizar comprobante con Gemini Vision OCR (validado)
router.post('/ocr', auth, validate({ body: analizarComprobanteSchema }), movimientosController.analizarComprobante);

module.exports = router;
