/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/usuario.model.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Define la cuenta de usuario: nombre, correo único, contraseña protegida, estado, rol, plan (Free/Pro), fondo fijo (S/ 1,000.00 por defecto), contador de lecturas de comprobantes y datos del enlace de recuperación.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-16, RF-33, RF-40  (módulos: Cuenta, Perfil, Comprobantes, Plan Pro, Cierres)
 * Calidad (RNF) ...: RNF-01
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-12 Gestionar información de perfil
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 * Reglas de negocio : RN-01, RN-15, RN-20, RN-23, RN-24
 * Lo usan .........: backend/controllers/movimientos.controller.js
 *                    backend/integration/flujo-completo.itest.js
 *                    backend/jest.setup.js
 *                    backend/middlewares/auth.js
 *                    backend/middlewares/isAdmin.js
 *                    backend/routes/admin.router.js
 *                    backend/routes/pagos.router.js
 *                    backend/scripts/aprobar-pago.js
 *                    backend/scripts/change-password.js
 *                    backend/services/cierres.service.js
 *                    backend/services/movimientos.service.js
 *                    backend/services/usuarios.service.js
 * Pruebas .........: backend/__tests__/admin.unit.test.js
 *                    backend/__tests__/cierres.service.test.js
 *                    backend/__tests__/cierres.test.js
 *                    backend/__tests__/logs.controller.test.js
 *                    backend/__tests__/movimientos.service.test.js
 *                    backend/__tests__/movimientos.unit.test.js
 *                    backend/__tests__/pagos.culqi.test.js
 *                    backend/__tests__/pagos.unit.test.js
 *                    backend/__tests__/recuperacion.test.js
 *                    backend/__tests__/rutas.movimientos-cierres.test.js
 *                    backend/__tests__/security.unit.test.js
 *                    backend/__tests__/usuarios.controller.test.js
 *                    backend/__tests__/usuarios.service.test.js
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
