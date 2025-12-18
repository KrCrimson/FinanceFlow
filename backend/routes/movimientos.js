const express = require('express');
const router = express.Router();
// Controlador de movimientos se importará aquí
const movimientosController = require('../controllers/movimientos.controller');

// Ejemplo de endpoint:

const auth = require('../middlewares/auth');
// Crear movimiento
router.post('/', auth, movimientosController.crearMovimiento);
// Listar movimientos
router.get('/', auth, movimientosController.listarMovimientos);
// Editar movimiento
router.put('/:id', auth, movimientosController.editarMovimiento);
// Inhabilitar movimiento
router.patch('/:id/inhabilitar', auth, movimientosController.inhabilitarMovimiento);
// Inactivar movimiento (alias para inhabilitar)
router.patch('/:id/inactivar', auth, movimientosController.inhabilitarMovimiento);

module.exports = router;
