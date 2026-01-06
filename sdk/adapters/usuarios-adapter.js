/**
 * 🔄 Adaptador de Usuarios - User Service
 * 
 * FASE 2: Wrapper que mantiene la API existente pero usa el SDK internamente.
 * Permite migración gradual sin romper el frontend existente.
 */

// Importar servicio original para fallback
import * as originalService from './userService.js';

class UsuariosAdapter {
  constructor() {
    // Configuración del SDK
    this.sdk = null;
    this.isSDKEnabled = false;
    this.isSDKInitialized = false;
    this.fallbackToOriginal = false;
    
    // Configuración desde AdapterConfig
    this.config = this.loadConfig();

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
        enableSDK: adapterConfig.isAdapterEnabled('usuarios'),
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
      this.log('SDK Usuarios deshabilitado por configuración', 'info');
      return;
    }

    try {
      const BalanceSDK = require('../../sdk/src/index.js');
      this.sdk = new BalanceSDK(this.config.sdkConfig);

      // Configurar token si existe
      const token = this.getToken();
      if (token) {
        this.sdk.setToken(token);
      }

      this.isSDKEnabled = true;
      this.isSDKInitialized = true;
      this.log('SDK Usuarios inicializado exitosamente', 'success');
    } catch (error) {
      this.log(`Error inicializando SDK Usuarios: ${error.message}`, 'error');
      this.fallbackToOriginal = true;
    }
  }

  /**
   * Obtener token del localStorage
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
    
    console.log(`[${timestamp}] ${prefix} [UsuariosAdapter] ${message}`);
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
      case 'getProfile':
        return sdkResult.usuario || sdkResult.data;
      
      case 'updateProfile':
        return sdkResult.usuario || sdkResult.data;
      
      default:
        return sdkResult.data || sdkResult;
    }
  }

  /**
   * INTERFAZ PÚBLICA - Mantiene exactamente la misma API del servicio original
   */

  /**
   * Obtener perfil del usuario
   * Mantiene la misma interfaz que getProfile() original
   */
  async getProfile() {
    return this.executeWithFallback(
      async () => await this.sdk.usuarios.getProfile(),
      originalService.getProfile,
      'getProfile'
    );
  }

  /**
   * Actualizar perfil del usuario
   * Mantiene la misma interfaz que updateProfile(data) original
   */
  async updateProfile(data) {
    return this.executeWithFallback(
      async (profileData) => await this.sdk.usuarios.updateProfile(profileData),
      originalService.updateProfile,
      'updateProfile',
      data
    );
  }

  /**
   * Métodos adicionales del SDK (opcionales)
   */

  /**
   * Cambiar contraseña del usuario (nuevo método del SDK)
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.usuarios.changePassword(currentPassword, newPassword);
      return this.adaptSDKResponse(result, 'changePassword');
    } catch (error) {
      this.log(`Error cambiando contraseña: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Obtener configuraciones del usuario (nuevo método del SDK)
   */
  async getUserSettings() {
    if (!this.isSDKEnabled) {
      // Fallback: retornar configuraciones por defecto
      return {
        theme: 'light',
        notifications: true,
        language: 'es'
      };
    }
    
    try {
      const result = await this.sdk.usuarios.getSettings();
      return this.adaptSDKResponse(result, 'getUserSettings');
    } catch (error) {
      this.log(`Error obteniendo configuraciones: ${error.message}`, 'error');
      // Fallback a configuraciones por defecto
      return {
        theme: 'light',
        notifications: true,
        language: 'es'
      };
    }
  }

  /**
   * Actualizar configuraciones del usuario (nuevo método del SDK)
   */
  async updateUserSettings(settings) {
    if (!this.isSDKEnabled) {
      // Fallback: guardar en localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(settings));
      }
      return settings;
    }
    
    try {
      const result = await this.sdk.usuarios.updateSettings(settings);
      return this.adaptSDKResponse(result, 'updateUserSettings');
    } catch (error) {
      this.log(`Error actualizando configuraciones: ${error.message}`, 'error');
      // Fallback a localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(settings));
      }
      return settings;
    }
  }

  /**
   * Obtener historial de actividad del usuario (nuevo método del SDK)
   */
  async getUserActivity(params = {}) {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.usuarios.getActivity(params);
      return this.adaptSDKResponse(result, 'getUserActivity');
    } catch (error) {
      this.log(`Error obteniendo actividad: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Eliminar cuenta de usuario (nuevo método del SDK)
   */
  async deleteAccount(password) {
    if (!this.isSDKEnabled) {
      throw new Error('Método disponible solo con SDK habilitado');
    }
    
    try {
      const result = await this.sdk.usuarios.deleteAccount(password);
      
      // Si se elimina exitosamente, limpiar localStorage
      if (result.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('userSettings');
      }
      
      return this.adaptSDKResponse(result, 'deleteAccount');
    } catch (error) {
      this.log(`Error eliminando cuenta: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Actualizar token en el SDK cuando cambie
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
const usuariosAdapter = new UsuariosAdapter();

// Exportar los métodos manteniendo la misma interfaz
export const getProfile = (...args) => usuariosAdapter.getProfile(...args);
export const updateProfile = (...args) => usuariosAdapter.updateProfile(...args);

// Exportar métodos nuevos del SDK (opcionales)
export const changePassword = (...args) => usuariosAdapter.changePassword(...args);
export const getUserSettings = (...args) => usuariosAdapter.getUserSettings(...args);
export const updateUserSettings = (...args) => usuariosAdapter.updateUserSettings(...args);
export const getUserActivity = (...args) => usuariosAdapter.getUserActivity(...args);
export const deleteAccount = (...args) => usuariosAdapter.deleteAccount(...args);

// Exportar controles del adaptador
export const updateToken = (token) => usuariosAdapter.updateToken(token);
export const getAdapterStats = () => usuariosAdapter.getAdapterStats();

// Exportar instancia para uso avanzado
export { usuariosAdapter };

// Default export mantiene compatibilidad
export default {
  getProfile,
  updateProfile,
  // Métodos nuevos
  changePassword,
  getUserSettings,
  updateUserSettings,
  getUserActivity,
  deleteAccount,
  // Controles
  updateToken,
  getAdapterStats
};