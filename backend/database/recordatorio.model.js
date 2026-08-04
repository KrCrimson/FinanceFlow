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
