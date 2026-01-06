/**
 * 🔄 Adaptador de Reportes - Reports Service
 * 
 * FASE 2: Wrapper que mantiene la API existente pero usa el SDK internamente.
 * Permite migración gradual sin romper el frontend existente.
 */

// Importar servicio original para fallback
import * as originalService from './reportesService.js';

class ReportesAdapter {
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
        enableSDK: adapterConfig.isAdapterEnabled('reportes'),
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
      this.log('SDK Reportes deshabilitado por configuración', 'info');
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
      this.log('SDK Reportes inicializado exitosamente', 'success');
    } catch (error) {
      this.log(`Error inicializando SDK Reportes: ${error.message}`, 'error');
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
    
    console.log(`[${timestamp}] ${prefix} [ReportesAdapter] ${message}`);
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
      case 'getReportes':
        return sdkResult.logs || sdkResult.reportes || sdkResult.data || [];
      
      case 'generateReport':
        return sdkResult.reporte || sdkResult.data;
      
      case 'exportReport':
        return sdkResult.url || sdkResult.data;
      
      default:
        return sdkResult.data || sdkResult;
    }
  }

  /**
   * INTERFAZ PÚBLICA - Mantiene exactamente la misma API del servicio original
   */

  /**
   * Obtener reportes con parámetros opcionales
   * Mantiene la misma interfaz que getReportes(params) original
   */
  async getReportes(params) {
    return this.executeWithFallback(
      async (reportParams) => await this.sdk.reportes.getAll(reportParams),
      originalService.getReportes,
      'getReportes',
      params
    );
  }

  /**
   * Métodos adicionales del SDK (opcionales)
   */

  /**
   * Generar reporte financiero específico (nuevo método del SDK)
   */
  async generateReport(type, params = {}) {
    if (!this.isSDKEnabled) {
      // Fallback: generar reporte básico usando getReportes
      const reportes = await this.getReportes(params);
      return this.generateBasicReport(reportes, type, params);
    }
    
    try {
      const result = await this.sdk.reportes.generate(type, params);
      return this.adaptSDKResponse(result, 'generateReport');
    } catch (error) {
      this.log(`Error generando reporte: ${error.message}`, 'error');
      // Fallback a reporte básico
      const reportes = await this.getReportes(params);
      return this.generateBasicReport(reportes, type, params);
    }
  }

  /**
   * Generar reporte básico como fallback
   */
  generateBasicReport(reportes, type, params) {
    const now = new Date();
    const report = {
      type,
      generatedAt: now.toISOString(),
      period: params.periodo || 'actual',
      summary: {
        totalEntries: reportes.length,
        dateRange: {
          from: params.fechaInicio || 'N/A',
          to: params.fechaFin || 'N/A'
        }
      },
      data: reportes
    };

    // Agregar análisis básico según tipo
    switch (type) {
      case 'financial':
        report.analysis = this.generateFinancialAnalysis(reportes);
        break;
      case 'activity':
        report.analysis = this.generateActivityAnalysis(reportes);
        break;
      default:
        report.analysis = { message: 'Reporte generado sin análisis específico' };
    }

    return report;
  }

  /**
   * Análisis financiero básico
   */
  generateFinancialAnalysis(reportes) {
    // Asumiendo que reportes contiene información de movimientos
    const ingresos = reportes.filter(r => r.tipo === 'ingreso').length;
    const egresos = reportes.filter(r => r.tipo === 'egreso').length;
    
    return {
      totalMovimientos: reportes.length,
      ingresos,
      egresos,
      ratio: egresos > 0 ? (ingresos / egresos).toFixed(2) : 'N/A'
    };
  }

  /**
   * Análisis de actividad básico
   */
  generateActivityAnalysis(reportes) {
    const groupedByDate = reportes.reduce((acc, reporte) => {
      const date = reporte.fecha?.split('T')[0] || 'unknown';
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      totalDays: Object.keys(groupedByDate).length,
      avgPerDay: reportes.length / Object.keys(groupedByDate).length || 0,
      mostActiveDay: Object.entries(groupedByDate)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
    };
  }

  /**
   * Exportar reporte en diferentes formatos (nuevo método del SDK)
   */
  async exportReport(reportData, format = 'json') {
    if (!this.isSDKEnabled) {
      // Fallback: generar export básico
      return this.generateBasicExport(reportData, format);
    }
    
    try {
      const result = await this.sdk.reportes.export(reportData, format);
      return this.adaptSDKResponse(result, 'exportReport');
    } catch (error) {
      this.log(`Error exportando reporte: ${error.message}`, 'error');
      // Fallback a export básico
      return this.generateBasicExport(reportData, format);
    }
  }

  /**
   * Generar export básico como fallback
   */
  generateBasicExport(reportData, format) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `reporte-${timestamp}.${format}`;

    switch (format.toLowerCase()) {
      case 'json':
        return {
          filename,
          content: JSON.stringify(reportData, null, 2),
          mimeType: 'application/json'
        };
      
      case 'csv':
        return {
          filename: `reporte-${timestamp}.csv`,
          content: this.convertToCSV(reportData),
          mimeType: 'text/csv'
        };
      
      default:
        throw new Error(`Formato ${format} no soportado en fallback`);
    }
  }

  /**
   * Convertir datos a CSV
   */
  convertToCSV(reportData) {
    if (!reportData.data || !Array.isArray(reportData.data)) {
      return 'No data available';
    }

    const headers = Object.keys(reportData.data[0] || {}).join(',');
    const rows = reportData.data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Obtener estadísticas de reportes (nuevo método del SDK)
   */
  async getReportStats(params = {}) {
    if (!this.isSDKEnabled) {
      // Fallback: calcular estadísticas básicas
      const reportes = await this.getReportes(params);
      return this.calculateBasicStats(reportes);
    }
    
    try {
      const result = await this.sdk.reportes.getStats(params);
      return this.adaptSDKResponse(result, 'getReportStats');
    } catch (error) {
      this.log(`Error obteniendo estadísticas: ${error.message}`, 'error');
      const reportes = await this.getReportes(params);
      return this.calculateBasicStats(reportes);
    }
  }

  /**
   * Calcular estadísticas básicas
   */
  calculateBasicStats(reportes) {
    return {
      total: reportes.length,
      lastUpdate: reportes[0]?.fecha || null,
      periodo: 'actual',
      generatedAt: new Date().toISOString()
    };
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
const reportesAdapter = new ReportesAdapter();

// Exportar los métodos manteniendo la misma interfaz
export const getReportes = (...args) => reportesAdapter.getReportes(...args);

// Exportar métodos nuevos del SDK (opcionales)
export const generateReport = (...args) => reportesAdapter.generateReport(...args);
export const exportReport = (...args) => reportesAdapter.exportReport(...args);
export const getReportStats = (...args) => reportesAdapter.getReportStats(...args);

// Exportar controles del adaptador
export const updateToken = (token) => reportesAdapter.updateToken(token);
export const getAdapterStats = () => reportesAdapter.getAdapterStats();

// Exportar instancia para uso avanzado
export { reportesAdapter };

// Default export mantiene compatibilidad
export default {
  getReportes,
  // Métodos nuevos
  generateReport,
  exportReport,
  getReportStats,
  // Controles
  updateToken,
  getAdapterStats
};