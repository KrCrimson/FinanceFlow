/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/sdk/index.js
 * Capa / módulo ...: Frontend · SDK
 * Función .........: Punto de entrada del SDK que agrupa los módulos de autenticación, movimientos, reportes y usuarios.
 * Calidad (RNF) ...: RNF-15
 * Depende de ......: frontend/src/sdk/modules/auth.js
 *                    frontend/src/sdk/modules/movimientos.js
 *                    frontend/src/sdk/modules/reportes.js
 *                    frontend/src/sdk/modules/usuarios.js
 *                    frontend/src/sdk/utils/httpClient.js
 * Lo usan .........: frontend/src/services/auth-adapter.js
 *                    frontend/src/services/movimientos-adapter.js
 *                    frontend/src/services/reportes-adapter.js
 *                    frontend/src/services/usuarios-adapter.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * 🚀 Sistema de Balance SDK
 * 
 * SDK wrapper que simplifica el consumo de la API del Sistema de Balance.
 * Proporciona una interfaz limpia y consistente para todas las operaciones.
 * 
 * @example
 * import BalanceSDK from '@sistema-balance/sdk';
 * 
 * const sdk = new BalanceSDK({
 *   baseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/api' : 'http://localhost:5000/api',
 *   token: 'your-jwt-token'
 * });
 * 
 * // Usar los módulos
 * const movimientos = await sdk.movimientos.getAll();
 * const usuario = await sdk.auth.login('email', 'password');
 */

import HttpClient from './utils/httpClient.js';
import AuthModule from './modules/auth.js';
import MovimientosModule from './modules/movimientos.js';
import UsuariosModule from './modules/usuarios.js';
import ReportesModule from './modules/reportes.js';

class BalanceSDK {
  /**
   * Constructor del SDK
   * @param {Object} config - Configuración del SDK
   * @param {string} config.baseURL - URL base de la API
   * @param {string} [config.token] - Token JWT para autenticación
   * @param {number} [config.timeout=10000] - Timeout para requests
   * @param {Object} [config.headers={}] - Headers adicionales
   */
  constructor(config = {}) {
    // Validación de configuración requerida
    if (!config.baseURL) {
      throw new Error('baseURL es requerido en la configuración del SDK');
    }

    // Configuración por defecto
    this.config = {
      timeout: 10000,
      headers: {},
      ...config
    };

    // Cliente HTTP compartido
    this.httpClient = new HttpClient(this.config);

    // Inicializar módulos
    this.auth = new AuthModule(this.httpClient);
    this.movimientos = new MovimientosModule(this.httpClient);
    this.usuarios = new UsuariosModule(this.httpClient);
    this.reportes = new ReportesModule(this.httpClient);

    // Bind del contexto para métodos principales
    this.setToken = this.setToken.bind(this);
    this.removeToken = this.removeToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  /**
   * Establece el token JWT para todas las requests
   * @param {string} token - Token JWT
   */
  setToken(token) {
    this.httpClient.setToken(token);
    return this;
  }

  /**
   * Remueve el token JWT
   */
  removeToken() {
    this.httpClient.removeToken();
    return this;
  }

  /**
   * Verifica si hay un token configurado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.httpClient.hasToken();
  }

  /**
   * Obtiene la configuración actual del SDK
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Actualiza la configuración del SDK
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.httpClient.updateConfig(this.config);
    return this;
  }

  /**
   * Obtiene estadísticas de uso del SDK
   * @returns {Object}
   */
  getStats() {
    return this.httpClient.getStats();
  }

  /**
   * Método de conveniencia para login y configuración automática del token
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y token
   */
  async login(email, password) {
    const result = await this.auth.login(email, password);
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  /**
   * Método de conveniencia para logout y limpieza del token
   */
  async logout() {
    const result = await this.auth.logout();
    this.removeToken();
    return result;
  }
}

export default BalanceSDK;