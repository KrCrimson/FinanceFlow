/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/services/adminService.js
 * Capa / módulo ...: Frontend · Servicio
 * Función .........: Pide al backend las métricas, usuarios y pagos del portal y los cambios de plan y de pago.
 * Requerimientos ..: RF-35, RF-36  (módulos: Administración)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-22 Administrar la plataforma
 * Reglas de negocio : RN-22
 * Lo usan .........: frontend/src/pages/AdminDashboardPage.jsx
 * Pruebas .........: frontend/src/__tests__/services.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
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
