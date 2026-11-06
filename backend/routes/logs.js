/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/routes/logs.js
 * Capa / módulo ...: Backend · Rutas
 * Función .........: Define las direcciones para registrar y consultar eventos del sistema.
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Depende de ......: backend/controllers/logs.controller.js
 *                    backend/middlewares/auth.js
 * Lo usan .........: backend/routes/index.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
