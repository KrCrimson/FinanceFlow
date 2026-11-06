/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: backend/__tests__/movimientos.service.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de movimientos.service: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-01, RF-07, RF-08, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-16, RF-17, RF-21, RF-25, RF-27, RF-28, RF-29, RF-30, RF-33, RF-40, RF-41, RF-42, RF-43, RF-44  (módulos: Cuenta, Perfil, Movimientos, Comprobantes, Panel, Planificador, Cierres, Plan Pro)
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
 * Depende de ......: backend/database/movimiento.model.js
 *                    backend/database/usuario.model.js
 *                    backend/services/cierres.service.js
 *                    backend/services/movimientos.service.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
const bcrypt = require('bcryptjs');
const Movimiento = require('../database/movimiento.model');
const Usuario = require('../database/usuario.model');
const cierresService = require('../services/cierres.service');
const movimientosService = require('../services/movimientos.service');

const validData = () => ({
  nombre: 'Sueldo',
  tipo: 'ingreso',
  monto: 1500,
  categoria: 'Trabajo',
  userId: 'user1',
});

const docExistente = (extra = {}) => ({
  userId: { toString: () => 'user1' },
  estado: 'activo',
  fecha: new Date(),
  ...extra,
});

describe('movimientos.service - crearMovimiento', () => {
  beforeEach(() => {
    jest.spyOn(cierresService, 'esPeriodoCerrado').mockResolvedValue(false);
    jest.spyOn(Movimiento.prototype, 'save').mockResolvedValue();
  });
  afterEach(() => jest.restoreAllMocks());

  it.each([
    [{ nombre: 'a' }, /nombre/i],
    [{ nombre: undefined }, /nombre/i],
    [{ tipo: 'gasto' }, /tipo/i],
    [{ monto: 0 }, /monto/i],
    [{ monto: -5 }, /monto/i],
    [{ monto: '100' }, /monto/i],
    [{ categoria: undefined }, /categor/i],
    [{ userId: undefined }, /userId/i],
  ])('rechaza datos inválidos %j', async (cambio, mensaje) => {
    await expect(movimientosService.crearMovimiento({ ...validData(), ...cambio })).rejects.toThrow(mensaje);
    expect(Movimiento.prototype.save).not.toHaveBeenCalled();
  });

  it('rechaza una fecha futura', async () => {
    await expect(
      movimientosService.crearMovimiento({ ...validData(), fecha: '2999-01-01' })
    ).rejects.toThrow('fechas futuras');
  });

  it('rechaza si el periodo está cerrado', async () => {
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    await expect(movimientosService.crearMovimiento(validData())).rejects.toThrow('cerrado');
    expect(Movimiento.prototype.save).not.toHaveBeenCalled();
  });

  it('guarda el movimiento limpiando espacios y con estado activo por defecto', async () => {
    const mov = await movimientosService.crearMovimiento({
      ...validData(),
      nombre: '  Sueldo  ',
      categoria: ' Trabajo ',
    });
    expect(Movimiento.prototype.save).toHaveBeenCalledTimes(1);
    expect(mov.nombre).toBe('Sueldo');
    expect(mov.categoria).toBe('Trabajo');
    expect(mov.estado).toBe('activo');
    expect(mov.esRecurrente).toBe(false);
  });

  it('respeta el estado planificado y la recurrencia', async () => {
    const mov = await movimientosService.crearMovimiento({
      ...validData(),
      estado: 'planificado',
      esRecurrente: true,
    });
    expect(mov.estado).toBe('planificado');
    expect(mov.esRecurrente).toBe(true);
  });
});

describe('movimientos.service - editarMovimiento', () => {
  beforeEach(() => {
    jest.spyOn(cierresService, 'esPeriodoCerrado').mockResolvedValue(false);
    jest.spyOn(Movimiento, 'findByIdAndUpdate').mockImplementation(async (id, payload) => ({ _id: id, ...payload }));
  });
  afterEach(() => jest.restoreAllMocks());

  it('falla si el movimiento no existe', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(null);
    await expect(movimientosService.editarMovimiento('x', { monto: 5 }, 'user1')).rejects.toThrow('no encontrado');
  });

  it('impide editar el movimiento de otro usuario', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    await expect(movimientosService.editarMovimiento('x', { monto: 5 }, 'otro')).rejects.toThrow('No autorizado');
    expect(Movimiento.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('impide editar un movimiento de un periodo cerrado', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    await expect(movimientosService.editarMovimiento('x', { monto: 5 }, 'user1')).rejects.toThrow('período cerrado');
  });

  it('permite editar una meta planificada aunque el periodo esté cerrado', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente({ estado: 'planificado' }));
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    const r = await movimientosService.editarMovimiento('x', { monto: 5 }, 'user1');
    expect(r.monto).toBe(5);
  });

  it('permite cambiar solo la recurrencia en un periodo cerrado', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    const r = await movimientosService.editarMovimiento('x', { esRecurrente: true }, 'user1');
    expect(r.esRecurrente).toBe(true);
  });

  it('impide trasladar un movimiento a una fecha futura', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    await expect(
      movimientosService.editarMovimiento('x', { fecha: '2999-01-01' }, 'user1')
    ).rejects.toThrow('fechas futuras');
  });

  it('solo actualiza los campos enviados', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    await movimientosService.editarMovimiento('x', { nombre: 'Nuevo' }, 'user1');
    const payload = Movimiento.findByIdAndUpdate.mock.calls[0][1];
    expect(payload.nombre).toBe('Nuevo');
    expect(payload).not.toHaveProperty('monto');
    expect(payload).toHaveProperty('actualizadoEn');
  });
});

describe('movimientos.service - inhabilitarMovimiento', () => {
  beforeEach(() => {
    jest.spyOn(cierresService, 'esPeriodoCerrado').mockResolvedValue(false);
    jest.spyOn(Movimiento, 'findByIdAndUpdate').mockImplementation(async (id, payload) => ({ _id: id, ...payload }));
  });
  afterEach(() => jest.restoreAllMocks());

  it('marca el movimiento como inactivo sin borrarlo', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    const r = await movimientosService.inhabilitarMovimiento('x', 'user1');
    expect(r.estado).toBe('inactivo');
  });

  it('no deja inhabilitar movimientos de otro usuario', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    await expect(movimientosService.inhabilitarMovimiento('x', 'otro')).rejects.toThrow('No autorizado');
  });

  it('no deja inhabilitar en un periodo cerrado', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente());
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    await expect(movimientosService.inhabilitarMovimiento('x', 'user1')).rejects.toThrow('período cerrado');
  });

  it('permite cancelar una meta planificada aunque el periodo esté cerrado', async () => {
    jest.spyOn(Movimiento, 'findById').mockResolvedValue(docExistente({ estado: 'planificado' }));
    cierresService.esPeriodoCerrado.mockResolvedValue(true);
    const r = await movimientosService.inhabilitarMovimiento('x', 'user1');
    expect(r.estado).toBe('inactivo');
  });
});

describe('movimientos.service - listarMovimientos (ingresos recurrentes)', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 9, 20, 12, 0, 0)); // 20-oct-2026 hora local
    jest.spyOn(Movimiento.prototype, 'save').mockResolvedValue();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const conLista = (lista) =>
    jest.spyOn(Movimiento, 'find').mockReturnValue({ sort: jest.fn().mockResolvedValue(lista) });

  const recurrente = (fecha) => ({
    tipo: 'ingreso',
    nombre: 'Sueldo',
    monto: 2000,
    categoria: 'Trabajo',
    esRecurrente: true,
    estado: 'activo',
    fecha,
  });

  it('genera el ingreso del mes actual si ya pasó el día de cobro', async () => {
    const lista = [recurrente(new Date(2026, 8, 15, 12))]; // cobro el día 15, mes anterior
    conLista(lista);
    const r = await movimientosService.listarMovimientos('user1');
    expect(Movimiento.prototype.save).toHaveBeenCalledTimes(1);
    expect(r).toHaveLength(2);
    expect(new Date(r[0].fecha).getMonth()).toBe(9);
    expect(new Date(r[0].fecha).getDate()).toBe(15);
  });

  it('no genera nada si el día de cobro aún no llega este mes', async () => {
    conLista([recurrente(new Date(2026, 8, 25, 12))]); // día 25 > hoy (20)
    const r = await movimientosService.listarMovimientos('user1');
    expect(Movimiento.prototype.save).not.toHaveBeenCalled();
    expect(r).toHaveLength(1);
  });

  it('no duplica el ingreso si ya existe uno este mes', async () => {
    conLista([recurrente(new Date(2026, 9, 15, 12)), recurrente(new Date(2026, 8, 15, 12))]);
    const r = await movimientosService.listarMovimientos('user1');
    expect(Movimiento.prototype.save).not.toHaveBeenCalled();
    expect(r).toHaveLength(2);
  });

  it('ignora los ingresos recurrentes inactivos', async () => {
    conLista([{ ...recurrente(new Date(2026, 8, 15, 12)), estado: 'inactivo' }]);
    await movimientosService.listarMovimientos('user1');
    expect(Movimiento.prototype.save).not.toHaveBeenCalled();
  });

  it('si falla la auto-generación igual devuelve los movimientos', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    Movimiento.prototype.save.mockRejectedValue(new Error('db caída'));
    conLista([recurrente(new Date(2026, 8, 15, 12))]);
    const r = await movimientosService.listarMovimientos('user1');
    expect(r).toHaveLength(1);
  });
});

describe('movimientos.service - crearMovimientoHistorico', () => {
  afterEach(() => jest.restoreAllMocks());

  it('exige la contraseña', async () => {
    await expect(movimientosService.crearMovimientoHistorico('user1', validData())).rejects.toThrow('contraseña es requerida');
  });

  it('falla si el usuario no existe', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue(null);
    await expect(
      movimientosService.crearMovimientoHistorico('user1', { ...validData(), password: 'x' })
    ).rejects.toThrow('Usuario no encontrado');
  });

  it('rechaza una contraseña incorrecta', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({ passwordHash: await bcrypt.hash('correcta', 4) });
    await expect(
      movimientosService.crearMovimientoHistorico('user1', { ...validData(), password: 'mala' })
    ).rejects.toThrow('Contraseña incorrecta');
  });

  it('con la contraseña correcta crea el movimiento', async () => {
    jest.spyOn(Usuario, 'findById').mockResolvedValue({ passwordHash: await bcrypt.hash('correcta', 4) });
    jest.spyOn(cierresService, 'esPeriodoCerrado').mockResolvedValue(false);
    jest.spyOn(Movimiento.prototype, 'save').mockResolvedValue();
    const mov = await movimientosService.crearMovimientoHistorico('user1', { ...validData(), password: 'correcta' });
    expect(mov.nombre).toBe('Sueldo');
    expect(Movimiento.prototype.save).toHaveBeenCalledTimes(1);
  });
});
