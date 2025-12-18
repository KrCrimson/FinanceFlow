const express = require('express');
const router = express.Router();
// Controlador de logs se importará aquí
const logsController = require('../controllers/logs.controller');
const auth = require('../middlewares/auth');

// Ejemplo de endpoint:

// Crear log
router.post('/', auth, logsController.crearLog);
// Listar logs
router.get('/', auth, logsController.listarLogs);
// Inhabilitar log
router.patch('/:id/inhabilitar', auth, logsController.inhabilitarLog);

module.exports = router;
