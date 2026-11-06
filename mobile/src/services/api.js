/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: mobile/src/services/api.js
 * Capa / módulo ...: Prototipo móvil · Fuera del alcance de esta versión (SRS III.4)
 * Función .........: Comunicación con la API y renovación de sesión del prototipo móvil.
 * Depende de ......: mobile/src/config/env.js
 * Lo usan .........: mobile/App.js
 *                    mobile/src/components/CajaChicaMobileModal.js
 *                    mobile/src/components/PaywallModal.js
 *                    mobile/src/screens/DashboardScreen.js
 *                    mobile/src/screens/ForgotPasswordScreen.js
 *                    mobile/src/screens/LoginScreen.js
 *                    mobile/src/screens/NewMovementScreen.js
 *                    mobile/src/screens/PlannerScreen.js
 *                    mobile/src/screens/ProfileScreen.js
 *                    mobile/src/screens/RegisterScreen.js
 *                    mobile/src/screens/RemindersScreen.js
 *                    mobile/src/screens/ReportsScreen.js
 * Nota ............: No implementa un requerimiento funcional del SRS: es soporte técnico, utilitario o prototipo.
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { API_URL } from "../config/env";

let userToken = null;
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const setAuthToken = (token) => {
  userToken = token;
};

export const getAuthToken = () => {
  return userToken;
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (userToken) {
    headers["Authorization"] = `Bearer ${userToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && !options._isRetry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            };
            options._isRetry = true;
            resolve(apiFetch(endpoint, options));
          });
        });
      }
    }
    throw new Error(data.error || data.message || "Algo salió mal");
  }

  return data;
};

// Endpoints de Autenticación
export const loginUser = async (email, password) => {
  const data = await apiFetch("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const registerUser = async (nombre, email, password) => {
  return await apiFetch("/usuarios/register", {
    method: "POST",
    body: JSON.stringify({ nombre, email, password }),
  });
};

export const forgotPassword = async (email) => {
  return await apiFetch("/usuarios/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

// Endpoints de Movimientos
export const fetchMovimientos = async () => {
  return await apiFetch("/movimientos");
};

export const createMovimiento = async (movimientoData) => {
  return await apiFetch("/movimientos", {
    method: "POST",
    body: JSON.stringify(movimientoData),
  });
};

export const toggleMovimientoEstado = async (id) => {
  return await apiFetch(`/movimientos/${id}/inhabilitar`, {
    method: "PATCH",
  });
};

export const updateMovimiento = async (id, movimientoData) => {
  return await apiFetch(`/movimientos/${id}`, {
    method: "PUT",
    body: JSON.stringify(movimientoData),
  });
};

// Endpoints de Arqueos / Cierres
export const fetchCierresPendientes = async (localDate) => {
  try {
    const query = localDate ? `?localDate=${localDate}` : "";
    return await apiFetch(`/cierres/pendientes${query}`);
  } catch (err) {
    return null;
  }
};

export const crearCierre = async (cierreData) => {
  return await apiFetch("/cierres", {
    method: "POST",
    body: JSON.stringify(cierreData),
  });
};

export const fetchResumenPeriodo = async (tipo, periodo) => {
  return await apiFetch(`/cierres/resumen?tipo=${tipo}&periodo=${periodo}`);
};

export const analyzeReceiptWithOCR = async (
  imageBase64,
  mimeType = "image/jpeg",
) => {
  return await apiFetch("/movimientos/ocr", {
    method: "POST",
    body: JSON.stringify({ imageBase64, mimeType }),
  });
};

// Endpoints de Pagos y Suscripción Pro
export const solicitarPlanPro = async (email, metodo, nroOperacion, monto) => {
  return await apiFetch("/pagos/solicitar-pro", {
    method: "POST",
    body: JSON.stringify({ email, metodo, nroOperacion, monto }),
  });
};

export const checkoutDirectoPro = async (
  email,
  metodo,
  pais,
  monto,
  moneda,
) => {
  return await apiFetch("/pagos/checkout-directo", {
    method: "POST",
    body: JSON.stringify({ email, metodo, pais, monto, moneda }),
  });
};

export const toggleDevPlan = async (email) => {
  return await apiFetch("/pagos/toggle-dev-plan", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const getEstadoPlan = async (email) => {
  try {
    return await apiFetch(`/pagos/estado-plan/${encodeURIComponent(email)}`);
  } catch (err) {
    return { esPremium: false, planTipo: "free" };
  }
};

// Endpoints de Recordatorios / Préstamos
export const fetchRecordatorios = async () => {
  return await apiFetch("/recordatorios");
};

export const createRecordatorio = async (recordatorioData) => {
  return await apiFetch("/recordatorios", {
    method: "POST",
    body: JSON.stringify(recordatorioData),
  });
};

export const updateRecordatorio = async (id, recordatorioData) => {
  return await apiFetch(`/recordatorios/${id}`, {
    method: "PUT",
    body: JSON.stringify(recordatorioData),
  });
};

export const deleteRecordatorio = async (id) => {
  return await apiFetch(`/recordatorios/${id}`, {
    method: "DELETE",
  });
};

