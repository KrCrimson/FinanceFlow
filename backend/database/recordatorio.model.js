/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/recordatorio.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define el recordatorio de préstamo o pago pendiente: tipo, descripción, monto, contacto, vencimiento y estado.
 * Requerimientos ..: RF-31, RF-32  (módulos: Recordatorios)
 * Casos de uso ....: CU-20 Gestionar préstamos y recordatorios
 * Reglas de negocio : RN-21, RN-25
 * Lo usan .........: backend/routes/recordatorios.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require("mongoose");

const recordatorioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  tipo: {
    type: String,
    enum: ["prestamo_recibido", "prestamo_otorgado", "pago_pendiente"],
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  monto: {
    type: Number,
    required: true,
    min: 0,
  },
  fechaVencimiento: {
    type: Date,
    required: true,
  },
  contacto: {
    type: String,
    trim: true,
    default: "",
  },
  estado: {
    type: String,
    enum: ["pendiente", "pagado"],
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

recordatorioSchema.pre("save", function () {
  this.actualizadoEn = Date.now();
});

const Recordatorio = mongoose.model("Recordatorio", recordatorioSchema);
module.exports = Recordatorio;
