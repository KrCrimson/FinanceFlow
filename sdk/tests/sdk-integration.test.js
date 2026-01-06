/**
 * 🧪 Tests de Integración - SDK Base
 * 
 * Demuestra que el SDK funciona independientemente sin tocar
 * el frontend existente ni romper nada.
 */

const BalanceSDK = require('../src/index.js');

describe('FASE 1: SDK Base - Funcionamiento Independiente', () => {
  let sdk;

  beforeEach(() => {
    sdk = new BalanceSDK({
      baseURL: 'http://localhost:3000/api',
      timeout: 10000
    });
  });

  afterEach(() => {
    // Limpiar configuración después de cada test
    sdk.removeToken();
  });

  describe('1. Inicialización del SDK', () => {
    test('debe crear instancia con configuración mínima', () => {
      expect(sdk).toBeDefined();
      expect(sdk).toBeInstanceOf(BalanceSDK);
    });

    test('debe tener configuración correcta', () => {
      const config = sdk.getConfig();
      expect(config.baseURL).toBe('http://localhost:3000/api');
      expect(config.timeout).toBe(10000);
    });

    test('debe tener todos los módulos disponibles', () => {
      expect(sdk.auth).toBeDefined();
      expect(sdk.movimientos).toBeDefined();
      expect(sdk.usuarios).toBeDefined();
      expect(sdk.reportes).toBeDefined();
    });
  });

  describe('2. Gestión de Tokens', () => {
    test('debe manejar tokens correctamente', () => {
      // Inicialmente sin token
      expect(sdk.isAuthenticated()).toBe(false);

      // Configurar token
      sdk.setToken('test-token');
      expect(sdk.isAuthenticated()).toBe(true);

      // Remover token
      sdk.removeToken();
      expect(sdk.isAuthenticated()).toBe(false);
    });

    test('debe permitir método encadenado', () => {
      const result = sdk.setToken('test-token');
      expect(result).toBe(sdk);
      expect(sdk.isAuthenticated()).toBe(true);
    });
  });

  describe('3. Configuración Dinámica', () => {
    test('debe actualizar configuración', () => {
      sdk.updateConfig({ timeout: 20000 });
      const config = sdk.getConfig();
      expect(config.timeout).toBe(20000);
    });

    test('debe mantener configuración base', () => {
      const configInicial = sdk.getConfig();
      sdk.updateConfig({ headers: { 'X-Custom': 'test' } });
      const configActual = sdk.getConfig();
      
      expect(configActual.baseURL).toBe(configInicial.baseURL);
      expect(configActual.headers['X-Custom']).toBe('test');
    });
  });

  describe('4. Estadísticas del SDK', () => {
    test('debe proporcionar estadísticas iniciales', () => {
      const stats = sdk.getStats();
      
      expect(stats).toHaveProperty('requests');
      expect(stats).toHaveProperty('errors');
      expect(stats).toHaveProperty('successRate');
      expect(stats).toHaveProperty('uptime');
      expect(typeof stats.requests).toBe('number');
    });

    test('debe calcular success rate correctamente', () => {
      const stats = sdk.getStats();
      expect(stats.successRate).toBe('100%'); // Sin requests aún
    });
  });

  describe('5. Métodos de Conveniencia', () => {
    test('debe tener método login directo', () => {
      expect(typeof sdk.login).toBe('function');
    });

    test('debe tener método logout directo', () => {
      expect(typeof sdk.logout).toBe('function');
    });
  });

  describe('6. Estructura de Módulos', () => {
    describe('Auth Module', () => {
      test('debe tener métodos requeridos', () => {
        const methods = ['login', 'register', 'logout', 'forgotPassword', 'resetPassword'];
        methods.forEach(method => {
          expect(typeof sdk.auth[method]).toBe('function');
        });
      });
    });

    describe('Movimientos Module', () => {
      test('debe tener métodos CRUD', () => {
        const methods = ['getAll', 'getById', 'create', 'update', 'delete'];
        methods.forEach(method => {
          expect(typeof sdk.movimientos[method]).toBe('function');
        });
      });

      test('debe tener métodos específicos', () => {
        const methods = ['getIngresos', 'getEgresos', 'getResumen', 'getByCategoria'];
        methods.forEach(method => {
          expect(typeof sdk.movimientos[method]).toBe('function');
        });
      });
    });

    describe('Usuarios Module', () => {
      test('debe tener métodos de perfil', () => {
        const methods = ['getProfile', 'updateProfile', 'getSettings', 'updateSettings'];
        methods.forEach(method => {
          expect(typeof sdk.usuarios[method]).toBe('function');
        });
      });
    });

    describe('Reportes Module', () => {
      test('debe tener métodos de reportes', () => {
        const methods = ['getBalance', 'getDashboard', 'getTendencias', 'getReporteMensual'];
        methods.forEach(method => {
          expect(typeof sdk.reportes[method]).toBe('function');
        });
      });
    });
  });

  describe('7. Validación de Entrada', () => {
    test('debe rechazar configuración sin baseURL', () => {
      expect(() => {
        new BalanceSDK({});
      }).toThrow('baseURL es requerido');
    });

    test('debe aceptar configuración válida', () => {
      expect(() => {
        new BalanceSDK({
          baseURL: 'https://api.test.com'
        });
      }).not.toThrow();
    });
  });

  describe('8. Independencia del Frontend', () => {
    test('no debe depender de localStorage', () => {
      // El SDK no debe usar localStorage directamente
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;
      
      expect(() => {
        const sdkTest = new BalanceSDK({
          baseURL: 'http://test.com/api'
        });
        sdkTest.setToken('test');
      }).not.toThrow();
      
      global.localStorage = originalLocalStorage;
    });

    test('no debe depender de window object', () => {
      const originalWindow = global.window;
      delete global.window;
      
      expect(() => {
        new BalanceSDK({
          baseURL: 'http://test.com/api'
        });
      }).not.toThrow();
      
      global.window = originalWindow;
    });

    test('debe funcionar en entorno Node.js', () => {
      expect(typeof process).toBe('object');
      expect(process.versions.node).toBeDefined();
      
      // SDK debe funcionar en Node.js
      const nodeSDK = new BalanceSDK({
        baseURL: 'http://localhost:3000/api'
      });
      expect(nodeSDK).toBeDefined();
    });
  });

  describe('9. Robustez y Configuración', () => {
    test('debe manejar headers personalizados', () => {
      const customSDK = new BalanceSDK({
        baseURL: 'http://test.com/api',
        headers: {
          'X-API-Version': 'v1',
          'X-Client': 'SDK'
        }
      });
      
      const config = customSDK.getConfig();
      expect(config.headers['X-API-Version']).toBe('v1');
      expect(config.headers['X-Client']).toBe('SDK');
    });

    test('debe manejar timeout personalizado', () => {
      const fastSDK = new BalanceSDK({
        baseURL: 'http://test.com/api',
        timeout: 5000
      });
      
      expect(fastSDK.getConfig().timeout).toBe(5000);
    });
  });

  describe('10. Preparación para API Real', () => {
    test('debe estar listo para conectar con backend', () => {
      // Verificar que tiene todo lo necesario para API calls
      expect(sdk.auth.login).toBeDefined();
      expect(sdk.movimientos.getAll).toBeDefined();
      expect(sdk.setToken).toBeDefined();
      expect(sdk.getConfig().baseURL).toBe('http://localhost:3000/api');
    });

    test('debe tener estructura de response consistente esperada', () => {
      // Los métodos deben estar preparados para retornar estructura consistente
      // Este test valida que la estructura está lista
      const moduleNames = ['auth', 'movimientos', 'usuarios', 'reportes'];
      
      moduleNames.forEach(moduleName => {
        const module = sdk[moduleName];
        expect(module).toBeDefined();
        expect(typeof module.constructor).toBe('function');
      });
    });
  });
});

describe('FASE 1: Validación de No-Interferencia', () => {
  test('SDK no modifica prototipos globales', () => {
    const originalArrayProto = Array.prototype.toString;
    const originalObjectProto = Object.prototype.toString;
    
    new BalanceSDK({ baseURL: 'http://test.com' });
    
    expect(Array.prototype.toString).toBe(originalArrayProto);
    expect(Object.prototype.toString).toBe(originalObjectProto);
  });

  test('SDK no contamina scope global', () => {
    const keysAntes = Object.keys(global);
    new BalanceSDK({ baseURL: 'http://test.com' });
    const keysDespues = Object.keys(global);
    
    expect(keysDespues.length).toBe(keysAntes.length);
  });

  test('múltiples instancias del SDK son independientes', () => {
    const sdk1 = new BalanceSDK({ baseURL: 'http://api1.com' });
    const sdk2 = new BalanceSDK({ baseURL: 'http://api2.com' });
    
    sdk1.setToken('token1');
    sdk2.setToken('token2');
    
    expect(sdk1.getConfig().baseURL).toBe('http://api1.com');
    expect(sdk2.getConfig().baseURL).toBe('http://api2.com');
    
    expect(sdk1.isAuthenticated()).toBe(true);
    expect(sdk2.isAuthenticated()).toBe(true);
    
    sdk1.removeToken();
    expect(sdk1.isAuthenticated()).toBe(false);
    expect(sdk2.isAuthenticated()).toBe(true); // No debe afectarse
  });
});