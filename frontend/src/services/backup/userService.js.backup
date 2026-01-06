// Servicio para usuario
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

export async function getProfile() {
  try {
    const response = await fetch(`${API_BASE}/usuarios/me`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getProfile:', error);
    throw error;
  }
}

export async function updateProfile(data) {
  try {
    const response = await fetch(`${API_BASE}/usuarios/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en updateProfile:', error);
    throw error;
  }
}
