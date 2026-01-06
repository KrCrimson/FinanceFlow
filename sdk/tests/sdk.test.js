/**
 * 🧪 Tests básicos del SDK
 * 
 * Suite de tests para verificar funcionalidad principal
 */

import BalanceSDK from '../src/index.js';

// Mock de axios para tests
jest.mock('axios', () => ({
  create: () => ({
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  })
}));

describe('BalanceSDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new BalanceSDK({
      baseURL: 'http://localhost:3000/api'
    });
  });

  describe('Constructor', () => {
    test('debe requerir baseURL', () => {
      expect(() => {
        new BalanceSDK({});
      }).toThrow('baseURL es requerido en la configuración del SDK');
    });

    test('debe crear instancia con configuración válida', () => {
      expect(sdk).toBeInstanceOf(BalanceSDK);
      expect(sdk.config.baseURL).toBe('http://localhost:3000/api');
    });

    test('debe tener todos los módulos', () => {
      expect(sdk.auth).toBeDefined();
      expect(sdk.movimientos).toBeDefined();
      expect(sdk.usuarios).toBeDefined();
      expect(sdk.reportes).toBeDefined();
    });
  });

  describe('Token Management', () => {
    test('debe configurar token', () => {
      const token = 'test-token';
      sdk.setToken(token);
      expect(sdk.isAuthenticated()).toBe(true);
    });

    test('debe remover token', () => {
      sdk.setToken('test-token');
      sdk.removeToken();
      expect(sdk.isAuthenticated()).toBe(false);
    });
  });

  describe('Configuration', () => {
    test('debe obtener configuración', () => {
      const config = sdk.getConfig();
      expect(config.baseURL).toBe('http://localhost:3000/api');
      expect(config.timeout).toBe(10000);
    });

    test('debe actualizar configuración', () => {
      sdk.updateConfig({ timeout: 20000 });
      expect(sdk.config.timeout).toBe(20000);
    });
  });

  describe('Stats', () => {
    test('debe obtener estadísticas', () => {
      const stats = sdk.getStats();
      expect(stats).toHaveProperty('requests');
      expect(stats).toHaveProperty('errors');
      expect(stats).toHaveProperty('successRate');
    });
  });
});

describe('Módulos del SDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new BalanceSDK({
      baseURL: 'http://localhost:3000/api'
    });
  });

  test('Auth module debe tener métodos requeridos', () => {
    const authMethods = [
      'login',
      'register',
      'logout',
      'me',
      'forgotPassword',
      'resetPassword',
      'changePassword'
    ];

    authMethods.forEach(method => {
      expect(typeof sdk.auth[method]).toBe('function');
    });
  });

  test('Movimientos module debe tener métodos requeridos', () => {
    const movimientosMethods = [
      'getAll',
      'getById',
      'create',
      'update',
      'delete',
      'getResumen',
      'getIngresos',
      'getEgresos'
    ];

    movimientosMethods.forEach(method => {
      expect(typeof sdk.movimientos[method]).toBe('function');
    });
  });

  test('Usuarios module debe tener métodos requeridos', () => {
    const usuariosMethods = [
      'getProfile',
      'updateProfile',
      'changePassword',
      'getSettings',
      'updateSettings',
      'getStats'
    ];

    usuariosMethods.forEach(method => {
      expect(typeof sdk.usuarios[method]).toBe('function');
    });
  });

  test('Reportes module debe tener métodos requeridos', () => {
    const reportesMethods = [
      'getBalance',
      'getDashboard',
      'getReporteMensual',
      'getTendencias',
      'getGastosPorCategoria'
    ];

    reportesMethods.forEach(method => {
      expect(typeof sdk.reportes[method]).toBe('function');
    });
  });
});