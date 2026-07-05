/**
 * ⚙️ Configuración del Sistema de Adaptadores
 * 
 * FASE 2: Sistema de configuración centralizado para controlar la transición
 * gradual del SDK manteniendo compatibilidad con el frontend existente.
 */

class AdapterConfig {
  constructor() {
    this.defaultConfig = {
      // Configuración principal del SDK
      sdk: {
        enabled: false,  // Por defecto deshabilitado para seguridad
        baseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/api' : 'http://localhost:5000/api',
        timeout: 10000,
        retries: 3,
        debug: false
      },
      
      // Configuración de adaptadores específicos
      adapters: {
        movimientos: {
          enabled: false,
          fallbackOnError: true,
          logTransitions: true,
          newMethodsEnabled: true  // getMovimientoById, getIngresos, etc.
        },
        auth: {
          enabled: false,
          fallbackOnError: true,
          logTransitions: true
        },
        usuarios: {
          enabled: false,
          fallbackOnError: true,
          logTransitions: true
        },
        reportes: {
          enabled: false,
          fallbackOnError: true,
          logTransitions: true
        }
      },
      
      // Configuración de migración gradual
      migration: {
        phase: 'disabled',  // disabled, testing, partial, full
        rolloutPercentage: 0,  // % de usuarios que usan SDK
        featureFlags: {
          'sdk-movimientos': false,
          'sdk-auth': false,
          'sdk-usuarios': false,
          'sdk-reportes': false
        }
      },
      
      // Configuración de logging y monitoreo
      logging: {
        enabled: false,
        level: 'info',  // error, warning, info, debug
        logToConsole: true,
        logToLocalStorage: false,
        maxLogEntries: 100
      }
    };
    
    this.currentConfig = { ...this.defaultConfig };
    this.loadConfiguration();
  }

  /**
   * Cargar configuración desde múltiples fuentes
   */
  loadConfiguration() {
    // 1. Variables de entorno (prioridad más alta)
    this.loadFromEnvironment();
    
    // 2. localStorage (configuración del usuario)
    this.loadFromLocalStorage();
    
    // 3. Configuración remota (si existe)
    this.loadFromRemote();
    
    this.logConfigState();
  }

  /**
   * Cargar configuración desde variables de entorno
   */
  loadFromEnvironment() {
    if (typeof process === 'undefined' || !process.env) return;
    
    const envConfig = {
      sdk: {
        enabled: process.env.REACT_APP_SDK_ENABLED === 'true',
        baseURL: process.env.REACT_APP_API_URL || this.currentConfig.sdk.baseURL,
        timeout: parseInt(process.env.REACT_APP_SDK_TIMEOUT) || this.currentConfig.sdk.timeout,
        debug: process.env.REACT_APP_SDK_DEBUG === 'true'
      },
      
      migration: {
        phase: process.env.REACT_APP_MIGRATION_PHASE || this.currentConfig.migration.phase,
        rolloutPercentage: parseInt(process.env.REACT_APP_ROLLOUT_PERCENTAGE) || 0
      },
      
      logging: {
        enabled: process.env.REACT_APP_LOGGING_ENABLED === 'true',
        level: process.env.REACT_APP_LOG_LEVEL || this.currentConfig.logging.level
      }
    };
    
    this.mergeConfig(envConfig);
  }

  /**
   * Cargar configuración desde localStorage
   */
  loadFromLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const savedConfig = localStorage.getItem('balance_adapter_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.mergeConfig(parsed);
      }
    } catch (error) {
      console.warn('Error loading config from localStorage:', error);
    }
  }

  /**
   * Cargar configuración remota (futuro)
   */
  async loadFromRemote() {
    // TODO: Implementar carga de configuración desde API
    // Para updates en tiempo real sin desplegar
  }

  /**
   * Mezclar configuración manteniendo estructura
   */
  mergeConfig(newConfig) {
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    
    deepMerge(this.currentConfig, newConfig);
  }

  /**
   * Guardar configuración en localStorage
   */
  saveToLocalStorage() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem('balance_adapter_config', JSON.stringify(this.currentConfig));
    } catch (error) {
      console.warn('Error saving config to localStorage:', error);
    }
  }

  /**
   * API PÚBLICA - Getters
   */
  
  getSDKConfig() {
    return { ...this.currentConfig.sdk };
  }
  
  getAdapterConfig(adapterName) {
    return { ...this.currentConfig.adapters[adapterName] } || {};
  }
  
  getMigrationConfig() {
    return { ...this.currentConfig.migration };
  }
  
  getLoggingConfig() {
    return { ...this.currentConfig.logging };
  }
  
  isSDKEnabled() {
    return this.currentConfig.sdk.enabled;
  }
  
  isAdapterEnabled(adapterName) {
    return this.currentConfig.adapters[adapterName]?.enabled || false;
  }
  
  isFeatureFlagEnabled(flagName) {
    return this.currentConfig.migration.featureFlags[flagName] || false;
  }

  /**
   * API PÚBLICA - Setters
   */
  
  enableSDK() {
    this.currentConfig.sdk.enabled = true;
    this.saveToLocalStorage();
    this.logConfigChange('SDK enabled');
  }
  
  disableSDK() {
    this.currentConfig.sdk.enabled = false;
    this.saveToLocalStorage();
    this.logConfigChange('SDK disabled');
  }
  
  enableAdapter(adapterName) {
    if (this.currentConfig.adapters[adapterName]) {
      this.currentConfig.adapters[adapterName].enabled = true;
      this.saveToLocalStorage();
      this.logConfigChange(`Adapter ${adapterName} enabled`);
    }
  }
  
  disableAdapter(adapterName) {
    if (this.currentConfig.adapters[adapterName]) {
      this.currentConfig.adapters[adapterName].enabled = false;
      this.saveToLocalStorage();
      this.logConfigChange(`Adapter ${adapterName} disabled`);
    }
  }
  
  setFeatureFlag(flagName, enabled) {
    this.currentConfig.migration.featureFlags[flagName] = enabled;
    this.saveToLocalStorage();
    this.logConfigChange(`Feature flag ${flagName} set to ${enabled}`);
  }
  
  setMigrationPhase(phase) {
    const validPhases = ['disabled', 'testing', 'partial', 'full'];
    if (validPhases.includes(phase)) {
      this.currentConfig.migration.phase = phase;
      this.saveToLocalStorage();
      this.logConfigChange(`Migration phase set to ${phase}`);
    }
  }
  
  setRolloutPercentage(percentage) {
    if (percentage >= 0 && percentage <= 100) {
      this.currentConfig.migration.rolloutPercentage = percentage;
      this.saveToLocalStorage();
      this.logConfigChange(`Rollout percentage set to ${percentage}%`);
    }
  }

  /**
   * CONTROL DE MIGRACIÓN GRADUAL
   */
  
  shouldUseSDK(userId = null) {
    // 1. Verificar si SDK está globalmente habilitado
    if (!this.isSDKEnabled()) return false;
    
    // 2. Verificar fase de migración
    const phase = this.currentConfig.migration.phase;
    switch (phase) {
      case 'disabled':
        return false;
      case 'testing':
        // Solo para usuarios específicos o en desarrollo
        return this.isTestingUser(userId);
      case 'partial':
        // Rollout gradual basado en porcentaje
        return this.isInRollout(userId);
      case 'full':
        return true;
      default:
        return false;
    }
  }
  
  isTestingUser(userId) {
    // Lista de usuarios beta o desarrollo
    const testUsers = this.currentConfig.migration.testUsers || [];
    return testUsers.includes(userId) || 
           (typeof localStorage !== 'undefined' && localStorage.getItem('sdk_beta_user') === 'true');
  }
  
  isInRollout(userId) {
    const percentage = this.currentConfig.migration.rolloutPercentage;
    if (percentage === 0) return false;
    if (percentage === 100) return true;
    
    // Hash simple basado en userId para consistencia
    if (userId) {
      const hash = this.simpleHash(userId);
      return (hash % 100) < percentage;
    }
    
    // Fallback random para usuarios anónimos
    return Math.random() * 100 < percentage;
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * LOGGING Y MONITOREO
   */
  
  logConfigState() {
    if (!this.currentConfig.logging.enabled) return;
    
    console.log('🔧 [AdapterConfig] Configuration loaded:', {
      sdk: this.currentConfig.sdk.enabled ? '✅ Enabled' : '❌ Disabled',
      phase: this.currentConfig.migration.phase,
      rollout: `${this.currentConfig.migration.rolloutPercentage}%`,
      adapters: Object.entries(this.currentConfig.adapters)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name)
    });
  }
  
  logConfigChange(message) {
    if (!this.currentConfig.logging.enabled) return;
    
    const timestamp = new Date().toISOString();
    console.log(`🔧 [AdapterConfig] ${timestamp} ${message}`);
    
    // Guardar en localStorage si está habilitado
    if (this.currentConfig.logging.logToLocalStorage) {
      this.saveLogEntry(message);
    }
  }
  
  saveLogEntry(message) {
    try {
      const logs = JSON.parse(localStorage.getItem('adapter_logs') || '[]');
      logs.push({
        timestamp: new Date().toISOString(),
        message,
        config: this.getConfigSummary()
      });
      
      // Mantener solo las últimas entradas
      const maxEntries = this.currentConfig.logging.maxLogEntries;
      if (logs.length > maxEntries) {
        logs.splice(0, logs.length - maxEntries);
      }
      
      localStorage.setItem('adapter_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Error saving log entry:', error);
    }
  }
  
  getConfigSummary() {
    return {
      sdkEnabled: this.currentConfig.sdk.enabled,
      phase: this.currentConfig.migration.phase,
      rollout: this.currentConfig.migration.rolloutPercentage,
      enabledAdapters: Object.entries(this.currentConfig.adapters)
        .filter(([_, config]) => config.enabled)
        .map(([name, _]) => name)
    };
  }

  /**
   * UTILIDADES DE DEBUG
   */
  
  getFullConfig() {
    return JSON.parse(JSON.stringify(this.currentConfig));
  }
  
  resetConfig() {
    this.currentConfig = { ...this.defaultConfig };
    this.saveToLocalStorage();
    this.logConfigChange('Configuration reset to defaults');
  }
  
  exportConfig() {
    return {
      config: this.getFullConfig(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }
  
  importConfig(configData) {
    try {
      if (configData.config) {
        this.currentConfig = { ...configData.config };
        this.saveToLocalStorage();
        this.logConfigChange('Configuration imported successfully');
        return true;
      }
    } catch (error) {
      console.error('Error importing configuration:', error);
    }
    return false;
  }
}

// Crear instancia singleton
const adapterConfig = new AdapterConfig();

// Exportar instancia y métodos principales
export default adapterConfig;

export const {
  getSDKConfig,
  getAdapterConfig,
  getMigrationConfig,
  getLoggingConfig,
  isSDKEnabled,
  isAdapterEnabled,
  isFeatureFlagEnabled,
  enableSDK,
  disableSDK,
  enableAdapter,
  disableAdapter,
  setFeatureFlag,
  setMigrationPhase,
  setRolloutPercentage,
  shouldUseSDK,
  getFullConfig,
  resetConfig,
  exportConfig,
  importConfig
} = adapterConfig;