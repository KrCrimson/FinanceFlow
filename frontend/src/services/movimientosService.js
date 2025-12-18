// Servicio para movimientos
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
    const response = await fetch(`${API_BASE}/movimientos`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener movimientos');
    }
    
    const data = await response.json();
    return data || []; // Asegurar que siempre retorne un array
  } catch (error) {
    console.error('Error en getMovimientos:', error);
    throw error;
  }
}

export async function createMovimiento(data) {
  try {
    const response = await fetch(`${API_BASE}/movimientos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear movimiento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en createMovimiento:', error);
    throw error;
  }
}

export async function updateMovimiento(id, data) {
  try {
    const response = await fetch(`${API_BASE}/movimientos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar movimiento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en updateMovimiento:', error);
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
