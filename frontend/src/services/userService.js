/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/services/userService.js
 * Capa / módulo ...: Frontend · Servicio
 * Función .........: Consulta, actualiza y elimina el perfil del usuario.
 * Requerimientos ..: RF-07, RF-08  (módulos: Perfil)
 * Casos de uso ....: CU-12 Gestionar información de perfil
 *                    CU-18 Eliminar cuenta
 * Lo usan .........: frontend/src/services/usuarios-adapter.js
 * Pruebas .........: frontend/src/__tests__/services.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Servicio para usuario
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

export async function deleteProfile() {
  try {
    const response = await fetch(`${API_BASE}/usuarios/me`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar perfil');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en deleteProfile:', error);
    throw error;
  }
}
