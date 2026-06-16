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

export async function crearCierre(cierreData) {
  try {
    const response = await fetch(`${API_BASE}/cierres`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cierreData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear el cierre');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en crearCierre:', error);
    throw error;
  }
}

export async function getResumenPeriodo(tipo, periodo) {
  try {
    const response = await fetch(`${API_BASE}/cierres/resumen?tipo=${tipo}&periodo=${periodo}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener resumen de periodo');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getResumenPeriodo:', error);
    throw error;
  }
}

export async function getCierres() {
  try {
    const response = await fetch(`${API_BASE}/cierres`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al listar cierres');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getCierres:', error);
    return [];
  }
}

export async function getCierresPendientes(localDate) {
  try {
    const dateQuery = localDate ? `?localDate=${localDate}` : '';
    const response = await fetch(`${API_BASE}/cierres/pendientes${dateQuery}`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener cierres pendientes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getCierresPendientes:', error);
    return null;
  }
}
