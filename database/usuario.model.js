/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: database/usuario.model.js
 * Capa / módulo ...: Base de datos · Modelo
 * Función .........: Copia antigua del modelo de usuario (vigente en backend/database).
 * Requerimientos ..: RF-01  (módulos: Cuenta)
 * Casos de uso ....: CU-01 Registrar cuenta
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
});

usuarioSchema.pre('save', function () {
	this.actualizadoEn = new Date();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
