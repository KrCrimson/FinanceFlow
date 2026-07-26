const mongoose = require('mongoose');
// Cargar variables de entorno desde la raíz del proyecto
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
	if (process.env.NODE_ENV === 'test') {
		console.log('MongoDB connection skipped in test environment');
		return;
	}
	try {
		await mongoose.connect(mongoUri);
		console.log('MongoDB conectado');
	} catch (error) {
		console.error('Error al conectar a MongoDB:', error);
		if (process.env.NODE_ENV === 'test') {
			console.log('Bypassing process.exit(1) in test environment');
			return;
		}
		process.exit(1);
	}
};

module.exports = connectDB;
