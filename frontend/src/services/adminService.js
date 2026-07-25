import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'https://financeflow-backend-4fbw.onrender.com') + '/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAdminMetrics = async () => {
  const response = await axios.get(`${API_URL}/metrics`, getAuthHeaders());
  return response.data;
};

export const getAdminUsuarios = async (query = '') => {
  const response = await axios.get(`${API_URL}/usuarios?q=${encodeURIComponent(query)}`, getAuthHeaders());
  return response.data;
};

export const toggleUserPremium = async (userId, esPremium) => {
  const response = await axios.post(`${API_URL}/toggle-premium`, { userId, esPremium }, getAuthHeaders());
  return response.data;
};

export const getAdminPagos = async (query = '') => {
  const response = await axios.get(`${API_URL}/pagos?q=${encodeURIComponent(query)}`, getAuthHeaders());
  return response.data;
};

export const aprobarRechazarPago = async (pagoId, nuevoEstado) => {
  const response = await axios.post(`${API_URL}/aprobar-pago`, { pagoId, nuevoEstado }, getAuthHeaders());
  return response.data;
};
