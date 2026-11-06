/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: database/database.js
 * Capa / módulo ...: Base de datos · Conexión
 * Función .........: Copia antigua de la conexión con la base de datos (la vigente está en backend/database).
 * Calidad (RNF) ...: RNF-14
 * Lo usan .........: database/test_connection.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const mongoose = require('mongoose');
// Cargar variables de entorno desde la raíz del proyecto
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(mongoUri);
		console.log('MongoDB conectado');
	} catch (error) {
		console.error('Error al conectar a MongoDB:', error);
		process.exit(1);
	}
};

module.exports = connectDB;
