import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 📲 SERVICIO MÓVIL: Conexión idéntica a la Web pero validada para la nube móvil de Render.
 * 
 * URL quemada usando tu endpoint de render temporalmente (o mediante ENV si configuras dotenv)
 */
// Usamos la URL de tu backend como base (sin el localhost para el teléfono)
const API_BASE_URL = 'https://financeflow-backend-4fbw.onrender.com';

const apiCall = async (url, options = {}) => {
  try {
    // 1. En móviles no existe 'localStorage', usamos 'AsyncStorage'
    const token = await AsyncStorage.getItem('token');
    
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
    console.error(`[API Mobile Error en ${url}]:`, error);
    throw error;
  }
};

export async function getMovimientos(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/movimientos?${queryString}` : '/movimientos';   
    return await apiCall(url);
  } catch (error) {
    return []; // Fallback seguro
  }
}

export async function createMovimiento(movimiento) {
  return await apiCall('/movimientos', {
    method: 'POST',
    body: JSON.stringify(movimiento)
  });
}

// Nótese que aquí corregimos de entrada el "inhabilitar" para producción
export async function inhabilitarMovimiento(id) {
  return await apiCall(`/movimientos/${id}/inhabilitar`, {
    method: 'PATCH'
  });
}

export async function getResumen(params = {}) {
  try {
    return await apiCall(`/movimientos/resumen?${new URLSearchParams(params).toString()}`);
  } catch (error) {
    return { ingresos: 0, egresos: 0, balance: 0 };
  }
}

// Métodos de control
export async function updateToken(token) {
  if (token) {
    await AsyncStorage.setItem('token', token);
  } else {
    await AsyncStorage.removeItem('token');
  }
}