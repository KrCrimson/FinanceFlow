/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: sdk/tests/movimientos-adapter.test.js
 * Capa / módulo ...: Pruebas automáticas
 * Función .........: Pruebas automáticas de movimientos-adapter: verifican que el comportamiento descrito en el SRS se cumple.
 * Requerimientos ..: RF-09, RF-12, RF-13, RF-14  (módulos: Movimientos)
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 * Depende de ......: frontend/src/services/movimientosService.js
 *                    sdk/adapters/movimientos-adapter.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * Tests del adaptador de movimientos (SDK <-> servicio original).
 *
 * Ejercitan la instancia real del adaptador (movimientosAdapter). Solo se simulan
 * sus dependencias: el servicio original del frontend (usa window al cargarse) y el SDK.
 */

jest.mock('../../frontend/src/services/movimientosService.js', () => ({
  getMovimientos: jest.fn(),
  createMovimiento: jest.fn(),
  updateMovimiento: jest.fn(),
  inhabilitarMovimiento: jest.fn(),
}));

const original = require('../../frontend/src/services/movimientosService.js');
const { movimientosAdapter: adapter } = require('../adapters/movimientos-adapter.js');

const crearSdkFalso = () => ({
  movimientos: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getIngresos: jest.fn(),
    getEgresos: jest.fn(),
    getResumen: jest.fn(),
  },
  setToken: jest.fn(),
  removeToken: jest.fn(),
  getStats: jest.fn().mockReturnValue({ totalRequests: 10 }),
});

const MOVS = [
  { id: 1, tipo: 'ingreso', monto: 1000 },
  { id: 2, tipo: 'egreso', monto: 400 },
  { id: 3, tipo: 'ingreso', monto: 250 },
];

function usarSdk(sdk) {
  adapter.sdk = sdk;
  adapter.isSDKEnabled = true;
  adapter.isSDKInitialized = true;
  adapter.fallbackToOriginal = false;
}

function usarOriginal() {
  adapter.sdk = null;
  adapter.isSDKEnabled = false;
  adapter.fallbackToOriginal = false;
}

beforeEach(() => {
  jest.clearAllMocks();
  adapter.config.debug = false;
  global.localStorage = { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() };
  usarOriginal();
});

describe('MovimientosAdapter con el SDK deshabilitado (servicio original)', () => {
  test('getMovimientos delega en el servicio original', async () => {
    original.getMovimientos.mockResolvedValue(MOVS);
    await expect(adapter.getMovimientos()).resolves.toEqual(MOVS);
    expect(original.getMovimientos).toHaveBeenCalledTimes(1);
  });

  test('createMovimiento pasa los datos tal cual al servicio original', async () => {
    const data = { tipo: 'ingreso', monto: 1500 };
    original.createMovimiento.mockResolvedValue({ id: 9, ...data });
    await expect(adapter.createMovimiento(data)).resolves.toEqual({ id: 9, ...data });
    expect(original.createMovimiento).toHaveBeenCalledWith(data);
  });

  test('getIngresos y getEgresos filtran manualmente por tipo', async () => {
    original.getMovimientos.mockResolvedValue(MOVS);
    expect((await adapter.getIngresos()).map(m => m.id)).toEqual([1, 3]);
    expect((await adapter.getEgresos()).map(m => m.id)).toEqual([2]);
  });

  test('getMovimientoById exige SDK habilitado', async () => {
    await expect(adapter.getMovimientoById(1)).rejects.toThrow('solo con SDK habilitado');
  });
});

describe('MovimientosAdapter con el SDK habilitado', () => {
  let sdk;
  beforeEach(() => {
    sdk = crearSdkFalso();
    usarSdk(sdk);
  });

  test('getMovimientos devuelve la lista del SDK sin llamar al original', async () => {
    sdk.movimientos.getAll.mockResolvedValue({ success: true, movimientos: MOVS });
    await expect(adapter.getMovimientos()).resolves.toEqual(MOVS);
    expect(original.getMovimientos).not.toHaveBeenCalled();
  });

  test('getMovimientos devuelve [] si el SDK no trae la propiedad movimientos', async () => {
    sdk.movimientos.getAll.mockResolvedValue({ success: true });
    await expect(adapter.getMovimientos()).resolves.toEqual([]);
  });

  test('createMovimiento devuelve el movimiento creado por el SDK', async () => {
    const data = { tipo: 'egreso', monto: 80 };
    sdk.movimientos.create.mockResolvedValue({ success: true, movimiento: { id: 7, ...data } });
    await expect(adapter.createMovimiento(data)).resolves.toEqual({ id: 7, ...data });
    expect(sdk.movimientos.create).toHaveBeenCalledWith(data);
  });

  test('updateMovimiento envia id y datos al SDK', async () => {
    sdk.movimientos.update.mockResolvedValue({ success: true, movimiento: { id: 2, monto: 999 } });
    await adapter.updateMovimiento(2, { monto: 999 });
    expect(sdk.movimientos.update).toHaveBeenCalledWith(2, { monto: 999 });
  });

  test('inhabilitarMovimiento usa delete del SDK y devuelve el mensaje esperado por el frontend', async () => {
    sdk.movimientos.delete.mockResolvedValue({ success: true });
    await expect(adapter.inhabilitarMovimiento(5)).resolves.toEqual({
      message: 'Movimiento inhabilitado exitosamente',
    });
    expect(sdk.movimientos.delete).toHaveBeenCalledWith(5);
  });

  test('getMovimientoById devuelve el dato del SDK', async () => {
    sdk.movimientos.getById.mockResolvedValue({ success: true, data: MOVS[0] });
    await expect(adapter.getMovimientoById(1)).resolves.toEqual(MOVS[0]);
  });

  test('getIngresos usa el SDK cuando responde bien', async () => {
    sdk.movimientos.getIngresos.mockResolvedValue({ success: true, data: [MOVS[0]] });
    await expect(adapter.getIngresos()).resolves.toEqual([MOVS[0]]);
    expect(original.getMovimientos).not.toHaveBeenCalled();
  });
});

describe('Fallback al servicio original cuando el SDK falla', () => {
  let sdk;
  beforeEach(() => {
    sdk = crearSdkFalso();
    usarSdk(sdk);
  });

  test('si el SDK lanza una excepción, getMovimientos usa el servicio original', async () => {
    sdk.movimientos.getAll.mockRejectedValue(new Error('timeout'));
    original.getMovimientos.mockResolvedValue(MOVS);
    await expect(adapter.getMovimientos()).resolves.toEqual(MOVS);
    expect(original.getMovimientos).toHaveBeenCalledTimes(1);
  });

  test('si el SDK responde success=false, createMovimiento cae al servicio original', async () => {
    const data = { tipo: 'ingreso', monto: 10 };
    sdk.movimientos.create.mockResolvedValue({ success: false, message: 'rechazado' });
    original.createMovimiento.mockResolvedValue({ id: 1, ...data });
    await expect(adapter.createMovimiento(data)).resolves.toEqual({ id: 1, ...data });
    expect(original.createMovimiento).toHaveBeenCalledWith(data);
  });

  test('si el SDK no pudo inhabilitar (success=false), se usa el servicio original', async () => {
    sdk.movimientos.delete.mockResolvedValue({ success: false, message: 'no encontrado' });
    original.inhabilitarMovimiento.mockResolvedValue({ message: 'ok original' });
    await expect(adapter.inhabilitarMovimiento(5)).resolves.toEqual({ message: 'ok original' });
    expect(original.inhabilitarMovimiento).toHaveBeenCalledWith(5);
  });

  test('getIngresos cae al filtro manual si el SDK falla', async () => {
    sdk.movimientos.getIngresos.mockRejectedValue(new Error('500'));
    original.getMovimientos.mockResolvedValue(MOVS);
    expect((await adapter.getIngresos()).map(m => m.id)).toEqual([1, 3]);
  });

  test('si fallbackToOriginal está activo, ni siquiera se intenta el SDK', async () => {
    adapter.fallbackToOriginal = true;
    original.getMovimientos.mockResolvedValue(MOVS);
    await adapter.getMovimientos();
    expect(sdk.movimientos.getAll).not.toHaveBeenCalled();
  });
});

describe('adaptSDKResponse', () => {
  test('lanza el mensaje del SDK cuando success es false', () => {
    expect(() => adapter.adaptSDKResponse({ success: false, message: 'sin permiso' }, 'getMovimientos'))
      .toThrow('sin permiso');
  });

  test('lanza un mensaje genérico cuando no hay respuesta', () => {
    expect(() => adapter.adaptSDKResponse(undefined, 'getMovimientos')).toThrow('Error en respuesta del SDK');
  });

  test('deleteMovimiento devuelve un mensaje por defecto', () => {
    expect(adapter.adaptSDKResponse({ success: true }, 'deleteMovimiento'))
      .toEqual({ message: 'Movimiento eliminado' });
  });
});

describe('calculateResumen (cálculo manual de respaldo)', () => {
  test('suma ingresos y egresos y calcula el balance', () => {
    expect(adapter.calculateResumen(MOVS)).toEqual({
      ingresos: 1250,
      egresos: 400,
      balance: 850,
      totalMovimientos: 3,
      periodo: 'actual',
    });
  });

  test('trata un monto ausente como 0', () => {
    const r = adapter.calculateResumen([{ tipo: 'ingreso' }, { tipo: 'egreso', monto: 30 }]);
    expect(r.ingresos).toBe(0);
    expect(r.balance).toBe(-30);
  });

  test('usa el mes recibido como periodo', () => {
    expect(adapter.calculateResumen([], { mes: '2026-10' }).periodo).toBe('2026-10');
  });

  test('getResumen sin SDK calcula con los movimientos del servicio original', async () => {
    original.getMovimientos.mockResolvedValue(MOVS);
    const r = await adapter.getResumen();
    expect(r.balance).toBe(850);
  });
});

describe('Control del adaptador', () => {
  test('disableSDK desactiva el SDK y guarda la preferencia', () => {
    usarSdk(crearSdkFalso());
    adapter.disableSDK();
    expect(adapter.isSDKEnabled).toBe(false);
    expect(adapter.fallbackToOriginal).toBe(true);
    expect(global.localStorage.setItem).toHaveBeenCalledWith('enable_sdk', 'false');
  });

  test('updateToken con valor lo envía al SDK y sin valor lo remueve', () => {
    const sdk = crearSdkFalso();
    usarSdk(sdk);
    adapter.updateToken('abc');
    expect(sdk.setToken).toHaveBeenCalledWith('abc');
    adapter.updateToken(null);
    expect(sdk.removeToken).toHaveBeenCalledTimes(1);
  });

  test('updateToken no hace nada si el SDK está deshabilitado', () => {
    expect(() => adapter.updateToken('abc')).not.toThrow();
  });

  test('getAdapterStats refleja el estado actual', () => {
    usarSdk(crearSdkFalso());
    expect(adapter.getAdapterStats()).toEqual({
      sdkEnabled: true,
      sdkInitialized: true,
      fallbackMode: false,
      sdkStats: { totalRequests: 10 },
    });
  });
});
