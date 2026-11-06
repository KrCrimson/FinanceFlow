/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/routes/index.js
 * Capa / módulo ...: Backend · Rutas
 * Función .........: Reúne todas las rutas de la API bajo un solo punto de entrada.
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-21 Exportar reportes a Excel y PDF
 *                    CU-22 Administrar la plataforma
 * Depende de ......: backend/middlewares/auth.js
 *                    backend/middlewares/isAdmin.js
 *                    backend/routes/admin.router.js
 *                    backend/routes/cierres.js
 *                    backend/routes/logs.js
 *                    backend/routes/movimientos.js
 *                    backend/routes/pagos.router.js
 *                    backend/routes/recordatorios.js
 *                    backend/routes/usuarios.js
 * Lo usan .........: backend/app.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Aquí se importarán y combinarán las rutas principales
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Rutas públicas o protegidas individualmente
router.use("/usuarios", require("./usuarios"));
router.use("/movimientos", require("./movimientos"));
router.use("/recordatorios", require("./recordatorios"));

// Pagos (algunas rutas son webhooks públicos)
router.use("/pagos", require("./pagos.router"));

// Rutas estrictamente para administradores
router.use("/admin", auth, isAdmin, require("./admin.router"));
router.use("/logs", auth, isAdmin, require("./logs"));

// Cierres es usado por los usuarios normales para cerrar sus propios periodos
router.use("/cierres", require("./cierres"));

module.exports = router;
