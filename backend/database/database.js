/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/database/database.js
 * Capa / módulo ...: Backend · Datos
 * Función .........: Abre la conexión con la base de datos que usa todo el sistema.
 * Calidad (RNF) ...: RNF-14, RNF-15
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-07 Cargar comprobante por imagen
 *                    CU-08 Desactivar movimiento
 *                    CU-09 Visualizar reportes y gráficos
 *                    CU-10 Filtrar historial de movimientos
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-13 Cerrar sesión
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-20 Gestionar préstamos y recordatorios
 *                    CU-21 Exportar reportes a Excel y PDF
 *                    CU-22 Administrar la plataforma
 * Lo usan .........: backend/app.js
 *                    backend/database/test_connection.js
 *                    backend/scripts/aprobar-pago.js
 *                    backend/scripts/change-password.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');
// Cargar variables de entorno desde la raíz del proyecto
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

let mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
	if (process.env.NODE_ENV === 'test') {
		console.log('MongoDB connection skipped in test environment');
		return;
	}

	const isPlaceholder = !mongoUri || mongoUri.includes('usuario:password') || mongoUri.includes('cluster.mongodb.net');

	if (!isPlaceholder) {
		try {
			await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
			console.log('MongoDB conectado');
			return;
		} catch (error) {
			console.warn(`No se pudo conectar a MongoDB URI (${error.message}).`);
		}
	}

	// Fallback para desarrollo local si no hay base de datos remota/local activa
	if (process.env.NODE_ENV !== 'production') {
		try {
			console.log('Iniciando instancia en memoria de MongoDB (MongoMemoryServer) para desarrollo...');
			const { MongoMemoryServer } = require('mongodb-memory-server');
			const mongod = await MongoMemoryServer.create();
			const memoryUri = mongod.getUri();
			await mongoose.connect(memoryUri);
			console.log(`MongoDB conectado en memoria para desarrollo local: ${memoryUri}`);
			return;
		} catch (memError) {
			console.error('Error al iniciar MongoDB en memoria:', memError);
		}
	}

	console.error('Error fatal: No se pudo establecer conexión con ninguna base de datos MongoDB.');
	process.exit(1);
};

module.exports = connectDB;
