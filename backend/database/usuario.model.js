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
});

usuarioSchema.pre('save', function () {
	this.actualizadoEn = new Date();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
