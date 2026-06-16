const express = require('express');
const router = express.Router();
const cierresController = require('../controllers/cierres.controller');
const auth = require('../middlewares/auth');

// Crear un cierre
router.post('/', auth, cierresController.crearCierre);

// Obtener resumen de un periodo
router.get('/resumen', auth, cierresController.obtenerResumen);

// Listar cierres
router.get('/', auth, cierresController.listarCierres);

// Obtener cierres pendientes
router.get('/pendientes', auth, cierresController.obtenerPendientes);

module.exports = router;
