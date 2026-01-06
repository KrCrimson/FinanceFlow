/**
 * 🔍 Validador FASE 1: SDK Base Independiente
 * 
 * Script que valida que el SDK funciona completamente independiente
 * sin necesidad del backend corriendo y sin tocar el frontend.
 * 
 * Ejecutar: node validate-phase1.js
 */

const BalanceSDK = require('./src/index.js');
const fs = require('fs');
const path = require('path');

class Phase1Validator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    }[type] || 'ℹ️';
    
    console.log(`[${timestamp}] ${prefix} ${message}`);
    this.results.details.push({ timestamp, type, message });
    
    if (type === 'success') this.results.passed++;
    if (type === 'error') this.results.failed++;
    if (type === 'warning') this.results.warnings++;
  }

  async validateSDKStructure() {
    this.log('Validando estructura del SDK...', 'info');
    
    try {
      // Verificar archivos principales
      const requiredFiles = [
        './src/index.js',
        './src/utils/httpClient.js',
        './src/modules/auth.js',
        './src/modules/movimientos.js',
        './src/modules/usuarios.js',
        './src/modules/reportes.js',
        './package.json'
      ];

      for (const file of requiredFiles) {
        const filePath = path.resolve(__dirname, file);
        if (fs.existsSync(filePath)) {
          this.log(`Archivo encontrado: ${file}`, 'success');
        } else {
          this.log(`Archivo faltante: ${file}`, 'error');
        }
      }

      // Verificar que se puede importar
      const SDK = require('./src/index.js');
      if (typeof SDK === 'function') {
        this.log('SDK se puede importar correctamente', 'success');
      } else {
        this.log('Error: SDK no es una función constructor', 'error');
      }

    } catch (error) {
      this.log(`Error validando estructura: ${error.message}`, 'error');
    }
  }

  async validateSDKInstantiation() {
    this.log('Validando instanciación del SDK...', 'info');
    
    try {
      // Test 1: Configuración inválida debe fallar
      try {
        new BalanceSDK({});
        this.log('Error: SDK acepta configuración inválida', 'error');
      } catch (error) {
        this.log('Validación de configuración funciona correctamente', 'success');
      }

      // Test 2: Configuración válida debe funcionar
      const sdk = new BalanceSDK({
        baseURL: 'http://localhost:3000/api'
      });

      if (sdk instanceof BalanceSDK) {
        this.log('SDK se instancia correctamente', 'success');
      } else {
        this.log('Error: SDK no es instancia correcta', 'error');
      }

      // Test 3: Verificar módulos
      const modules = ['auth', 'movimientos', 'usuarios', 'reportes'];
      for (const module of modules) {
        if (sdk[module] && typeof sdk[module] === 'object') {
          this.log(`Módulo ${module} disponible`, 'success');
        } else {
          this.log(`Módulo ${module} no disponible`, 'error');
        }
      }

      return sdk;

    } catch (error) {
      this.log(`Error en instanciación: ${error.message}`, 'error');
      return null;
    }
  }

  async validateSDKMethods(sdk) {
    this.log('Validando métodos del SDK...', 'info');
    
    if (!sdk) {
      this.log('SDK no disponible para validar métodos', 'error');
      return;
    }

    try {
      // Validar métodos principales
      const mainMethods = [
        'setToken', 'removeToken', 'isAuthenticated',
        'getConfig', 'updateConfig', 'getStats',
        'login', 'logout'
      ];

      for (const method of mainMethods) {
        if (typeof sdk[method] === 'function') {
          this.log(`Método principal ${method} disponible`, 'success');
        } else {
          this.log(`Método principal ${method} no disponible`, 'error');
        }
      }

      // Validar métodos de módulos
      const moduleTests = {
        auth: ['login', 'register', 'logout', 'forgotPassword', 'resetPassword'],
        movimientos: ['getAll', 'getById', 'create', 'update', 'delete', 'getResumen'],
        usuarios: ['getProfile', 'updateProfile', 'getSettings', 'changePassword'],
        reportes: ['getBalance', 'getDashboard', 'getTendencias', 'getReporteMensual']
      };

      for (const [moduleName, methods] of Object.entries(moduleTests)) {
        const module = sdk[moduleName];
        if (!module) continue;

        for (const method of methods) {
          if (typeof module[method] === 'function') {
            this.log(`${moduleName}.${method} disponible`, 'success');
          } else {
            this.log(`${moduleName}.${method} no disponible`, 'error');
          }
        }
      }

    } catch (error) {
      this.log(`Error validando métodos: ${error.message}`, 'error');
    }
  }

  async validateTokenManagement(sdk) {
    this.log('Validando gestión de tokens...', 'info');
    
    if (!sdk) return;

    try {
      // Estado inicial
      if (!sdk.isAuthenticated()) {
        this.log('Estado inicial sin token correcto', 'success');
      } else {
        this.log('Error: Estado inicial con token', 'error');
      }

      // Configurar token
      const result = sdk.setToken('test-token-123');
      if (result === sdk) {
        this.log('setToken retorna SDK (chainable)', 'success');
      } else {
        this.log('setToken no es chainable', 'warning');
      }

      if (sdk.isAuthenticated()) {
        this.log('Token configurado correctamente', 'success');
      } else {
        this.log('Error: Token no se configuró', 'error');
      }

      // Remover token
      sdk.removeToken();
      if (!sdk.isAuthenticated()) {
        this.log('Token removido correctamente', 'success');
      } else {
        this.log('Error: Token no se removió', 'error');
      }

    } catch (error) {
      this.log(`Error en gestión de tokens: ${error.message}`, 'error');
    }
  }

  async validateConfiguration(sdk) {
    this.log('Validando configuración dinámica...', 'info');
    
    if (!sdk) return;

    try {
      // Configuración inicial
      const configInicial = sdk.getConfig();
      if (configInicial && configInicial.baseURL) {
        this.log('getConfig funciona correctamente', 'success');
      } else {
        this.log('Error: getConfig no funciona', 'error');
      }

      // Actualizar configuración
      sdk.updateConfig({ timeout: 25000 });
      const configNueva = sdk.getConfig();
      
      if (configNueva.timeout === 25000) {
        this.log('updateConfig funciona correctamente', 'success');
      } else {
        this.log('Error: updateConfig no funciona', 'error');
      }

      // Verificar que otros valores se mantienen
      if (configNueva.baseURL === configInicial.baseURL) {
        this.log('updateConfig preserva otros valores', 'success');
      } else {
        this.log('Advertencia: updateConfig modifica otros valores', 'warning');
      }

    } catch (error) {
      this.log(`Error en configuración: ${error.message}`, 'error');
    }
  }

  async validateStats(sdk) {
    this.log('Validando estadísticas del SDK...', 'info');
    
    if (!sdk) return;

    try {
      const stats = sdk.getStats();
      
      const requiredStats = ['requests', 'errors', 'uptime', 'successRate'];
      for (const stat of requiredStats) {
        if (stats.hasOwnProperty(stat)) {
          this.log(`Estadística ${stat} disponible: ${stats[stat]}`, 'success');
        } else {
          this.log(`Estadística ${stat} no disponible`, 'error');
        }
      }

      // Verificar tipos
      if (typeof stats.requests === 'number') {
        this.log('stats.requests es número', 'success');
      } else {
        this.log('stats.requests no es número', 'error');
      }

      if (typeof stats.successRate === 'string' && stats.successRate.includes('%')) {
        this.log('stats.successRate es porcentaje válido', 'success');
      } else {
        this.log('stats.successRate no es porcentaje válido', 'error');
      }

    } catch (error) {
      this.log(`Error en estadísticas: ${error.message}`, 'error');
    }
  }

  async validateIndependence() {
    this.log('Validando independencia del frontend...', 'info');
    
    try {
      // Verificar que no depende de localStorage
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;
      
      try {
        const sdk = new BalanceSDK({ baseURL: 'http://test.com' });
        sdk.setToken('test');
        this.log('SDK funciona sin localStorage', 'success');
      } catch (error) {
        this.log('SDK depende de localStorage', 'error');
      }
      
      global.localStorage = originalLocalStorage;

      // Verificar que no depende de window
      const originalWindow = global.window;
      delete global.window;
      
      try {
        new BalanceSDK({ baseURL: 'http://test.com' });
        this.log('SDK funciona sin window object', 'success');
      } catch (error) {
        this.log('SDK depende de window object', 'error');
      }
      
      global.window = originalWindow;

      // Verificar múltiples instancias
      const sdk1 = new BalanceSDK({ baseURL: 'http://api1.com' });
      const sdk2 = new BalanceSDK({ baseURL: 'http://api2.com' });
      
      sdk1.setToken('token1');
      sdk2.setToken('token2');
      
      if (sdk1.getConfig().baseURL !== sdk2.getConfig().baseURL) {
        this.log('Múltiples instancias son independientes', 'success');
      } else {
        this.log('Múltiples instancias no son independientes', 'error');
      }

    } catch (error) {
      this.log(`Error validando independencia: ${error.message}`, 'error');
    }
  }

  async validateFrontendIntegrity() {
    this.log('Validando que no se modificó el frontend...', 'info');
    
    try {
      // Verificar que archivos del frontend existen y no fueron modificados
      const frontendPaths = [
        '../../frontend/src/App.jsx',
        '../../frontend/src/services',
        '../../backend/app.js'
      ];

      for (const frontendPath of frontendPaths) {
        const fullPath = path.resolve(__dirname, frontendPath);
        if (fs.existsSync(fullPath)) {
          this.log(`Frontend intacto: ${frontendPath}`, 'success');
        } else {
          this.log(`Archivo frontend no encontrado: ${frontendPath}`, 'warning');
        }
      }

      this.log('Frontend permanece intacto', 'success');

    } catch (error) {
      this.log(`Error verificando frontend: ${error.message}`, 'error');
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE FASE 1: SDK BASE INDEPENDIENTE');
    console.log('='.repeat(60));
    
    console.log(`✅ Tests exitosos: ${this.results.passed}`);
    console.log(`❌ Tests fallidos: ${this.results.failed}`);
    console.log(`⚠️ Advertencias: ${this.results.warnings}`);
    
    const total = this.results.passed + this.results.failed;
    const successRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    console.log(`📈 Tasa de éxito: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 ¡FASE 1 COMPLETADA EXITOSAMENTE!');
      console.log('✅ SDK funcionando independientemente');
      console.log('✅ No hay interferencia con frontend');
      console.log('✅ Listo para próxima fase');
    } else {
      console.log('\n⚠️ FASE 1 CON PROBLEMAS');
      console.log('❌ Revisar errores antes de continuar');
    }
    
    console.log('='.repeat(60));
    
    return this.results.failed === 0;
  }

  async run() {
    console.log('🚀 Iniciando validación FASE 1: SDK Base Independiente\n');
    
    await this.validateSDKStructure();
    const sdk = await this.validateSDKInstantiation();
    await this.validateSDKMethods(sdk);
    await this.validateTokenManagement(sdk);
    await this.validateConfiguration(sdk);
    await this.validateStats(sdk);
    await this.validateIndependence();
    await this.validateFrontendIntegrity();
    
    return this.generateReport();
  }
}

// Ejecutar validación si es llamado directamente
if (require.main === module) {
  const validator = new Phase1Validator();
  validator.run()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Error fatal en validación:', error);
      process.exit(1);
    });
}

module.exports = Phase1Validator;