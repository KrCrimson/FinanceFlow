/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/hooks/useAuth.js
 * Capa / módulo ...: Frontend · Hook
 * Función .........: Mantiene el estado de sesión (usuario, carga, cierre y verificación de la vigencia de 7 días).
 * Requerimientos ..: RF-02, RF-06  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-13 Cerrar sesión
 * Reglas de negocio : RN-07
 * Depende de ......: frontend/src/services/auth-adapter.js
 * Lo usan .........: frontend/src/components/Navbar.jsx
 *                    frontend/src/components/ProtectedRoute.jsx
 *                    frontend/src/pages/LoginPage.jsx
 * Pruebas .........: frontend/src/__tests__/componentes-base.test.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import { useState, useEffect, useCallback } from 'react';
import { getToken, logout as logoutService, onAuthChange, isTokenValid } from '../services/auth-adapter';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar y actualizar el estado de autenticación
  const checkAuth = useCallback(() => {
    const token = getToken();
    if (token && isTokenValid()) {
      // Podrías decodificar el token para obtener más info del usuario
      // Por ahora solo verificamos que existe el token y es válido
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ 
          token, 
          id: payload.id,
          nombre: payload.nombre,
          email: payload.email 
        });
      } catch (error) {
        console.error('Error decodificando token:', error);
        setUser({ token });
      }
    } else {
      setUser(null);
      // Si el token no es válido, lo eliminamos
      if (token && !isTokenValid()) {
        logoutService();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Suscribirse a cambios de autenticación
    const unsubscribe = onAuthChange(() => {
      checkAuth();
    });

    return unsubscribe;
  }, [checkAuth]);

  // Función logout que actualiza el estado local
  const logout = useCallback(() => {
    logoutService(); // Elimina el token del localStorage y notifica
    setUser(null); // Actualiza el estado local inmediatamente
  }, []);

  // Función login que actualiza el estado después de autenticarse
  const updateAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, logout, updateAuth, checkAuth };
}
