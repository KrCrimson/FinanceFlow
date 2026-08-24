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

    // Verificar si la fecha está en el futuro
    const fechaMov = data.fecha ? new Date(data.fecha) : new Date();
    const todayStr = new Date().toISOString().slice(0, 10);
    const fechaMovStr = fechaMov.toISOString().slice(0, 10);
    if (fechaMovStr > todayStr) {
      throw new Error('No se pueden registrar movimientos en fechas futuras');
    }

    // Verificar si el periodo está cerrado
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
      estado: data.estado || 'activo',
      esRecurrente: !!data.esRecurrente,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });
    await movimiento.save();
    return movimiento;
  },

  listarMovimientos: async (userId) => {
    // 1. Obtener todos los movimientos del usuario
    let movimientos = await Movimiento.find({ userId }).sort({ creadoEn: -1 });

    // 2. Auto-generar ingresos constantes recurrentes si la fecha del mes actual ya superó el día de cobro
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0 - 11
      const currentDay = today.getDate();

      const recurrentes = movimientos.filter(
        (m) => m.tipo === 'ingreso' && m.esRecurrente && m.estado === 'activo'
      );

      for (const rec of recurrentes) {
        const fechaRec = new Date(rec.fecha);
        const dayOfMonth = fechaRec.getDate(); // Ej: 15

        // Si hoy ya pasó o es el día de cobro de este mes (ej: día 15 o posterior)
        if (currentDay >= dayOfMonth) {
          // Verificar si ya existe un movimiento generado para el mes y año actual
          const yaExisteEsteMes = movimientos.some((m) => {
            const f = new Date(m.fecha);
            return (
              m.nombre === rec.nombre &&
              m.monto === rec.monto &&
              f.getFullYear() === currentYear &&
              f.getMonth() === currentMonth
            );
          });

          if (!yaExisteEsteMes) {
            // Crear automáticamente el movimiento del nuevo mes
            const nuevaFecha = new Date(currentYear, currentMonth, dayOfMonth);
            const nuevoMov = new Movimiento({
              tipo: 'ingreso',
              nombre: rec.nombre,
              monto: rec.monto,
              categoria: rec.categoria,
              userId: userId,
              fecha: nuevaFecha,
              estado: 'activo',
              esRecurrente: true,
              creadoEn: new Date(),
              actualizadoEn: new Date()
            });
            await nuevoMov.save();
            movimientos.unshift(nuevoMov);
          }
        }
      }
    } catch (e) {
      console.error('Error en auto-generación de ingresos constantes:', e);
    }

    return movimientos;
  },

  editarMovimiento: async (id, data, userId) => {
    const existingMovimiento = await Movimiento.findById(id);
    if (!existingMovimiento) throw new Error('Movimiento no encontrado');
    
    if (existingMovimiento.userId.toString() !== userId) {
      throw new Error('No autorizado para modificar este movimiento');
    }

    // Si es un movimiento planificado o se modifica solo la recurrencia, no afecta periodos cerrados históricos
    const isPlanificado = existingMovimiento.estado === 'planificado';
    const isOnlyTogglingRecurrence = Object.keys(data).every((k) => k === 'esRecurrente');

    if (!isOnlyTogglingRecurrence && !isPlanificado) {
      const isClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, existingMovimiento.fecha);
      if (isClosed) {
        throw new Error('No se puede modificar un movimiento perteneciente a un período cerrado');
      }
    }

    if (data.fecha !== undefined) {
      const isNewPeriodClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, data.fecha);
      if (isNewPeriodClosed && !isPlanificado) {
        throw new Error('No se puede trasladar un movimiento a un período cerrado');
      }
      
      const todayStr = new Date().toISOString().slice(0, 10);
      const newFechaStr = new Date(data.fecha).toISOString().slice(0, 10);
      if (newFechaStr > todayStr && !isPlanificado) {
        throw new Error('No se pueden trasladar movimientos a fechas futuras');
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

  inhabilitarMovimiento: async (id, userId) => {
    const existingMovimiento = await Movimiento.findById(id);
    if (!existingMovimiento) throw new Error('Movimiento no encontrado');

    if (existingMovimiento.userId.toString() !== userId) {
      throw new Error('No autorizado para modificar este movimiento');
    }

    const isPlanificado = existingMovimiento.estado === 'planificado';
    if (!isPlanificado) {
      const isClosed = await cierresService.esPeriodoCerrado(existingMovimiento.userId, existingMovimiento.fecha);
      if (isClosed) {
        throw new Error('No se puede desactivar un movimiento perteneciente a un período cerrado');
      }
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
