// Aquí se importarán y combinarán las rutas principales
const express = require('express');
const router = express.Router();

// Ejemplo:
router.use('/usuarios', require('./usuarios'));
router.use('/movimientos', require('./movimientos'));
router.use('/logs', require('./logs'));

module.exports = router;
