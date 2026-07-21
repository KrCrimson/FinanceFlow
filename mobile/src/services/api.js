import { API_URL } from '../config/env';

let userToken = null;

export const setAuthToken = (token) => {
  userToken = token;
};

export const getAuthToken = () => {
  return userToken;
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Algo salió mal');
  }

  return data;
};

// Endpoints de Autenticación
export const loginUser = async (email, password) => {
  const data = await apiFetch('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const registerUser = async (nombre, email, password) => {
  return await apiFetch('/usuarios/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password })
  });
};

export const forgotPassword = async (email) => {
  return await apiFetch('/usuarios/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

// Endpoints de Movimientos
export const fetchMovimientos = async () => {
  return await apiFetch('/movimientos');
};

export const createMovimiento = async (movimientoData) => {
  return await apiFetch('/movimientos', {
    method: 'POST',
    body: JSON.stringify(movimientoData)
  });
};

export const toggleMovimientoEstado = async (id, inactivo = false) => {
  const action = inactivo ? 'inhabilitar' : 'inhabilitar'; // toggle endpoint
  return await apiFetch(`/movimientos/${id}/inhabilitar`, {
    method: 'PATCH'
  });
};
