/**
 * 🔄 Wrapper ES6 para Reportes - FASE 3
 * 
 * Este archivo redirige las llamadas al adaptador manteniendo
 * la compatibilidad con ES6 modules del frontend.
 */

// Import estático directo del adaptador
import reportesAdapter from './reportes-adapter.js';

// Exportar métodos principales directamente
export async function getReportes(...args) {
  try {
    return await reportesAdapter.getReportes(...args);
  } catch (error) {
    console.error('Error en getReportes:', error);
    // Fallback simple en caso de error
    return [];
  }
}
}

// Exportar métodos principales
export async function generateReport(...args) {
  try {
    return await reportesAdapter.generateReport(...args);
  } catch (error) {
    console.error('Error en generateReport:', error);
    throw error;
  }
}

export async function exportReport(...args) {
  try {
    return await reportesAdapter.exportReport(...args);
  } catch (error) {
    console.error('Error en exportReport:', error);
    throw error;
  }
}

export async function getReportStats(...args) {
  try {
    return await reportesAdapter.getReportStats(...args);
  } catch (error) {
    console.error('Error en getReportStats:', error);
    throw error;
  }
}

// Exportar métodos de control
export async function updateToken(token) {
  try {
    return reportesAdapter.updateToken(token);
  } catch (error) {
    console.warn('updateToken no disponible en adaptador Reportes');
  }
}

export async function getAdapterStats() {
  try {
    return reportesAdapter.getAdapterStats();
  }
}
