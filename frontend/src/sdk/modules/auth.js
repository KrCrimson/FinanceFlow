/**
 * 🔐 Módulo de Autenticación
 * 
 * Maneja todas las operaciones relacionadas con autenticación:
 * login, registro, recuperación de contraseña, etc.
 */

class AuthModule {
  constructor(httpClient) {
    this.client = httpClient;
  }

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario y token
   */
  async login(email, password) {
    try {
      const data = await this.client.post('/usuarios/login', {
        email,
        password
      });

      return {
        success: true,
        user: data.usuario,
        token: data.token,
        message: 'Login exitoso'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error en el login',
        ...error
      };
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.nombre - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<Object>} Usuario creado y token
   */
  async register(userData) {
    try {
      const data = await this.client.post('/usuarios/register', userData);

      return {
        success: true,
        user: data.usuario,
        token: data.token,
        message: 'Registro exitoso'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error en el registro',
        ...error
      };
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<Object>}
   */
  async logout() {
    try {
      // Si hay endpoint de logout en el backend
      await this.client.post('/usuarios/logout');

      return {
        success: true,
        message: 'Logout exitoso'
      };
    } catch (error) {
      // Si no hay endpoint, simplemente retornamos éxito
      return {
        success: true,
        message: 'Logout exitoso (local)'
      };
    }
  }

  /**
   * Verificar token actual
   * @returns {Promise<Object>} Usuario actual
   */
  async me() {
    try {
      const data = await this.client.get('/usuarios/me');

      return {
        success: true,
        user: data,
        message: 'Usuario obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener usuario actual',
        ...error
      };
    }
  }

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    try {
      const data = await this.client.post('/usuarios/forgot-password', { email });

      return {
        success: true,
        message: data.message || 'Email de recuperación enviado',
        ...data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al solicitar recuperación de contraseña',
        ...error
      };
    }
  }

  /**
   * Verificar token de reset
   * @param {string} token - Token de reset
   * @returns {Promise<Object>}
   */
  async verifyResetToken(token) {
    try {
      const data = await this.client.post('/usuarios/verify-reset-token', { token });

      return {
        success: true,
        message: 'Token válido',
        ...data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Token inválido o expirado',
        ...error
      };
    }
  }

  /**
   * Resetear contraseña
   * @param {string} token - Token de reset
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>}
   */
  async resetPassword(token, newPassword) {
    try {
      const data = await this.client.post('/usuarios/reset-password', {
        token,
        newPassword
      });

      return {
        success: true,
        message: data.message || 'Contraseña actualizada exitosamente',
        ...data
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al resetear contraseña',
        ...error
      };
    }
  }

  /**
   * Refrescar token JWT
   * @param {string} refreshToken - Token de refresh
   * @returns {Promise<Object>}
   */
  async refreshToken(refreshToken) {
    try {
      const data = await this.client.post('/usuarios/refresh-token', {
        refreshToken
      });

      return {
        success: true,
        token: data.token,
        message: 'Token refrescado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al refrescar token',
        ...error
      };
    }
  }

  /**
   * Cambiar contraseña
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const data = await this.client.put('/usuarios/change-password', {
        currentPassword,
        newPassword
      });

      return {
        success: true,
        message: data.message || 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al cambiar contraseña',
        ...error
      };
    }
  }
}

export default AuthModule;