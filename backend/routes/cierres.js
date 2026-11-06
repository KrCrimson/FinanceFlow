/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/routes/cierres.js
 * Capa / módulo ...: Backend · Rutas
 * Función .........: Define las direcciones de cierres: crear, reabrir, listar, resumen y pendientes.
 * Requerimientos ..: RF-21, RF-27 a RF-30  (módulos: Panel)
 * Calidad (RNF) ...: RNF-05
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 * Reglas de negocio : RN-14
 * Depende de ......: backend/controllers/cierres.controller.js
 *                    backend/middlewares/auth.js
 * Lo usan .........: backend/routes/index.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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

// Reabrir un periodo
router.post('/reabrir', auth, cierresController.reabrirCierre);

module.exports = router;
