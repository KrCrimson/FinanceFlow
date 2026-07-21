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
