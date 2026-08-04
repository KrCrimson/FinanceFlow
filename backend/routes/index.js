// Aquí se importarán y combinarán las rutas principales
const express = require("express");
const router = express.Router();

// Ejemplo:
router.use("/usuarios", require("./usuarios"));
router.use("/movimientos", require("./movimientos"));
router.use("/logs", require("./logs"));
router.use("/cierres", require("./cierres"));
router.use("/pagos", require("./pagos.router"));
router.use("/admin", require("./admin.router"));
router.use("/recordatorios", require("./recordatorios"));

module.exports = router;
