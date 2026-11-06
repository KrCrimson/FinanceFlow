/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/services/mfaService.js
 * Capa / módulo ...: Frontend · Servicio
 * Función .........: Pide al backend configurar, activar y desactivar la verificación en dos pasos; al activar guarda la sesión nueva (con segundo factor).
 * Requerimientos ..: RF-41, RF-43  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-23 Configurar la verificación en dos pasos (MFA)
 * Reglas de negocio : RN-27
 * Lo usan .........: frontend/src/components/MfaSection.jsx
 * Pruebas .........: frontend/src/__tests__/MfaSection.test.jsx
 *                    frontend/src/__tests__/mfaService.test.js
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
// Servicio de verificación en dos pasos (MFA) desde Mi Perfil: configurar, activar y desactivar.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = `${API_BASE_URL}/api/usuarios/mfa`;

const cabeceras = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

async function enviar(ruta, cuerpo) {
  const res = await fetch(`${API}/${ruta}`, {
    method: 'POST',
    headers: cabeceras(),
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'No se pudo completar la operación');
  return data;
}

/** Paso 1: pide un secreto nuevo. Devuelve { secreto, otpauthUrl } para mostrar el QR. */
export const configurarMfa = () => enviar('configurar');

/** Paso 2: confirma con el primer código de la app. Guarda la sesión nueva y devuelve los códigos de recuperación. */
export async function activarMfa(codigo) {
  const data = await enviar('activar', { codigo });
  if (data.token) localStorage.setItem('token', data.token); // la sesión pasa a ser una sesión con segundo factor
  return data;
}

/** Desactiva el MFA (pide contraseña y un código de la app o de recuperación). */
export const desactivarMfa = (password, codigo) => enviar('desactivar', { password, codigo });
