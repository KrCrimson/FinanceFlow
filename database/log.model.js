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
