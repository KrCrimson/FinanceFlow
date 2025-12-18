import { useState, useEffect, useCallback } from 'react';
import { getToken, logout as logoutService, onAuthChange, isTokenValid } from '../services/authService';

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
