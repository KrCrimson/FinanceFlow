// Servicio de movimientos (esqueleto)
const Movimiento = require('../../database/movimiento.model');

module.exports = {
  crearMovimiento: async (data) => {
    // Validación robusta
    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length < 2) {
      throw new Error('El nombre es requerido y debe tener al menos 2 caracteres');
    }
    if (!data.tipo || !['ingreso', 'egreso'].includes(data.tipo)) {
      throw new Error('El tipo debe ser ingreso o egreso');
    }
    if (!data.monto || typeof data.monto !== 'number' || data.monto <= 0) {
      throw new Error('El monto debe ser un número positivo');
    }
    if (!data.categoria || typeof data.categoria !== 'string') {
      throw new Error('La categoría es requerida');
    }
    if (!data.userId) {
      throw new Error('userId es requerido');
    }
    const movimiento = new Movimiento({
      tipo: data.tipo,
      nombre: data.nombre.trim(),
      monto: data.monto,
      categoria: data.categoria.trim(),
      userId: data.userId,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      estado: 'activo',
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });
    await movimiento.save();
    return movimiento;
  },
  listarMovimientos: async (userId) => {
    return await Movimiento.find({ userId }).sort({ creadoEn: -1 });
  },
  editarMovimiento: async (id, data) => {
    const movimiento = await Movimiento.findByIdAndUpdate(
      id,
      {
        tipo: data.tipo,
        nombre: data.nombre,
        monto: data.monto,
        fecha: data.fecha ? new Date(data.fecha) : new Date(),
        actualizadoEn: new Date(),
      },
      { new: true }
    );
    if (!movimiento) throw new Error('Movimiento no encontrado');
    return movimiento;
  },
  inhabilitarMovimiento: async (id) => {
    const movimiento = await Movimiento.findByIdAndUpdate(
      id,
      { estado: 'inactivo', actualizadoEn: new Date() },
      { new: true }
    );
    if (!movimiento) throw new Error('Movimiento no encontrado');
    return movimiento;
  },
};
