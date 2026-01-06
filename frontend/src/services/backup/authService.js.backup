// Servicio de autenticación con JWT

// Variables para manejar callbacks de autenticación
let authCallbacks = [];

// Función para registrar callbacks de cambio de autenticación
export function onAuthChange(callback) {
  authCallbacks.push(callback);
  return () => {
    authCallbacks = authCallbacks.filter(cb => cb !== callback);
  };
}

// Función para notificar cambios de autenticación
function notifyAuthChange() {
  authCallbacks.forEach(callback => callback());
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      notifyAuthChange(); // Notificar cambio de autenticación
    }
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}


export async function register(nombre, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'No se pudo registrar');
    }
    return await res.json();
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}


export function logout() {
  localStorage.removeItem('token');
  notifyAuthChange(); // Notificar cambio de autenticación
}

export function getToken() {
  return localStorage.getItem('token');
}

// Función para verificar si el token es válido (básico)
export function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Verificar si el token no está expirado
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isValid = payload.exp > Date.now() / 1000;
    
    // Si el token ha expirado, hacer logout automáticamente
    if (!isValid) {
      logout();
    }
    
    return isValid;
  } catch (error) {
    // Si hay error decodificando, eliminar token inválido
    logout();
    return false;
  }
}
