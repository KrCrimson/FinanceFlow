// Servicio para movimientos
import logger from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_BASE = `${API_BASE_URL}/api`;

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function getMovimientos() {
  try {
    logger.debug('Obteniendo movimientos');
    const response = await fetch(`${API_BASE}/movimientos`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    logger.debug('Movimientos obtenidos exitosamente', { count: data?.length || 0 });
    return data || []; // Asegurar que siempre retorne un array
  } catch (error) {
    logger.logApiError('/movimientos', error);
    throw error;
  }
}

export async function createMovimiento(data) {
  try {
    logger.debug('Creando movimiento', { data });
    const response = await fetch(`${API_BASE}/movimientos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP ${response.status}`);
    }
    
    const result = await response.json();
    logger.info('Movimiento creado exitosamente', { id: result._id, tipo: data.tipo });
    return result;
  } catch (error) {
    logger.logApiError('/movimientos (POST)', error, data);
    throw error;
  }
}

export async function updateMovimiento(id, data) {
  try {
    logger.debug('Actualizando movimiento', { id, data });
    const response = await fetch(`${API_BASE}/movimientos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP ${response.status}`);
    }
    
    const result = await response.json();
    logger.info('Movimiento actualizado exitosamente', { id });
    return result;
  } catch (error) {
    logger.logApiError(`/movimientos/${id} (PUT)`, error, { id, data });
    throw error;
  }
}

export async function inhabilitarMovimiento(id) {
  try {
    const response = await fetch(`${API_BASE}/movimientos/${id}/inactivar`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al inhabilitar movimiento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en inhabilitarMovimiento:', error);
    throw error;
  }
}
