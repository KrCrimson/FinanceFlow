/**
 * 💰 Módulo de Movimientos
 * 
 * Maneja todas las operaciones CRUD de movimientos financieros:
 * crear, leer, actualizar, eliminar ingresos y egresos.
 */

class MovimientosModule {
  constructor(httpClient) {
    this.client = httpClient;
  }

  /**
   * Obtener todos los movimientos
   * @param {Object} params - Parámetros de filtrado
   * @param {string} [params.tipo] - Tipo de movimiento (ingreso/egreso)
   * @param {string} [params.categoria] - Categoría del movimiento
   * @param {string} [params.fechaInicio] - Fecha de inicio (YYYY-MM-DD)
   * @param {string} [params.fechaFin] - Fecha de fin (YYYY-MM-DD)
   * @param {number} [params.page=1] - Página para paginación
   * @param {number} [params.limit=10] - Límite por página
   * @returns {Promise<Object>} Lista de movimientos
   */
  async getAll(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/movimientos?${queryString}` : '/movimientos';
      
      const data = await this.client.get(url);

      return {
        success: true,
        movimientos: data.movimientos || data,
        pagination: data.pagination || null,
        message: 'Movimientos obtenidos exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener movimientos',
        ...error
      };
    }
  }

  /**
   * Obtener un movimiento por ID
   * @param {string} id - ID del movimiento
   * @returns {Promise<Object>} Movimiento encontrado
   */
  async getById(id) {
    try {
      const data = await this.client.get(`/movimientos/${id}`);

      return {
        success: true,
        movimiento: data,
        message: 'Movimiento obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener movimiento',
        ...error
      };
    }
  }

  /**
   * Crear un nuevo movimiento
   * @param {Object} movimientoData - Datos del movimiento
   * @param {string} movimientoData.tipo - Tipo (ingreso/egreso)
   * @param {string} movimientoData.categoria - Categoría
   * @param {number} movimientoData.monto - Monto
   * @param {string} movimientoData.descripcion - Descripción
   * @param {string} [movimientoData.fecha] - Fecha (opcional, default: hoy)
   * @returns {Promise<Object>} Movimiento creado
   */
  async create(movimientoData) {
    try {
      const data = await this.client.post('/movimientos', movimientoData);

      return {
        success: true,
        movimiento: data,
        message: 'Movimiento creado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al crear movimiento',
        ...error
      };
    }
  }

  /**
   * Actualizar un movimiento
   * @param {string} id - ID del movimiento
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Movimiento actualizado
   */
  async update(id, updateData) {
    try {
      const data = await this.client.put(`/movimientos/${id}`, updateData);

      return {
        success: true,
        movimiento: data,
        message: 'Movimiento actualizado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al actualizar movimiento',
        ...error
      };
    }
  }

  /**
   * Eliminar un movimiento
   * @param {string} id - ID del movimiento
   * @returns {Promise<Object>}
   */
  async delete(id) {
    try {
      await this.client.delete(`/movimientos/${id}`);

      return {
        success: true,
        message: 'Movimiento eliminado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al eliminar movimiento',
        ...error
      };
    }
  }

  /**
   * Obtener resumen financiero
   * @param {Object} params - Parámetros para el resumen
   * @param {string} [params.mes] - Mes específico (YYYY-MM)
   * @param {string} [params.año] - Año específico (YYYY)
   * @returns {Promise<Object>} Resumen financiero
   */
  async getResumen(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/movimientos/resumen?${queryString}` : '/movimientos/resumen';
      
      const data = await this.client.get(url);

      return {
        success: true,
        resumen: data,
        message: 'Resumen obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener resumen',
        ...error
      };
    }
  }

  /**
   * Obtener movimientos por categoría
   * @param {string} categoria - Categoría a filtrar
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} Movimientos de la categoría
   */
  async getByCategoria(categoria, params = {}) {
    return this.getAll({ ...params, categoria });
  }

  /**
   * Obtener ingresos
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Object>} Lista de ingresos
   */
  async getIngresos(params = {}) {
    return this.getAll({ ...params, tipo: 'ingreso' });
  }

  /**
   * Obtener egresos
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise<Object>} Lista de egresos
   */
  async getEgresos(params = {}) {
    return this.getAll({ ...params, tipo: 'egreso' });
  }

  /**
   * Obtener categorías disponibles
   * @returns {Promise<Object>} Lista de categorías
   */
  async getCategorias() {
    try {
      const data = await this.client.get('/movimientos/categorias');

      return {
        success: true,
        categorias: data,
        message: 'Categorías obtenidas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener categorías',
        ...error
      };
    }
  }

  /**
   * Crear múltiples movimientos en lote
   * @param {Array} movimientos - Array de movimientos a crear
   * @returns {Promise<Object>} Resultado del procesamiento en lote
   */
  async createBatch(movimientos) {
    try {
      const data = await this.client.post('/movimientos/batch', { movimientos });

      return {
        success: true,
        created: data.created || [],
        errors: data.errors || [],
        message: `${data.created?.length || 0} movimientos creados exitosamente`
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al crear movimientos en lote',
        ...error
      };
    }
  }
}

module.exports = MovimientosModule;