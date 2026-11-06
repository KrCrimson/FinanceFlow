/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: database/log.model.js
 * Capa / módulo ...: Base de datos · Modelo
 * Función .........: Copia antigua del modelo de eventos (vigente en backend/database).
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
	accion: {
		type: String,
		required: true,
	},
	usuarioId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Usuario',
		required: true,
	},
	movimientoId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movimiento',
		required: false,
	},
	fecha: {
		type: Date,
		default: Date.now,
	},
	descripcion: {
		type: String,
		required: false,
	},
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
