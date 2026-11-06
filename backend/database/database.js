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
