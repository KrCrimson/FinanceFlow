/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/movimiento.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define el movimiento (ingreso o egreso): nombre, monto, categoría, fecha, estado (activo, inactivo, planificado), indicador de ingreso constante y descripción.
 * Requerimientos ..: RF-09, RF-10, RF-13, RF-17, RF-25  (módulos: Movimientos, Planificador)
 * Calidad (RNF) ...: RNF-12
 * Casos de uso ....: CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 * Reglas de negocio : RN-03, RN-04, RN-05, RN-06, RN-19
 * Lo usan .........: backend/integration/flujo-completo.itest.js
 *                    backend/services/cierres.service.js
 *                    backend/services/movimientos.service.js
 * Pruebas .........: backend/__tests__/admin.unit.test.js
 *                    backend/__tests__/cierres.service.test.js
 *                    backend/__tests__/movimientos.service.test.js
 *                    backend/__tests__/movimientos.unit.test.js
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
