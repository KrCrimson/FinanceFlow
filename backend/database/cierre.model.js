/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/cierre.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define el arqueo diario y el cierre mensual (totales, saldo esperado, dinero contado, diferencia, comentario); impide dos cierres del mismo tipo y periodo.
 * Requerimientos ..: RF-27, RF-28, RF-40  (módulos: Cierres)
 * Calidad (RNF) ...: RNF-13
 * Casos de uso ....: CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 * Reglas de negocio : RN-11, RN-12
 * Lo usan .........: backend/services/cierres.service.js
 * Pruebas .........: backend/__tests__/cierres.service.test.js
 *                    backend/__tests__/cierres.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
