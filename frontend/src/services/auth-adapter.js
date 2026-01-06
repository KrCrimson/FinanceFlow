/**
 * 🔄 Adaptador de Autenticación - Auth Service
 * 
 * FASE 2: Wrapper que mantiene la API existente pero usa el SDK internamente.
 * Permite migración gradual sin romper el frontend existente.
 */

// Importar servicio original para fallback
import * as originalService from './authService.js';
// Importar SDK y configuración
const BalanceSDK = require('./adapter-config.js').default || require('./adapter-config.js');

class AuthAdapter {
  constructor() {
    // Configuración del SDK
    this.sdk = null;
    this.isSDKEnabled = false;
    this.isSDKInitialized = false;
    this.fallbackToOriginal = false;
    
    // Configuración desde AdapterConfig
    this.config = this.loadConfig();
    
    // Callbacks de autenticación (mantener compatibilidad)
    this.authCallbacks = [];

    // Intentar inicializar SDK si está habilitado
    this.initializeSDK();
  }

  /**
   * Cargar configuración desde AdapterConfig
   */
  loadConfig() {
    try {
      const adapterConfig = require('./adapter-config.js').default || require('./adapter-config.js');
      return {
        enableSDK: adapterConfig.isAdapterEnabled('auth'),
        sdkConfig: adapterConfig.getSDKConfig(),
        debug: adapterConfig.getLoggingConfig().enabled
      };
    } catch (error) {
      this.log('Error cargando configuración, usando defaults', 'warning');
      return {
        enableSDK: false,
        sdkConfig: { baseURL: 'http://localhost:3000/api' },
        debug: false
      };
    }
  }

  /**
   * Inicializa el SDK si está habilitado
   */
  async initializeSDK() {
    if (!this.config.enableSDK) {
      this.log('SDK Auth deshabilitado por configuración', 'info');
      return;
    }

    try {
      const BalanceSDK = require('../sdk/index.js');
      this.sdk = new BalanceSDK(this.config.sdkConfig);

      // Configurar token si existe
      const token = this.getToken();
      if (token) {
        this.sdk.setToken(token);
      }

      this.isSDKEnabled = true;
      this.isSDKInitialized = true;
      this.log('SDK Auth inicializado exitosamente', 'success');
    } catch (error) {
      this.log(`Error inicializando SDK Auth: ${error.message}`, 'error');
      this.fallbackToOriginal = true;
    }
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
    
    console.log(`[${timestamp}] ${prefix} [AuthAdapter] ${message}`);
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
      case 'login':
        return {
          token: sdkResult.token,
          usuario: sdkResult.usuario,
          message: sdkResult.message || 'Login exitoso'
        };
      
      case 'register':
        return {
          usuario: sdkResult.usuario,
          message: sdkResult.message || 'Registro exitoso'
        };
      
      default:
        return sdkResult.data || sdkResult;
    }
  }

  /**
   * INTERFAZ PÚBLICA - Mantiene exactamente la misma API del servicio original
   */

  /**
   * Login de usuario
   * Mantiene la misma interfaz que login(email, password) original
   */
  async login(email, password) {
    const result = await this.executeWithFallback(
      async () => await this.sdk.auth.login(email, password),
      originalService.login,
      'login',
      email,
      password
    );

    // Notificar cambios de autenticación (mantener compatibilidad)
    this.notifyAuthChange();
    
    return result;
  }

  /**
   * Registro de usuario
   * Mantiene la misma interfaz que register(nombre, email, password) original
   */
  async register(nombre, email, password) {
    return this.executeWithFallback(
      async () => await this.sdk.auth.register(nombre, email, password),
      originalService.register,
      'register',
      nombre,
      email,
      password
    );
  }

  /**
   * Logout de usuario
   * Mantiene la misma interfaz que logout() original
   */
  logout() {
    // Ejecutar logout original (maneja localStorage y callbacks)
    originalService.logout();
    
    // Si SDK está habilitado, también limpiarlo
    if (this.isSDKEnabled && this.sdk) {
      this.sdk.removeToken();
      this.log('Token removido del SDK durante logout', 'info');
    }
  }

  /**
   * Obtener token actual
   * Mantiene la misma interfaz que getToken() original
   */
  getToken() {
    return originalService.getToken();
  }

  /**
   * Verificar si token es válido
   * Mantiene la misma interfaz que isTokenValid() original
   */
  isTokenValid() {
    // Usar validación original que maneja expiración automática
    return originalService.isTokenValid();
  }

  /**
   * Registro de callback de cambio de auth (mantener compatibilidad)
   * Mantiene la misma interfaz que onAuthChange(callback) original
   */
  onAuthChange(callback) {
    return originalService.onAuthChange(callback);
  }

  /**
   * Notificar cambios de autenticación (uso interno)
   */
  notifyAuthChange() {
    // El servicio original maneja esto internamente
    // Solo asegurar que el SDK tenga el token actualizado
    if (this.isSDKEnabled && this.sdk) {
      const token = this.getToken();
      if (token) {
        this.sdk.setToken(token);
      } else {
        this.sdk.removeToken();
      }
    }
  }

  /**
   * Métodos adicionales del SDK (opcionales)
   */

  /**
   * Validar token con el servidor (nuevo método del SDK)
   */
  async validateTokenWithServer() {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.auth.validateToken();
      return this.adaptSDKResponse(result, 'validateToken');
    } catch (error) {
      this.log(`Error validando token: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Refresh token (nuevo método del SDK)
   */
  async refreshToken() {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.auth.refreshToken();
      const adaptedResult = this.adaptSDKResponse(result, 'refreshToken');
      
      // Actualizar localStorage con nuevo token
      if (adaptedResult.token) {
        localStorage.setItem('token', adaptedResult.token);
        this.notifyAuthChange();
      }
      
      return adaptedResult;
    } catch (error) {
      this.log(`Error refrescando token: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Cambiar contraseña (nuevo método del SDK)
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.auth.changePassword(currentPassword, newPassword);
      return this.adaptSDKResponse(result, 'changePassword');
    } catch (error) {
      this.log(`Error cambiando contraseña: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario actual (nuevo método del SDK)
   */
  async getCurrentUser() {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.auth.getCurrentUser();
      return this.adaptSDKResponse(result, 'getCurrentUser');
    } catch (error) {
      this.log(`Error obteniendo usuario actual: ${error.message}`, 'error');
      throw error;
    }
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
const authAdapter = new AuthAdapter();

// Exportar los métodos manteniendo la misma interfaz
export const login = (...args) => authAdapter.login(...args);
export const register = (...args) => authAdapter.register(...args);
export const logout = (...args) => authAdapter.logout(...args);
export const getToken = (...args) => authAdapter.getToken(...args);
export const isTokenValid = (...args) => authAdapter.isTokenValid(...args);
export const onAuthChange = (...args) => authAdapter.onAuthChange(...args);

// Exportar métodos nuevos del SDK (opcionales)
export const validateTokenWithServer = (...args) => authAdapter.validateTokenWithServer(...args);
export const refreshToken = (...args) => authAdapter.refreshToken(...args);
export const changePassword = (...args) => authAdapter.changePassword(...args);
export const getCurrentUser = (...args) => authAdapter.getCurrentUser(...args);

// Exportar controles del adaptador
export const getAdapterStats = () => authAdapter.getAdapterStats();

// Exportar instancia para uso avanzado
export { authAdapter };

// Default export mantiene compatibilidad
export default {
  login,
  register,
  logout,
  getToken,
  isTokenValid,
  onAuthChange,
  // Métodos nuevos
  validateTokenWithServer,
  refreshToken,
  changePassword,
  getCurrentUser,
  // Controles
  getAdapterStats
};