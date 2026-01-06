/**
 * 🚨 EMERGENCY FALLBACK - Reportes Service
 * 
 * Servicio básico sin SDK para evitar crashes de la aplicación.
 * Usa fetch directo al backend.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

// Función helper para hacer peticiones
const apiCall = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Método principal
export async function getReportes(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/reportes?${queryString}` : '/reportes';
    return await apiCall(url);
  } catch (error) {
    console.error('Error en getReportes:', error);
    return []; // Fallback a array vacío
  }
}

// Métodos adicionales con implementación básica
export async function generateReport(config) {
  try {
    return await apiCall('/reportes/generate', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  } catch (error) {
    console.error('Error en generateReport:', error);
    return { success: false, error: error.message };
  }
}

export async function exportReport(reportId, format = 'json') {
  try {
    return await apiCall(`/reportes/${reportId}/export?format=${format}`);
  } catch (error) {
    console.error('Error en exportReport:', error);
    return { success: false, error: error.message };
  }
}

export async function getReportStats() {
  try {
    return await apiCall('/reportes/stats');
  } catch (error) {
    console.error('Error en getReportStats:', error);
    return { total: 0, recent: 0 };
  }
}

// Métodos de control (no-ops para compatibilidad)
export function updateToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getAdapterStats() {
  return { status: 'Emergency fallback active', mode: 'direct-api' };
}