/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/cierres.service.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de cierres.service: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-09, RF-10, RF-13, RF-16, RF-17, RF-21, RF-25, RF-27, RF-28, RF-29, RF-30, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Movimientos, Comprobantes, Panel, Planificador, Cierres, Plan Pro)
 * Calidad (RNF) ...: RNF-01, RNF-05, RNF-12, RNF-13
 * Casos de uso ....: CU-01 Registrar cuenta
 *                    CU-02 Iniciar sesión
 *                    CU-03 Solicitar recuperación de contraseña
 *                    CU-04 Restablecer contraseña
 *                    CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-12 Gestionar información de perfil
 *                    CU-14 Realizar arqueo diario
 *                    CU-15 Realizar cierre mensual
 *                    CU-16 Reabrir periodo cerrado
 *                    CU-17 Marcar y quitar ingreso constante
 *                    CU-18 Eliminar cuenta
 *                    CU-19 Contratar el Plan Pro
 *                    CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-01, RN-03, RN-04, RN-05, RN-06, RN-11, RN-12, RN-13, RN-14, RN-15, RN-19, RN-20, RN-23, RN-24, RN-26, RN-27, RN-28, RN-29
 * Depende de ......: backend/database/cierre.model.js
 *                    backend/database/movimiento.model.js
 *                    backend/database/usuario.model.js
 *                    backend/services/cierres.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const bcrypt = require('bcryptjs');
const Cierre = require('../database/cierre.model');
const Movimiento = require('../database/movimiento.model');
const Usuario = require('../database/usuario.model');
const cierresService = require('../services/cierres.service');

const movs = [
  { tipo: 'ingreso', monto: 1000 },
  { tipo: 'ingreso', monto: 500 },
  { tipo: 'egreso', monto: 300 },
];

describe('cierres.service - obtenerResumenPeriodo', () => {
  afterEach(() => jest.restoreAllMocks());

  it('suma ingresos y egresos activos del periodo', async () => {
    jest.spyOn(Movimiento, 'find').mockResolvedValue(movs);
    await expect(cierresService.obtenerResumenPeriodo('u1', 'mensual', '2026-09')).resolves.toEqual({
      ingresosTotales: 1500,
      egresosTotales: 300,
      count: 3,
    });
  });

  it('consulta el rango completo del mes (incluye el último día)', async () => {
    const find = jest.spyOn(Movimiento, 'find').mockResolvedValue([]);
    await cierresService.obtenerResumenPeriodo('u1', 'mensual', '2026-02');
    const { fecha, estado, userId } = find.mock.calls[0][0];
    expect(userId).toBe('u1');
    expect(estado).toBe('activo');
    expect(fecha.$gte.toISOString()).toBe('2026-02-01T00:00:00.000Z');
    expect(fecha.$lte.toISOString()).toBe('2026-02-28T23:59:59.999Z');
  });

  it('para un cierre diario consulta solo ese día', async () => {
    const find = jest.spyOn(Movimiento, 'find').mockResolvedValue([]);
    await cierresService.obtenerResumenPeriodo('u1', 'diario', '2026-09-15');
    const { fecha } = find.mock.calls[0][0];
    expect(fecha.$gte.toISOString()).toBe('2026-09-15T00:00:00.000Z');
    expect(fecha.$lte.toISOString()).toBe('2026-09-15T23:59:59.999Z');
  });

  it('devuelve ceros cuando no hay movimientos', async () => {
    jest.spyOn(Movimiento, 'find').mockResolvedValue([]);
    await expect(cierresService.obtenerResumenPeriodo('u1', 'diario', '2026-09-15')).resolves.toEqual({
      ingresosTotales: 0,
      egresosTotales: 0,
      count: 0,
    });
  });
});

describe('cierres.service - crearCierre', () => {
  let hash;
  beforeAll(async () => {
    hash = await bcrypt.hash('clave123', 4);
  });
  beforeEach(() => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({ passwordHash: hash, fondoFijo: 800 });
    jest.spyOn(Cierre, 'findOne').mockResolvedValue(null);
    jest.spyOn(Movimiento, 'find').mockResolvedValue(movs);
    jest.spyOn(Cierre.prototype, 'save').mockResolvedValue();
  });
  afterEach(() => jest.restoreAllMocks());

  const base = { tipo: 'diario', periodo: '2026-09-15', saldoFisico: 2000 };

  it.each([
    [{ tipo: 'semanal' }, /tipo de cierre/],
    [{ tipo: undefined }, /tipo de cierre/],
    [{ periodo: undefined }, /periodo es requerido/],
    [{ saldoFisico: undefined }, /saldo físico/],
    [{ saldoFisico: -1 }, /saldo físico/],
    [{ saldoFisico: '100' }, /saldo físico/],
  ])('valida los datos de entrada %j', async (cambio, mensaje) => {
    await expect(cierresService.crearCierre('u1', { ...base, ...cambio })).rejects.toThrow(mensaje);
    expect(Cierre.prototype.save).not.toHaveBeenCalled();
  });

  it('falla si el usuario no existe', async () => {
    Usuario.findById.mockResolvedValue(null);
    await expect(cierresService.crearCierre('u1', base)).rejects.toThrow('Usuario no encontrado');
  });

  it('el cierre mensual exige contraseña', async () => {
    await expect(
      cierresService.crearCierre('u1', { ...base, tipo: 'mensual', periodo: '2026-09' })
    ).rejects.toThrow('contraseña es requerida');
  });

  it('el cierre mensual rechaza una contraseña incorrecta', async () => {
    await expect(
      cierresService.crearCierre('u1', { ...base, tipo: 'mensual', periodo: '2026-09', password: 'mala' })
    ).rejects.toThrow('Contraseña incorrecta');
    expect(Cierre.prototype.save).not.toHaveBeenCalled();
  });

  it('el cierre diario no pide contraseña', async () => {
    const c = await cierresService.crearCierre('u1', base);
    expect(c.tipo).toBe('diario');
  });

  it('no permite cerrar dos veces el mismo periodo', async () => {
    Cierre.findOne.mockResolvedValue({ _id: 'ya-existe' });
    await expect(cierresService.crearCierre('u1', base)).rejects.toThrow('Ya existe un cierre diario');
  });

  it('calcula saldo esperado y diferencia con el fondo fijo recibido', async () => {
    // fondo 1000 + ingresos 1500 - egresos 300 = 2200 esperado; físico 2000 => diferencia -200
    const c = await cierresService.crearCierre('u1', { ...base, fondoFijo: 1000 });
    expect(c.saldoEsperado).toBe(2200);
    expect(c.diferencia).toBe(-200);
    expect(c.ingresosTotales).toBe(1500);
    expect(c.egresosTotales).toBe(300);
    expect(Cierre.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('si no se envía fondo fijo usa el del usuario', async () => {
    const c = await cierresService.crearCierre('u1', base);
    expect(c.fondoFijo).toBe(800);
    expect(c.saldoEsperado).toBe(800 + 1500 - 300);
  });

  it('con contraseña correcta permite el cierre mensual', async () => {
    const c = await cierresService.crearCierre('u1', {
      ...base,
      tipo: 'mensual',
      periodo: '2026-09',
      password: 'clave123',
    });
    expect(c.tipo).toBe('mensual');
  });
});

describe('cierres.service - esPeriodoCerrado', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-20T12:00:00Z'));
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('una fecha inválida no se considera cerrada', async () => {
    await expect(cierresService.esPeriodoCerrado('u1', 'no-es-fecha')).resolves.toBe(false);
  });

  it('los meses con 2 o más meses de antigüedad se consideran cerrados sin consultar la BD', async () => {
    const find = jest.spyOn(Cierre, 'findOne');
    await expect(cierresService.esPeriodoCerrado('u1', '2026-08-10')).resolves.toBe(true);
    expect(find).not.toHaveBeenCalled();
  });

  it('el mes anterior está abierto salvo que exista un cierre mensual', async () => {
    jest.spyOn(Cierre, 'findOne').mockResolvedValue(null);
    await expect(cierresService.esPeriodoCerrado('u1', '2026-09-10')).resolves.toBe(false);
    Cierre.findOne.mockResolvedValue({ _id: 'c1' });
    await expect(cierresService.esPeriodoCerrado('u1', '2026-09-10')).resolves.toBe(true);
  });

  it('busca el cierre mensual del periodo correcto', async () => {
    const find = jest.spyOn(Cierre, 'findOne').mockResolvedValue(null);
    await cierresService.esPeriodoCerrado('u1', '2026-10-05');
    expect(find).toHaveBeenCalledWith({ userId: 'u1', tipo: 'mensual', periodo: '2026-10' });
  });
});

describe('cierres.service - obtenerCierresPendientes', () => {
  afterEach(() => jest.restoreAllMocks());

  it('calcula ayer y el mes anterior a partir de la fecha local', async () => {
    jest.spyOn(Cierre, 'findOne').mockResolvedValue(null);
    jest.spyOn(cierresService, 'obtenerResumenPeriodo').mockResolvedValue({ ingresosTotales: 0, egresosTotales: 0, count: 0 });
    const r = await cierresService.obtenerCierresPendientes('u1', '2026-06-16');
    expect(r.yesterday).toMatchObject({ date: '2026-06-15', isClosed: false });
    expect(r.prevMonth).toMatchObject({ periodo: '2026-05', isClosed: false });
  });

  it('en enero el mes anterior es diciembre del año anterior', async () => {
    jest.spyOn(Cierre, 'findOne').mockResolvedValue(null);
    jest.spyOn(cierresService, 'obtenerResumenPeriodo').mockResolvedValue({});
    const r = await cierresService.obtenerCierresPendientes('u1', '2027-01-10');
    expect(r.prevMonth.periodo).toBe('2026-12');
  });

  it('no calcula el resumen de lo que ya está cerrado', async () => {
    jest.spyOn(Cierre, 'findOne').mockResolvedValue({ _id: 'c' });
    const resumen = jest.spyOn(cierresService, 'obtenerResumenPeriodo');
    const r = await cierresService.obtenerCierresPendientes('u1', '2026-06-16');
    expect(r.yesterday.isClosed).toBe(true);
    expect(r.prevMonth.isClosed).toBe(true);
    expect(resumen).not.toHaveBeenCalled();
    expect(r.yesterday.resumen).toBeNull();
  });
});

describe('cierres.service - reabrirCierre', () => {
  let hash;
  beforeAll(async () => {
    hash = await bcrypt.hash('clave123', 4);
  });
  beforeEach(() => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({ passwordHash: hash });
    jest.spyOn(Cierre, 'findOneAndDelete').mockResolvedValue({ _id: 'c1' });
  });
  afterEach(() => jest.restoreAllMocks());

  const base = { tipo: 'mensual', periodo: '2026-09', password: 'clave123' };

  it.each([
    [{ tipo: 'x' }, /tipo de cierre/],
    [{ periodo: undefined }, /periodo es requerido/],
    [{ password: undefined }, /contraseña es requerida/],
  ])('valida los datos %j', async (cambio, mensaje) => {
    await expect(cierresService.reabrirCierre('u1', { ...base, ...cambio })).rejects.toThrow(mensaje);
  });

  it('rechaza una contraseña incorrecta sin borrar el cierre', async () => {
    await expect(cierresService.reabrirCierre('u1', { ...base, password: 'mala' })).rejects.toThrow('Contraseña incorrecta');
    expect(Cierre.findOneAndDelete).not.toHaveBeenCalled();
  });

  it('falla si no existe el cierre', async () => {
    Cierre.findOneAndDelete.mockResolvedValue(null);
    await expect(cierresService.reabrirCierre('u1', base)).rejects.toThrow('No se encontró ningún cierre');
  });

  it('reabre el periodo con la contraseña correcta', async () => {
    await expect(cierresService.reabrirCierre('u1', base)).resolves.toEqual({ message: 'Periodo reabierto exitosamente' });
    expect(Cierre.findOneAndDelete).toHaveBeenCalledWith({ userId: 'u1', tipo: 'mensual', periodo: '2026-09' });
  });
});
