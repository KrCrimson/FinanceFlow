// Servicio para reportes
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

export async function getReportes(params) {
  try {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE}/logs${queryString ? `?${queryString}` : ''}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener reportes');
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error en getReportes:', error);
    throw error;
  }
}
