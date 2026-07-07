/**
 * 🌐 HTTP Client
 * 
 * Cliente HTTP centralizado que maneja todas las comunicaciones con la API.
 * Incluye manejo de autenticación, interceptors, retry logic y estadísticas.
 */

import axios from 'axios';

class HttpClient {
  constructor(config) {
    this.config = config;
    this.stats = {
      requests: 0,
      errors: 0,
      lastRequest: null,
      startTime: Date.now()
    };

    // Crear instancia de axios con configuración base
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    // Configurar interceptors
    this.setupInterceptors();
  }

  /**
   * Configura interceptors para requests y responses
   */
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.stats.requests++;
        this.stats.lastRequest = Date.now();
        
        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 SDK Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        this.stats.errors++;
        return Promise.reject(this.formatError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ SDK Response: ${response.status} ${response.config.url}`);
        }
        
        return response;
      },
      (error) => {
        this.stats.errors++;
        
        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ SDK Error: ${error.response?.status || 'Network'} ${error.config?.url}`);
        }
        
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Formatea errores para consistencia
   * @param {Error} error - Error original
   * @returns {Object} Error formateado
   */
  formatError(error) {
    const formattedError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      timestamp: new Date().toISOString()
    };

    // Mensajes específicos según el tipo de error
    if (error.response) {
      // Error de respuesta del servidor
      formattedError.type = 'response_error';
      formattedError.message = error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      // Error de red
      formattedError.type = 'network_error';
      formattedError.message = 'Error de conexión con el servidor';
    } else {
      // Error de configuración
      formattedError.type = 'config_error';
    }

    return formattedError;
  }

  /**
   * Establece el token JWT
   * @param {string} token - Token JWT
   */
  setToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remueve el token JWT
   */
  removeToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Verifica si hay un token configurado
   * @returns {boolean}
   */
  hasToken() {
    return !!this.client.defaults.headers.common['Authorization'];
  }

  /**
   * Actualiza la configuración del cliente
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Actualizar configuración de axios
    this.client.defaults.baseURL = newConfig.baseURL;
    this.client.defaults.timeout = newConfig.timeout;
    
    if (newConfig.headers) {
      Object.assign(this.client.defaults.headers, newConfig.headers);
    }
  }

  /**
   * Obtiene estadísticas de uso
   * @returns {Object}
   */
  getStats() {
    return {
      ...this.stats,
      uptime: Date.now() - this.stats.startTime,
      successRate: this.stats.requests > 0 
        ? ((this.stats.requests - this.stats.errors) / this.stats.requests * 100).toFixed(2) + '%'
        : '100%'
    };
  }

  /**
   * Realiza una petición GET
   * @param {string} url - URL del endpoint
   * @param {Object} config - Configuración adicional
   * @returns {Promise<any>}
   */
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  /**
   * Realiza una petición POST
   * @param {string} url - URL del endpoint
   * @param {any} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise<any>}
   */
  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  /**
   * Realiza una petición PUT
   * @param {string} url - URL del endpoint
   * @param {any} data - Datos a enviar
   * @param {Object} config - Configuración adicional
   * @returns {Promise<any>}
   */
  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL del endpoint
   * @param {Object} config - Configuración adicional
   * @returns {Promise<any>}
   */
  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export default HttpClient;