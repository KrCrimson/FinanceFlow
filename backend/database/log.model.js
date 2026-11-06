/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/log.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define el evento del sistema (acción, usuario, nivel, mensaje y fecha).
 * Requerimientos ..: RF-37  (módulos: Administración)
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Lo usan .........: backend/services/logs.service.js
 * Pruebas .........: backend/__tests__/logs.controller.test.js
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
