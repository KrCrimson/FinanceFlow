/**
 * 📊 Módulo de Reportes
 * 
 * Maneja todas las operaciones relacionadas con reportes,
 * análisis financiero y generación de gráficos.
 */

class ReportesModule {
  constructor(httpClient) {
    this.client = httpClient;
  }

  /**
   * Obtener reporte de balance general
   * @param {Object} params - Parámetros del reporte
   * @param {string} [params.fechaInicio] - Fecha inicio (YYYY-MM-DD)
   * @param {string} [params.fechaFin] - Fecha fin (YYYY-MM-DD)
   * @param {string} [params.agrupacion] - Agrupación (dia, semana, mes, año)
   * @returns {Promise<Object>} Reporte de balance
   */
  async getBalance(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/reportes/balance?${queryString}` : '/reportes/balance';
      
      const data = await this.client.get(url);

      return {
        success: true,
        balance: data,
        message: 'Reporte de balance obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener reporte de balance',
        ...error
      };
    }
  }

  /**
   * Obtener análisis de gastos por categoría
   * @param {Object} params - Parámetros del análisis
   * @param {string} [params.mes] - Mes específico (YYYY-MM)
   * @param {string} [params.año] - Año específico (YYYY)
   * @param {boolean} [params.incluirSubcategorias] - Incluir subcategorías
   * @returns {Promise<Object>} Análisis por categorías
   */
  async getGastosPorCategoria(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/reportes/gastos-categoria?${queryString}` : '/reportes/gastos-categoria';
      
      const data = await this.client.get(url);

      return {
        success: true,
        analisis: data,
        message: 'Análisis por categorías obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener análisis por categorías',
        ...error
      };
    }
  }

  /**
   * Obtener tendencias temporales
   * @param {Object} params - Parámetros de tendencias
   * @param {string} [params.periodo] - Periodo (3m, 6m, 1y, todo)
   * @param {string} [params.tipo] - Tipo de movimiento (ingreso, egreso, ambos)
   * @param {string} [params.granularidad] - Granularidad (dia, semana, mes)
   * @returns {Promise<Object>} Datos de tendencias
   */
  async getTendencias(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/reportes/tendencias?${queryString}` : '/reportes/tendencias';
      
      const data = await this.client.get(url);

      return {
        success: true,
        tendencias: data,
        message: 'Tendencias obtenidas exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener tendencias',
        ...error
      };
    }
  }

  /**
   * Obtener dashboard de métricas principales
   * @param {Object} params - Parámetros del dashboard
   * @param {string} [params.periodo] - Periodo para las métricas
   * @returns {Promise<Object>} Métricas del dashboard
   */
  async getDashboard(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/reportes/dashboard?${queryString}` : '/reportes/dashboard';
      
      const data = await this.client.get(url);

      return {
        success: true,
        dashboard: data,
        message: 'Dashboard obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener dashboard',
        ...error
      };
    }
  }

  /**
   * Generar reporte mensual
   * @param {string} año - Año del reporte (YYYY)
   * @param {string} mes - Mes del reporte (MM)
   * @returns {Promise<Object>} Reporte mensual completo
   */
  async getReporteMensual(año, mes) {
    try {
      const data = await this.client.get(`/reportes/mensual/${año}/${mes}`);

      return {
        success: true,
        reporte: data,
        periodo: `${año}-${mes}`,
        message: 'Reporte mensual generado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al generar reporte mensual',
        ...error
      };
    }
  }

  /**
   * Generar reporte anual
   * @param {string} año - Año del reporte (YYYY)
   * @returns {Promise<Object>} Reporte anual completo
   */
  async getReporteAnual(año) {
    try {
      const data = await this.client.get(`/reportes/anual/${año}`);

      return {
        success: true,
        reporte: data,
        año: año,
        message: 'Reporte anual generado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al generar reporte anual',
        ...error
      };
    }
  }

  /**
   * Obtener comparativa entre periodos
   * @param {Object} params - Parámetros de comparación
   * @param {string} params.periodo1Inicio - Inicio primer periodo
   * @param {string} params.periodo1Fin - Fin primer periodo
   * @param {string} params.periodo2Inicio - Inicio segundo periodo
   * @param {string} params.periodo2Fin - Fin segundo periodo
   * @returns {Promise<Object>} Comparativa entre periodos
   */
  async getComparativa(params) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const data = await this.client.get(`/reportes/comparativa?${queryParams.toString()}`);

      return {
        success: true,
        comparativa: data,
        message: 'Comparativa generada exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al generar comparativa',
        ...error
      };
    }
  }

  /**
   * Exportar reporte a formato específico
   * @param {string} tipo - Tipo de reporte (balance, gastos-categoria, mensual, etc.)
   * @param {string} formato - Formato de exportación (pdf, excel, csv)
   * @param {Object} params - Parámetros específicos del reporte
   * @returns {Promise<Object>} Archivo exportado
   */
  async exportarReporte(tipo, formato, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      queryParams.append('formato', formato);

      const data = await this.client.get(`/reportes/${tipo}/export?${queryParams.toString()}`);

      return {
        success: true,
        archivo: data,
        tipo: tipo,
        formato: formato,
        message: 'Reporte exportado exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al exportar reporte',
        ...error
      };
    }
  }

  /**
   * Obtener datos para gráficos específicos
   * @param {string} tipoGrafico - Tipo de gráfico (barras, lineas, pie, area)
   * @param {Object} params - Parámetros del gráfico
   * @returns {Promise<Object>} Datos formateados para el gráfico
   */
  async getDatosGrafico(tipoGrafico, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString 
        ? `/reportes/graficos/${tipoGrafico}?${queryString}` 
        : `/reportes/graficos/${tipoGrafico}`;
      
      const data = await this.client.get(url);

      return {
        success: true,
        datos: data,
        tipo: tipoGrafico,
        message: 'Datos del gráfico obtenidos exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener datos del gráfico',
        ...error
      };
    }
  }

  /**
   * Obtener resumen ejecutivo
   * @param {Object} params - Parámetros del resumen
   * @returns {Promise<Object>} Resumen ejecutivo
   */
  async getResumenEjecutivo(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/reportes/resumen-ejecutivo?${queryString}` : '/reportes/resumen-ejecutivo';
      
      const data = await this.client.get(url);

      return {
        success: true,
        resumen: data,
        message: 'Resumen ejecutivo obtenido exitosamente'
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Error al obtener resumen ejecutivo',
        ...error
      };
    }
  }
}

export default ReportesModule;