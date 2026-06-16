const mongoose = require('mongoose');

const cierreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['diario', 'mensual'],
    required: true,
  },
  periodo: {
    type: String,
    required: true, // "YYYY-MM-DD" para diarios o "YYYY-MM" para mensuales
  },
  fondoFijo: {
    type: Number,
    required: true,
    default: 1000,
  },
  ingresosTotales: {
    type: Number,
    required: true,
    min: 0,
  },
  egresosTotales: {
    type: Number,
    required: true,
    min: 0,
  },
  saldoEsperado: {
    type: Number,
    required: true,
  },
  saldoFisico: {
    type: Number,
    required: true,
  },
  diferencia: {
    type: Number,
    required: true,
  },
  comentarios: {
    type: String,
    trim: true,
    default: '',
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

// Index único para evitar duplicación de cierres
cierreSchema.index({ userId: 1, tipo: 1, periodo: 1 }, { unique: true });

const Cierre = mongoose.model('Cierre', cierreSchema);
module.exports = Cierre;
