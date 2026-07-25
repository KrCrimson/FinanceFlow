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
    enum: ["yape", "bcp"],
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
