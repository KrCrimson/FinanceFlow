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
