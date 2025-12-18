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
		enum: ['activo', 'inactivo'],
		default: 'activo',
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
