const Cierre = require('../database/cierre.model');
const Movimiento = require('../database/movimiento.model');
const Usuario = require('../database/usuario.model');
const bcrypt = require('bcryptjs');

// Helper para parsear fechas de inicio y fin de un periodo
function obtenerLimitesPeriodo(tipo, periodo) {
  let start, end;
  if (tipo === 'diario') {
    // "YYYY-MM-DD"
    start = new Date(periodo + 'T00:00:00.000Z');
    end = new Date(periodo + 'T23:59:59.999Z');
  } else {
    // "YYYY-MM"
    const [year, month] = periodo.split('-');
    start = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0, 0));
    end = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));
  }
  return { start, end };
}

module.exports = {
  // Obtener resumen de ingresos y egresos de un periodo
  obtenerResumenPeriodo: async (userId, tipo, periodo) => {
    const { start, end } = obtenerLimitesPeriodo(tipo, periodo);

    const movimientos = await Movimiento.find({
      userId,
      estado: 'activo',
      fecha: { $gte: start, $lte: end }
    });

    let ingresosTotales = 0;
    let egresosTotales = 0;

    movimientos.forEach(m => {
      if (m.tipo === 'ingreso') {
        ingresosTotales += m.monto;
      } else if (m.tipo === 'egreso') {
        egresosTotales += m.monto;
      }
    });

    return {
      ingresosTotales,
      egresosTotales,
      count: movimientos.length
    };
  },

  // Crear un nuevo cierre
  crearCierre: async (userId, data) => {
    const { tipo, periodo, fondoFijo, saldoFisico, comentarios, password } = data;

    if (!tipo || !['diario', 'mensual'].includes(tipo)) {
      throw new Error('El tipo de cierre debe ser diario o mensual');
    }
    if (!periodo) {
      throw new Error('El periodo es requerido');
    }
    if (saldoFisico === undefined || typeof saldoFisico !== 'number' || saldoFisico < 0) {
      throw new Error('El saldo físico es requerido y debe ser un número no negativo');
    }
    // 1. Validar la contraseña (solo para cierre mensual)
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (tipo === 'mensual') {
      if (!password) {
        throw new Error('La contraseña es requerida para confirmar esta acción irreversible');
      }
      const isOk = await bcrypt.compare(password, usuario.passwordHash);
      if (!isOk) {
        throw new Error('Contraseña incorrecta');
      }
    }

    // 2. Verificar si ya existe un cierre para ese periodo
    const cierreExistente = await Cierre.findOne({ userId, tipo, periodo });
    if (cierreExistente) {
      throw new Error(`Ya existe un cierre ${tipo} para el periodo ${periodo}`);
    }

    // 3. Obtener el resumen de transacciones
    const resumen = await module.exports.obtenerResumenPeriodo(userId, tipo, periodo);

    const ff = fondoFijo !== undefined ? Number(fondoFijo) : (usuario.fondoFijo || 1000);
    const saldoEsperado = ff + resumen.ingresosTotales - resumen.egresosTotales;
    const diferencia = saldoFisico - saldoEsperado;

    // 4. Crear el cierre
    const cierre = new Cierre({
      userId,
      tipo,
      periodo,
      fondoFijo: ff,
      ingresosTotales: resumen.ingresosTotales,
      egresosTotales: resumen.egresosTotales,
      saldoEsperado,
      saldoFisico,
      diferencia,
      comentarios: comentarios || '',
      creadoEn: new Date()
    });

    await cierre.save();
    return cierre;
  },

  // Verificar si una fecha está dentro de algún periodo cerrado (bloqueado por cierre mensual)
  esPeriodoCerrado: async (userId, fechaToCheck) => {
    const date = new Date(fechaToCheck);
    if (isNaN(date.getTime())) return false;

    const periodoMensual = date.toISOString().slice(0, 7); // YYYY-MM

    // 1. Auto-cierre automático de meses con más de 2 meses de antigüedad (ej: si hoy es junio 2026, abril 2026 y anteriores están cerrados)
    const today = new Date();
    const currentPeriodo = today.toISOString().slice(0, 7); // YYYY-MM
    const [y1, m1] = periodoMensual.split('-').map(Number);
    const [y2, m2] = currentPeriodo.split('-').map(Number);
    const diferenciaMeses = (y2 - y1) * 12 + (m2 - m1);
    
    if (diferenciaMeses >= 2) {
      return true;
    }

    // 2. Buscar si hay cierres mensuales manuales para este usuario en ese periodo
    const cierre = await Cierre.findOne({
      userId,
      tipo: 'mensual',
      periodo: periodoMensual
    });

    return !!cierre;
  },

  // Obtener lista de cierres realizados
  listarCierres: async (userId) => {
    return await Cierre.find({ userId }).sort({ periodo: -1 });
  },

  // Obtener cierres pendientes y sus resúmenes rápidos
  obtenerCierresPendientes: async (userId, localDateStr) => {
    if (!localDateStr) {
      localDateStr = new Date().toISOString().slice(0, 10);
    }

    // Calcular "ayer"
    const today = new Date(localDateStr + 'T00:00:00.000Z');
    const yesterdayDate = new Date(today);
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

    // Calcular "mes anterior"
    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth(); // 0-indexed
    let prevYear = currentYear;
    let prevMonth = currentMonth; // si es enero (0), se convierte en diciembre (11) del año anterior
    if (currentMonth === 0) {
      prevYear -= 1;
      prevMonth = 12;
    }
    const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    // Verificar si ayer está cerrado
    const cierreAyer = await Cierre.findOne({ userId, tipo: 'diario', periodo: yesterdayStr });
    // Verificar si el mes anterior está cerrado
    const cierreMesAnterior = await Cierre.findOne({ userId, tipo: 'mensual', periodo: prevMonthStr });

    // Obtener los datos del resumen si están pendientes
    let resumenAyer = null;
    if (!cierreAyer) {
      resumenAyer = await module.exports.obtenerResumenPeriodo(userId, 'diario', yesterdayStr);
    }

    let resumenMesAnterior = null;
    if (!cierreMesAnterior) {
      resumenMesAnterior = await module.exports.obtenerResumenPeriodo(userId, 'mensual', prevMonthStr);
    }

    return {
      yesterday: {
        date: yesterdayStr,
        isClosed: !!cierreAyer,
        resumen: resumenAyer
      },
      prevMonth: {
        periodo: prevMonthStr,
        isClosed: !!cierreMesAnterior,
        resumen: resumenMesAnterior
      }
    };
  },

  // Reabrir un periodo (eliminar el cierre)
  reabrirCierre: async (userId, data) => {
    const { tipo, periodo, password } = data;

    if (!tipo || !['diario', 'mensual'].includes(tipo)) {
      throw new Error('El tipo de cierre debe ser diario o mensual');
    }
    if (!periodo) {
      throw new Error('El periodo es requerido');
    }
    if (!password) {
      throw new Error('La contraseña es requerida para reabrir el periodo');
    }

    // 1. Validar la contraseña
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    const isOk = await bcrypt.compare(password, usuario.passwordHash);
    if (!isOk) {
      throw new Error('Contraseña incorrecta');
    }

    // 2. Buscar y eliminar el cierre
    const result = await Cierre.findOneAndDelete({ userId, tipo, periodo });
    if (!result) {
      throw new Error(`No se encontró ningún cierre ${tipo} para el periodo ${periodo}`);
    }

    return { message: 'Periodo reabierto exitosamente' };
  }
};
