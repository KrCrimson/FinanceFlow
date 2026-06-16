const Movimiento = require('../database/movimiento.model');
const Usuario = require('../database/usuario.model');
const bcrypt = require('bcryptjs');
const cierresService = require('./cierres.service');

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

    // Verificar si el periodo está cerrado
    const fechaMov = data.fecha ? new Date(data.fecha) : new Date();
    const isClosed = await cierresService.esPeriodoCerrado(data.userId, fechaMov);
    if (isClosed) {
      throw new Error('No se pueden registrar movimientos en un período diario o mensual cerrado');
    }
    const movimiento = new Movimiento({
      tipo: data.tipo,
      nombre: data.nombre.trim(),
      monto: data.monto,
      categoria: data.categoria.trim(),
      userId: data.userId,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      estado: 'activo',
      esRecurrente: !!data.esRecurrente,
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
    const existingMovimiento = await Movimiento.findById(id);
    if (!existingMovimiento) throw new Error('Movimiento no encontrado');

    // Verificar si el periodo original está cerrado
    const isClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, existingMovimiento.fecha);
    if (isClosed) {
      throw new Error('No se puede modificar un movimiento perteneciente a un período cerrado');
    }

    // Verificar si el nuevo periodo (si se cambia la fecha) está cerrado
    if (data.fecha !== undefined) {
      const isNewPeriodClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, data.fecha);
      if (isNewPeriodClosed) {
        throw new Error('No se puede trasladar un movimiento a un período cerrado');
      }
    }

    const updatePayload = {
      actualizadoEn: new Date(),
    };
    if (data.tipo !== undefined) updatePayload.tipo = data.tipo;
    if (data.nombre !== undefined) updatePayload.nombre = data.nombre;
    if (data.monto !== undefined) updatePayload.monto = data.monto;
    if (data.categoria !== undefined) updatePayload.categoria = data.categoria;
    if (data.fecha !== undefined) updatePayload.fecha = new Date(data.fecha);
    if (data.esRecurrente !== undefined) updatePayload.esRecurrente = data.esRecurrente;
    if (data.estado !== undefined) updatePayload.estado = data.estado;

    const movimiento = await Movimiento.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );
    return movimiento;
  },
  inhabilitarMovimiento: async (id) => {
    const existingMovimiento = await Movimiento.findById(id);
    if (!existingMovimiento) throw new Error('Movimiento no encontrado');

    const isClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, existingMovimiento.fecha);
    if (isClosed) {
      throw new Error('No se puede desactivar un movimiento perteneciente a un período cerrado');
    }

    const movimiento = await Movimiento.findByIdAndUpdate(
      id,
      { estado: 'inactivo', actualizadoEn: new Date() },
      { new: true }
    );
    return movimiento;
  },
  crearMovimientoHistorico: async (userId, data) => {
    if (!data.password) {
      throw new Error('La contraseña es requerida para validación de seguridad');
    }
    const user = await Usuario.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const isOk = await bcrypt.compare(data.password, user.passwordHash);
    if (!isOk) {
      throw new Error('Contraseña incorrecta');
    }
    
    return await module.exports.crearMovimiento({
      tipo: data.tipo,
      nombre: data.nombre,
      monto: data.monto,
      categoria: data.categoria,
      userId: userId,
      fecha: data.fecha,
      esRecurrente: data.esRecurrente
    });
  },
};
