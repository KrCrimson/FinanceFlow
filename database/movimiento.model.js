/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: database/movimiento.model.js
 * Capa / módulo ...: Base de datos · Modelo
 * Función .........: Copia antigua del modelo de movimiento (vigente en backend/database).
 * Requerimientos ..: RF-09  (módulos: Movimientos)
 * Casos de uso ....: CU-06 Registrar movimiento manual
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
	tipo: {
		type: String,
		enum: ['ingreso', 'egreso'],
		required: true,
	},
	nombre: {
		type: String,
		required: true,
		trim: true,
	},
	monto: {
		type: Number,
		required: true,
		min: 0,
	},
	categoria: {
		type: String,
		required: true,
		trim: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true,
	},
	fecha: {
		type: Date,
		required: true,
	},
	estado: {
		type: String,
		enum: ['activo', 'inactivo', 'planificado'],
		default: 'activo',
	},
	esRecurrente: {
		type: Boolean,
		default: false,
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

movimientoSchema.pre('save', function() {
	this.actualizadoEn = Date.now();
});

const Movimiento = mongoose.model('Movimiento', movimientoSchema);
module.exports = Movimiento;
