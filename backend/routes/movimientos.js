/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/routes/movimientos.js
 * Capa / módulo ...: Backend · Rutas
 * Función .........: Define las direcciones de movimientos y de lectura de comprobantes (todas con sesión).
 * Requerimientos ..: RF-09 a RF-17
 * Calidad (RNF) ...: RNF-03
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 * Reglas de negocio : RN-02
 * Depende de ......: backend/controllers/movimientos.controller.js
 *                    backend/middlewares/auth.js
 *                    backend/middlewares/validate.js
 *                    backend/schemas/movimiento.schema.js
 * Lo usan .........: backend/routes/index.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
