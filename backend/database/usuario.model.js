const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	passwordHash: {
		type: String,
		required: true,
	},
	creadoEn: {
		type: Date,
		default: Date.now,
	},
	actualizadoEn: {
		type: Date,
		default: Date.now,
	},
	estado: {
		type: String,
		enum: ['activo', 'inactivo'],
		default: 'activo',
	},
	rol: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	fondoFijo: {
		type: Number,
		default: 1000,
	},
	resetPasswordToken: {
		type: String,
		default: null,
	},
	resetPasswordExpires: {
		type: Date,
		default: null,
	},
	esPremium: {
		type: Boolean,
		default: false,
	},
	planTipo: {
		type: String,
		enum: ['free', 'pro'],
		default: 'free',
	},
	conteoOcrMes: {
		type: Number,
		default: 0,
	},
	ultimoReinicioOcr: {
		type: Date,
		default: Date.now,
	},
	lastPaymentId: {
		type: String,
		default: null,
	},
});

usuarioSchema.pre('save', function () {
	this.actualizadoEn = new Date();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
