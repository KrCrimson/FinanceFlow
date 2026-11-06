/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/pago.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define el registro de pago del Plan Pro: método, monto, número de operación, estado y fecha.
 * Requerimientos ..: RF-34, RF-36  (módulos: Plan Pro, Administración)
 * Casos de uso ....: CU-19 Contratar el Plan Pro
 *                    CU-22 Administrar la plataforma
 * Reglas de negocio : RN-17
 * Lo usan .........: backend/integration/flujo-completo.itest.js
 *                    backend/routes/admin.router.js
 *                    backend/routes/pagos.router.js
 *                    backend/scripts/aprobar-pago.js
 * Pruebas .........: backend/__tests__/admin.unit.test.js
 *                    backend/__tests__/pagos.culqi.test.js
 *                    backend/__tests__/pagos.unit.test.js
 *                    backend/__tests__/security.unit.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  metodo: {
    type: String,
    enum: ["yape", "bcp", "culqi", "card"],
    default: "yape",
  },
  nroOperacion: {
    type: String,
    required: true,
    trim: true,
  },
  monto: {
    type: Number,
    default: 19.9, // Precio promocional Pro
  },
  estado: {
    type: String,
    enum: ["pendiente", "aprobado", "rechazado"],
    default: "pendiente",
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
  actualizadoEn: {
    type: Date,
    default: Date.now,
  },
});

pagoSchema.pre("save", function () {
  this.actualizadoEn = new Date();
});

const Pago = mongoose.model("Pago", pagoSchema);
module.exports = Pago;
