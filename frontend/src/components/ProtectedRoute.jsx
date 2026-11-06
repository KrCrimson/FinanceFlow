/**
 * ═══ FinanceFlow · Trazabilidad ═══
 * Archivo .........: frontend/src/components/ProtectedRoute.jsx
 * Capa / módulo ...: Frontend · Seguridad
 * Función .........: Impide ver pantallas privadas sin sesión y lleva a la presentación.
 * Requerimientos ..: RF-02  (módulos: Cuenta)
 * Calidad (RNF) ...: RNF-02
 * Casos de uso ....: CU-02 Iniciar sesión
 *                    CU-13 Cerrar sesión
 * Reglas de negocio : RN-07
 * Depende de ......: frontend/src/hooks/useAuth.js
 * Lo usan .........: frontend/src/App.jsx
 * Pruebas .........: frontend/src/__tests__/componentes-base.test.jsx
 * Documento .......: SRS FinanceFlow v4.0 (G03-FinanceFlow-FD03), Anexo A – Trazabilidad
 * Autores .........: Grupo G03 – Sebastian Arce Bracamonte, Brant Antony Chata Choque
 * ════════════════════════════════════════════════════════════
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-400">Cargando FinanceFlow...</div>;
  if (!user) return <Navigate to="/landing" replace />;
  return children;
}

export default ProtectedRoute;
