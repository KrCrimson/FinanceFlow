import axios from 'axios';
import { getToken } from '../utils/secureStore';

// URL base apuntando a tu backend de Render
const API_URL = 'https://finance-flow-production.up.railway.app'; // Reemplazar con URL de Render real mañana

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
