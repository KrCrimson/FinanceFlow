// Servicio de logs (esqueleto)
const Log = require('../database/log.model');

module.exports = {
  crearLog: async (data) => {
    const log = new Log({
      accion: data.accion,
      usuarioId: data.usuarioId,
      movimientoId: data.movimientoId,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      descripcion: data.descripcion,
    });
    await log.save();
    return log;
  },
  listarLogs: async () => {
    return await Log.find();
  },
  inhabilitarLog: async (id) => {
    const log = await Log.findByIdAndUpdate(
      id,
      { descripcion: '[INHABILITADO] ' + new Date().toISOString() },
      { new: true }
    );
    if (!log) throw new Error('Log no encontrado');
    return log;
  },
};
