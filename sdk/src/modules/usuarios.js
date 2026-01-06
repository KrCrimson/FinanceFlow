/**
 * 👤 Módulo de Usuarios
 * 
 * Maneja operaciones relacionadas con el perfil y gestión de usuarios.
 */

class UsuariosModule {
  constructor(httpClient) {
    this.client = httpClient;
  }

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<Object>} Datos del usuario
   */
  async getProfile() {
    try {
      const data = await this.client.get('/usuarios/profile');

      return {
        success: true,
        usuario: data,
        message: 'Perfil obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener perfil',
        ...error
      };
    }
  }

  /**
   * Actualizar perfil del usuario
   * @param {Object} profileData - Datos a actualizar
   * @param {string} [profileData.nombre] - Nombre del usuario
   * @param {string} [profileData.email] - Email del usuario
   * @param {Object} [profileData.preferencias] - Preferencias del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateProfile(profileData) {
    try {
      const data = await this.client.put('/usuarios/profile', profileData);

      return {
        success: true,
        usuario: data,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al actualizar perfil',
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
        message: data.message || 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al cambiar contraseña',
        ...error
      };
    }
  }

  /**
   * Obtener configuraciones del usuario
   * @returns {Promise<Object>} Configuraciones
   */
  async getSettings() {
    try {
      const data = await this.client.get('/usuarios/settings');

      return {
        success: true,
        configuraciones: data,
        message: 'Configuraciones obtenidas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener configuraciones',
        ...error
      };
    }
  }

  /**
   * Actualizar configuraciones del usuario
   * @param {Object} settings - Nuevas configuraciones
   * @returns {Promise<Object>} Configuraciones actualizadas
   */
  async updateSettings(settings) {
    try {
      const data = await this.client.put('/usuarios/settings', settings);

      return {
        success: true,
        configuraciones: data,
        message: 'Configuraciones actualizadas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al actualizar configuraciones',
        ...error
      };
    }
  }

  /**
   * Obtener estadísticas del usuario
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    try {
      const data = await this.client.get('/usuarios/stats');

      return {
        success: true,
        estadisticas: data,
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener estadísticas',
        ...error
      };
    }
  }

  /**
   * Obtener actividad reciente del usuario
   * @param {Object} params - Parámetros de filtrado
   * @param {number} [params.limit=10] - Límite de resultados
   * @param {string} [params.fechaInicio] - Fecha de inicio
   * @param {string} [params.fechaFin] - Fecha de fin
   * @returns {Promise<Object>} Actividad reciente
   */
  async getActivity(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/usuarios/activity?${queryString}` : '/usuarios/activity';
      
      const data = await this.client.get(url);

      return {
        success: true,
        actividad: data,
        message: 'Actividad obtenida exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener actividad',
        ...error
      };
    }
  }

  /**
   * Eliminar cuenta de usuario
   * @param {string} password - Contraseña para confirmar eliminación
   * @returns {Promise<Object>}
   */
  async deleteAccount(password) {
    try {
      const data = await this.client.delete('/usuarios/account', {
        data: { password }
      });

      return {
        success: true,
        message: data.message || 'Cuenta eliminada exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al eliminar cuenta',
        ...error
      };
    }
  }

  /**
   * Exportar datos del usuario
   * @param {string} [format='json'] - Formato de exportación (json, csv, pdf)
   * @returns {Promise<Object>} Datos exportados
   */
  async exportData(format = 'json') {
    try {
      const data = await this.client.get(`/usuarios/export?format=${format}`);

      return {
        success: true,
        data: data,
        format: format,
        message: 'Datos exportados exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al exportar datos',
        ...error
      };
    }
  }

  /**
   * Obtener sesiones activas
   * @returns {Promise<Object>} Sesiones activas
   */
  async getActiveSessions() {
    try {
      const data = await this.client.get('/usuarios/sessions');

      return {
        success: true,
        sesiones: data,
        message: 'Sesiones obtenidas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener sesiones',
        ...error
      };
    }
  }

  /**
   * Cerrar una sesión específica
   * @param {string} sessionId - ID de la sesión a cerrar
   * @returns {Promise<Object>}
   */
  async closeSession(sessionId) {
    try {
      const data = await this.client.delete(`/usuarios/sessions/${sessionId}`);

      return {
        success: true,
        message: data.message || 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al cerrar sesión',
        ...error
      };
    }
  }

  /**
   * Cerrar todas las sesiones excepto la actual
   * @returns {Promise<Object>}
   */
  async closeAllSessions() {
    try {
      const data = await this.client.delete('/usuarios/sessions/all');

      return {
        success: true,
        message: data.message || 'Todas las sesiones cerradas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al cerrar todas las sesiones',
        ...error
      };
    }
  }
}

export default UsuariosModule;