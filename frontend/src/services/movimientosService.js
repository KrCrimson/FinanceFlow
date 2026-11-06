/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/services/movimientosService.js
 * Capa / módulo ...: Frontend · Servicio
 * Función .........: Pide al backend listar, crear, corregir y desactivar movimientos.
 * Requerimientos ..: RF-09, RF-12, RF-13, RF-14  (módulos: Movimientos)
 * Casos de uso ....: CU-05 Consultar resumen y balance (Panel principal)
 *                    CU-06 Registrar movimiento manual
 *                    CU-08 Desactivar movimiento
 *                    CU-11 Planificar compras (Carrera de compras planificadas)
 *                    CU-17 Marcar y quitar ingreso constante
 * Lo usan .........: frontend/src/services/movimientos-adapter.js
 *                    sdk/adapters/movimientos-adapter.js
 * Pruebas .........: frontend/src/__tests__/ReportesPage.test.jsx
 *                    sdk/tests/movimientos-adapter.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
/**
 * 🚨 EMERGENCY FALLBACK - Movimientos Service
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
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errorMessage = errData.error;
        } else if (errData && errData.message) {
          errorMessage = errData.message;
        }
      } catch (e) {
        // Ignorar si no hay cuerpo JSON legible
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Exportar métodos básicos
export async function getMovimientos(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/movimientos?${queryString}` : '/movimientos';
    return await apiCall(url);
  } catch (error) {
    console.error('Error en getMovimientos:', error);
    return []; // Fallback a array vacío
  }
}

export async function createMovimiento(movimiento) {
  try {
    return await apiCall('/movimientos', {
      method: 'POST',
      body: JSON.stringify(movimiento)
    });
  } catch (error) {
    console.error('Error en createMovimiento:', error);
    throw error;
  }
}

export async function updateMovimiento(id, movimiento) {
  try {
    return await apiCall(`/movimientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movimiento)
    });
  } catch (error) {
    console.error('Error en updateMovimiento:', error);
    throw error;
  }
}

export async function inhabilitarMovimiento(id) {
  try {
    return await apiCall(`/movimientos/${id}/inhabilitar`, {
      method: 'PATCH'
    });
  } catch (error) {
    console.error('Error en inhabilitarMovimiento:', error);
    throw error;
  }
}

// Métodos adicionales con implementación básica
export async function getMovimientoById(id) {
  try {
    return await apiCall(`/movimientos/${id}`);
  } catch (error) {
    console.error('Error en getMovimientoById:', error);
    return null;
  }
}

export async function getIngresos(params = {}) {
  try {
    const queryString = new URLSearchParams({...params, tipo: 'ingreso'}).toString();
    return await apiCall(`/movimientos?${queryString}`);
  } catch (error) {
    console.error('Error en getIngresos:', error);
    return [];
  }
}

export async function getEgresos(params = {}) {
  try {
    const queryString = new URLSearchParams({...params, tipo: 'egreso'}).toString();
    return await apiCall(`/movimientos?${queryString}`);
  } catch (error) {
    console.error('Error en getEgresos:', error);
    return [];
  }
}

export async function getResumen(params = {}) {
  try {
    return await apiCall(`/movimientos/resumen?${new URLSearchParams(params).toString()}`);
  } catch (error) {
    console.error('Error en getResumen:', error);
    return { ingresos: 0, egresos: 0, balance: 0 };
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

export async function createMovimientoHistorico(movimiento) {
  try {
    return await apiCall('/movimientos/historico', {
      method: 'POST',
      body: JSON.stringify(movimiento)
    });
  } catch (error) {
    console.error('Error en createMovimientoHistorico:', error);
    throw error;
  }
}