/**
 * 🔄 Adaptador de Transición - Movimientos Service
 * 
 * FASE 2: Wrapper que mantiene la API existente pero usa el SDK internamente.
 * Permite migración gradual sin romper el frontend existente.
 * 
 * Estrategia:
 * 1. Mantiene exactamente la misma interfaz que el servicio original
 * 2. Internamente usa el SDK nuevo 
 * 3. Feature flags para habilitar/deshabilitar SDK
 * 4. Fallback automático al método original si hay problemas
 * 5. Logging para monitorear la transición
 */

// Importar servicio original para fallback
import * as originalService from './movimientosService.js';
// Importar SDK nuevo
const BalanceSDK = require('../sdk/index.js');

class MovimientosAdapter {
  constructor() {
    // Configuración del SDK
    this.sdk = null;
    this.isSDKEnabled = false;
    this.isSDKInitialized = false;
    this.fallbackToOriginal = false;
    
    // Configuración desde variables de entorno o localStorage
    this.config = {
      enableSDK: process.env.REACT_APP_ENABLE_SDK !== 'false' && 
                 (process.env.REACT_APP_ENABLE_SDK === 'true' || 
                  (typeof localStorage !== 'undefined' && localStorage.getItem('enable_sdk') !== 'false') ||
                  process.env.NODE_ENV === 'production'), // Habilitado por defecto en production
      apiUrl: process.env.REACT_APP_API_URL || window.location.origin,
      debug: process.env.REACT_APP_SDK_DEBUG === 'true' || false
    };

    // Intentar inicializar SDK si está habilitado
    this.initializeSDK();
  }

  /**
   * Inicializa el SDK si está habilitado
   */
  async initializeSDK() {
    if (!this.config.enableSDK) {
      this.log('SDK deshabilitado por configuración', 'info');
      return;
    }

    try {
      this.sdk = new BalanceSDK({
        baseURL: `${this.config.apiUrl}/api`,
        timeout: 10000
      });

      // Configurar token si existe
      const token = this.getToken();
      if (token) {
        this.sdk.setToken(token);
      }

      this.isSDKEnabled = true;
      this.isSDKInitialized = true;
      this.log('SDK inicializado exitosamente', 'success');
    } catch (error) {
      this.log(`Error inicializando SDK: ${error.message}`, 'error');
      this.fallbackToOriginal = true;
    }
  }

  /**
   * Obtiene token del localStorage
   */
  getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Logging para monitorear transición
   */
  log(message, level = 'info') {
    if (!this.config.debug) return;
    
    const timestamp = new Date().toISOString();
    const prefix = {
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️'
    }[level] || 'ℹ️';
    
    console.log(`[${timestamp}] ${prefix} [MovimientosAdapter] ${message}`);
  }

  /**
   * Actualiza token en el SDK cuando cambie
   */
  updateToken(token) {
    if (this.sdk && this.isSDKEnabled) {
      if (token) {
        this.sdk.setToken(token);
        this.log('Token actualizado en SDK', 'info');
      } else {
        this.sdk.removeToken();
        this.log('Token removido del SDK', 'info');
      }
    }
  }

  /**
   * Habilita el SDK en tiempo de ejecución
   */
  enableSDK() {
    this.config.enableSDK = true;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('enable_sdk', 'true');
    }
    this.initializeSDK();
    this.log('SDK habilitado manualmente', 'success');
  }

  /**
   * Deshabilita el SDK y usa método original
   */
  disableSDK() {
    this.isSDKEnabled = false;
    this.fallbackToOriginal = true;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('enable_sdk', 'false');
    }
    this.log('SDK deshabilitado - usando método original', 'warning');
  }

  /**
   * Wrapper para manejo de errores con fallback
   */
  async executeWithFallback(sdkMethod, originalMethod, methodName, ...args) {
    // Si no está habilitado el SDK, usar original directamente
    if (!this.isSDKEnabled || this.fallbackToOriginal) {
      this.log(`Usando método original para ${methodName}`, 'info');
      return await originalMethod(...args);
    }

    try {
      this.log(`Intentando ${methodName} con SDK`, 'info');
      const result = await sdkMethod(...args);
      
      // Adaptar respuesta del SDK al formato esperado por el frontend
      return this.adaptSDKResponse(result, methodName);
    } catch (error) {
      this.log(`Error en SDK para ${methodName}: ${error.message}`, 'error');
      this.log(`Fallback a método original para ${methodName}`, 'warning');
      
      // Fallback al método original
      return await originalMethod(...args);
    }
  }

  /**
   * Adapta la respuesta del SDK al formato esperado por el frontend
   */
  adaptSDKResponse(sdkResult, methodName) {
    if (!sdkResult || !sdkResult.success) {
      throw new Error(sdkResult?.message || 'Error en respuesta del SDK');
    }

    // Para diferentes métodos, extraer los datos correctos
    switch (methodName) {
      case 'getMovimientos':
        return sdkResult.movimientos || [];
      
      case 'createMovimiento':
      case 'updateMovimiento':
        return sdkResult.movimiento || sdkResult;
      
      case 'deleteMovimiento':
        return { message: sdkResult.message || 'Movimiento eliminado' };
      
      default:
        return sdkResult.data || sdkResult;
    }
  }

  /**
   * INTERFAZ PÚBLICA - Mantiene exactamente la misma API del servicio original
   */

  /**
   * Obtener todos los movimientos
   * Mantiene la misma interfaz que getMovimientos() original
   */
  async getMovimientos() {
    return this.executeWithFallback(
      async () => await this.sdk.movimientos.getAll(),
      originalService.getMovimientos,
      'getMovimientos'
    );
  }

  /**
   * Crear nuevo movimiento
   * Mantiene la misma interfaz que createMovimiento(data) original
   */
  async createMovimiento(data) {
    return this.executeWithFallback(
      async (movimientoData) => await this.sdk.movimientos.create(movimientoData),
      originalService.createMovimiento,
      'createMovimiento',
      data
    );
  }

  /**
   * Actualizar movimiento existente
   * Mantiene la misma interfaz que updateMovimiento(id, data) original
   */
  async updateMovimiento(id, data) {
    return this.executeWithFallback(
      async (movimientoId, updateData) => await this.sdk.movimientos.update(movimientoId, updateData),
      originalService.updateMovimiento,
      'updateMovimiento',
      id,
      data
    );
  }

  /**
   * Inhabilitar movimiento
   * Mantiene la misma interfaz que inhabilitarMovimiento(id) original
   */
  async inhabilitarMovimiento(id) {
    return this.executeWithFallback(
      async (movimientoId) => {
        // El SDK usa delete, pero necesitamos mantener la semántica de "inhabilitar"
        // Podríamos usar update con un campo "activo: false" o implementar endpoint específico
        const result = await this.sdk.movimientos.delete(movimientoId);
        return { message: 'Movimiento inhabilitado exitosamente' };
      },
      originalService.inhabilitarMovimiento,
      'inhabilitarMovimiento',
      id
    );
  }

  /**
   * Métodos adicionales del SDK que pueden ser utilizados gradualmente
   */

  /**
   * Obtener movimiento por ID (nuevo método del SDK)
   */
  async getMovimientoById(id) {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.movimientos.getById(id);
      return this.adaptSDKResponse(result, 'getMovimientoById');
    } catch (error) {
      this.log(`Error obteniendo movimiento ${id}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Obtener solo ingresos (nuevo método del SDK)
   */
  async getIngresos(params = {}) {
    if (!this.isSDKEnabled) {
      // Fallback: filtrar movimientos manualmente
      const movimientos = await this.getMovimientos();
      return movimientos.filter(m => m.tipo === 'ingreso');
    }
    
    try {
      const result = await this.sdk.movimientos.getIngresos(params);
      return this.adaptSDKResponse(result, 'getIngresos');
    } catch (error) {
      this.log(`Error obteniendo ingresos: ${error.message}`, 'error');
      // Fallback manual
      const movimientos = await this.getMovimientos();
      return movimientos.filter(m => m.tipo === 'ingreso');
    }
  }

  /**
   * Obtener solo egresos (nuevo método del SDK)
   */
  async getEgresos(params = {}) {
    if (!this.isSDKEnabled) {
      const movimientos = await this.getMovimientos();
      return movimientos.filter(m => m.tipo === 'egreso');
    }
    
    try {
      const result = await this.sdk.movimientos.getEgresos(params);
      return this.adaptSDKResponse(result, 'getEgresos');
    } catch (error) {
      this.log(`Error obteniendo egresos: ${error.message}`, 'error');
      const movimientos = await this.getMovimientos();
      return movimientos.filter(m => m.tipo === 'egreso');
    }
  }

  /**
   * Obtener resumen financiero (nuevo método del SDK)
   */
  async getResumen(params = {}) {
    if (!this.isSDKEnabled) {
      // Calcular resumen manualmente
      const movimientos = await this.getMovimientos();
      return this.calculateResumen(movimientos, params);
    }
    
    try {
      const result = await this.sdk.movimientos.getResumen(params);
      return this.adaptSDKResponse(result, 'getResumen');
    } catch (error) {
      this.log(`Error obteniendo resumen: ${error.message}`, 'error');
      const movimientos = await this.getMovimientos();
      return this.calculateResumen(movimientos, params);
    }
  }

  /**
   * Calcular resumen manualmente (fallback)
   */
  calculateResumen(movimientos, params = {}) {
    const ingresos = movimientos
      .filter(m => m.tipo === 'ingreso')
      .reduce((sum, m) => sum + (m.monto || 0), 0);
    
    const egresos = movimientos
      .filter(m => m.tipo === 'egreso')
      .reduce((sum, m) => sum + (m.monto || 0), 0);
    
    return {
      ingresos,
      egresos,
      balance: ingresos - egresos,
      totalMovimientos: movimientos.length,
      periodo: params.mes || 'actual'
    };
  }

  /**
   * Obtener estadísticas del adaptador
   */
  getAdapterStats() {
    return {
      sdkEnabled: this.isSDKEnabled,
      sdkInitialized: this.isSDKInitialized,
      fallbackMode: this.fallbackToOriginal,
      sdkStats: this.sdk ? this.sdk.getStats() : null
    };
  }
}

// Crear instancia singleton del adaptador
const movimientosAdapter = new MovimientosAdapter();

// Exportar los métodos manteniendo la misma interfaz
export const getMovimientos = (...args) => movimientosAdapter.getMovimientos(...args);
export const createMovimiento = (...args) => movimientosAdapter.createMovimiento(...args);
export const updateMovimiento = (...args) => movimientosAdapter.updateMovimiento(...args);
export const inhabilitarMovimiento = (...args) => movimientosAdapter.inhabilitarMovimiento(...args);

// Exportar métodos nuevos del SDK (opcionales)
export const getMovimientoById = (...args) => movimientosAdapter.getMovimientoById(...args);
export const getIngresos = (...args) => movimientosAdapter.getIngresos(...args);
export const getEgresos = (...args) => movimientosAdapter.getEgresos(...args);
export const getResumen = (...args) => movimientosAdapter.getResumen(...args);

// Exportar controles del adaptador
export const enableSDK = () => movimientosAdapter.enableSDK();
export const disableSDK = () => movimientosAdapter.disableSDK();
export const updateToken = (token) => movimientosAdapter.updateToken(token);
export const getAdapterStats = () => movimientosAdapter.getAdapterStats();

// Exportar instancia para uso avanzado
export { movimientosAdapter };

// Default export mantiene compatibilidad
export default {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  inhabilitarMovimiento,
  // Métodos nuevos
  getMovimientoById,
  getIngresos,
  getEgresos,
  getResumen,
  // Controles
  enableSDK,
  disableSDK,
  updateToken,
  getAdapterStats
};